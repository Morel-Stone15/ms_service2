from flask import Flask, request, jsonify, send_from_directory
import hashlib
import os
from dotenv import load_dotenv
load_dotenv()

from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GMAIL_USER   = os.getenv("GMAIL_USER", "morelstone15@gmail.com")
GMAIL_PASS   = os.getenv("GMAIL_PASS")

app = Flask(__name__, static_folder='.', static_url_path='')

def get_db():
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def hash_password(pw):
    return hashlib.sha256(pw.encode()).hexdigest()

# ── Auth guard ────────────────────────────────────────────
def require_admin():
    uid = request.headers.get('X-User-Id')
    if not uid:
        return None, (jsonify({"success": False, "message": "Non authentifié."}), 401)
    supabase = get_db()
    result = supabase.table('users').select('id,role').eq('id', uid).execute()
    if not result.data or result.data[0]['role'] != 'admin':
        return None, (jsonify({"success": False, "message": "Accès refusé."}), 403)
    return result.data[0], None

# ── Email ─────────────────────────────────────────────────
def send_email(subject, body):
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    try:
        msg = MIMEMultipart()
        msg['From']    = GMAIL_USER
        msg['To']      = GMAIL_USER
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        srv = smtplib.SMTP('smtp.gmail.com', 587)
        srv.starttls()
        srv.login(GMAIL_USER, GMAIL_PASS)
        srv.send_message(msg)
        srv.quit()
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False

def send_async(subject, body):
    import threading
    threading.Thread(target=send_email, args=(subject, body), daemon=True).start()

# ── Static ────────────────────────────────────────────────
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    if os.path.exists(path):
        return send_from_directory('.', path)
    return "Not Found", 404

# ── Register ──────────────────────────────────────────────
@app.route('/api/register', methods=['POST'])
def register():
    d     = request.json or {}
    nom   = (d.get('nom') or '').strip()
    email = (d.get('email') or '').strip().lower()
    phone = (d.get('phone') or '').strip()
    pw    = d.get('password') or ''
    if not all([nom, email, pw]):
        return jsonify({"success": False, "message": "Champs obligatoires manquants."}), 400

    supabase = get_db()
    # Check if email already exists
    existing = supabase.table('users').select('id').eq('email', email).execute()
    if existing.data:
        return jsonify({"success": False, "message": "Cet email est déjà utilisé."}), 400

    result = supabase.table('users').insert({
        'nom': nom, 'email': email, 'phone': phone,
        'password': hash_password(pw), 'role': 'client', 'status': 'active'
    }).execute()

    if result.data:
        user = result.data[0]
        return jsonify({"success": True, "user": {
            'id': user['id'], 'nom': user['nom'], 'email': user['email'],
            'phone': user['phone'], 'role': user['role'], 'status': user['status']
        }})
    return jsonify({"success": False, "message": "Erreur lors de l'inscription."}), 500

# ── Login ─────────────────────────────────────────────────
@app.route('/api/login', methods=['POST'])
def login():
    d     = request.json or {}
    email = (d.get('email') or '').strip().lower()
    pw    = d.get('password') or ''
    if not email or not pw:
        return jsonify({"success": False, "message": "Email et mot de passe requis."}), 400

    supabase = get_db()
    result = supabase.table('users').select(
        'id,nom,email,phone,role,status'
    ).eq('email', email).eq('password', hash_password(pw)).execute()

    if not result.data:
        return jsonify({"success": False, "message": "Email ou mot de passe incorrect."}), 401
    user = result.data[0]
    if user['status'] == 'suspended':
        return jsonify({"success": False, "message": "Compte suspendu. Contactez l'administrateur."}), 403
    return jsonify({"success": True, "user": user})

# ── Orders ────────────────────────────────────────────────
@app.route('/api/orders', methods=['GET', 'POST'])
def orders():
    supabase = get_db()

    if request.method == 'POST':
        d      = request.json or {}
        uid    = d.get('user_id')
        svc    = (d.get('service') or '').strip()
        mont   = d.get('montant')
        statut = d.get('statut', 'En attente')
        if not all([uid, svc, mont]):
            return jsonify({"success": False, "message": "Données incomplètes."}), 400

        result = supabase.table('orders').insert({
            'user_id': uid, 'service': svc,
            'montant': str(mont), 'statut': statut
        }).execute()

        if result.data:
            order = result.data[0]
            # Notify admin by email
            client_res = supabase.table('users').select('nom,email,phone').eq('id', uid).execute()
            if client_res.data:
                client = client_res.data[0]
                send_async(
                    f"📋 Nouvelle Commande MS SERVICE — {svc}",
                    f"NOUVELLE COMMANDE\n---\nClient : {client['nom']}\nEmail : {client['email']}\nTél : {client['phone']}\n---\nService : {svc}\nMontant : {mont}\nStatut : {statut}\n---\nConnectez-vous à l'admin pour valider."
                )
            order['date_commande'] = order.get('date') or order.get('created_at')
            return jsonify({"success": True, "order": order})
        return jsonify({"success": False, "message": "Erreur lors de la commande."}), 500

    # GET
    uid = request.args.get('user_id')
    if uid:
        result = supabase.table('orders').select(
            'id,user_id,service,montant,statut,date'
        ).eq('user_id', uid).order('date', desc=True).execute()
        rows = result.data or []
        for r in rows:
            r['date_commande'] = r.pop('date', None)
    else:
        admin, err = require_admin()
        if err: return err
        result = supabase.table('orders').select(
            'id,user_id,service,montant,statut,date,users(nom,phone)'
        ).order('date', desc=True).execute()
        rows = []
        for r in (result.data or []):
            user_info = r.pop('users', {}) or {}
            r['date_commande'] = r.pop('date', None)
            r['client_name']  = user_info.get('nom', '')
            r['client_phone'] = user_info.get('phone', '')
            rows.append(r)

    return jsonify({"success": True, "orders": rows})

# ── Users (admin) ─────────────────────────────────────────
@app.route('/api/users', methods=['GET'])
def get_users():
    admin, err = require_admin()
    if err: return err
    supabase = get_db()
    result = supabase.table('users').select(
        'id,nom,email,phone,role,status,created_at'
    ).execute()
    users = []
    for u in (result.data or []):
        u['date_creation'] = u.pop('created_at', None)
        users.append(u)
    return jsonify({"success": True, "users": users})

@app.route('/api/users/<int:uid>/status', methods=['PATCH'])
def user_status(uid):
    admin, err = require_admin()
    if err: return err
    d = request.json or {}
    s = d.get('status')
    if s not in ('active', 'suspended'):
        return jsonify({"success": False, "message": "Statut invalide."}), 400
    supabase = get_db()
    supabase.table('users').update({'status': s}).eq('id', uid).execute()
    return jsonify({"success": True})

@app.route('/api/users/<int:uid>', methods=['DELETE'])
def delete_user(uid):
    admin, err = require_admin()
    if err: return err
    supabase = get_db()
    supabase.table('orders').delete().eq('user_id', uid).execute()
    supabase.table('users').delete().eq('id', uid).execute()
    return jsonify({"success": True})

@app.route('/api/orders/<int:oid>/status', methods=['PATCH'])
def order_status(oid):
    admin, err = require_admin()
    if err: return err
    d = request.json or {}
    s = d.get('status')
    if s not in ('En attente', 'Validé', 'Livré'):
        return jsonify({"success": False, "message": "Statut invalide."}), 400
    supabase = get_db()
    supabase.table('orders').update({'statut': s}).eq('id', oid).execute()
    return jsonify({"success": True})

# ── Contact ───────────────────────────────────────────────
@app.route('/api/contact', methods=['POST'])
def contact():
    d     = request.json or {}
    nom   = (d.get('nom') or '').strip()
    phone = (d.get('phone') or '').strip()
    email = (d.get('email') or '').strip()
    stype = (d.get('subject') or '').strip()
    msg   = (d.get('message') or '').strip()
    if not nom:
        return jsonify({"success": False, "message": "Le nom est requis."}), 400
    if not msg:
        msg = f"Demande de devis — {nom} | {phone} | {email}"

    import threading
    ok = [False]
    def _s():
        ok[0] = send_email(
            f"📋 Demande MS SERVICE — {stype.upper() if stype else 'GÉNÉRAL'}",
            f"NOUVELLE DEMANDE\n---\nNom : {nom}\nWhatsApp : {phone or '—'}\nEmail : {email or '—'}\n---\nType : {stype or '—'}\nMessage :\n{msg}\n---\nEnvoyé depuis MS SERVICE."
        )
    t = threading.Thread(target=_s, daemon=True)
    t.start(); t.join(timeout=8)
    if ok[0]:
        return jsonify({"success": True, "message": "Demande envoyée avec succès."})
    return jsonify({"success": False, "message": "Erreur SMTP. Contactez-nous sur WhatsApp."}), 500

# ── Payment Request ───────────────────────────────────────
@app.route('/api/payment-request', methods=['POST'])
def payment_request():
    try:
        data     = request.get_json()
        nom      = data.get('nom')
        whatsapp = data.get('whatsapp')
        email    = data.get('email')
        service  = data.get('service')
        details  = data.get('details')
        body = f"Nouvelle demande :\n\nNom : {nom}\nWhatsApp : {whatsapp}\nEmail : {email}\nService : {service}\nDétails :\n{details}"
        ok = send_email('Nouvelle demande de paiement — MS SERVICE', body)
        if ok:
            return jsonify({"success": True, "message": "Demande envoyée avec succès."})
        return jsonify({"success": False, "message": "Erreur d'envoi email."}), 500
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# ── Run ───────────────────────────────────────────────────
if __name__ == '__main__':
    print("🚀 MS SERVICE — http://localhost:5000")
    app.run(debug=False, port=5000)
