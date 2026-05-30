# MS SERVICE — Guide de déploiement

Passerelle de paiement numérique au Gabon. Flask + SQLite + HTML/CSS/JS vanilla.

## Structure des fichiers

```
ms_service/
├── app.py              # Serveur Flask (API + statique)
├── database.py         # Initialisation BDD SQLite
├── requirements.txt    # Dépendances Python
├── .env.example        # Template de configuration (à copier en .env)
├── .gitignore
│
├── index.html          # Page principale (landing)
├── login.html          # Connexion
├── register.html       # Inscription
├── dashboard.html      # Espace client
├── admin.html          # Panel administrateur
├── privacy.html        # Politique de confidentialité
├── terms.html          # Conditions d'utilisation
│
├── style.css           # Styles complets
├── script.js           # JavaScript principal (panier, animations, etc.)
└── auth.js             # Module d'authentification
```

## Installation locale

```bash
# 1. Installer les dépendances
pip install -r requirements.txt

# 2. Créer le fichier de configuration
cp .env.example .env
# Éditer .env avec vos vraies valeurs (Gmail, mot de passe admin)

# 3. Initialiser la base de données
python database.py

# 4. Lancer le serveur
python app.py
# → Ouvrir http://localhost:5000
```

## Déploiement sur un serveur (VPS / Render / Railway)

### Variables d'environnement à définir :
| Variable         | Description                              |
|------------------|------------------------------------------|
| `GMAIL_USER`     | Adresse Gmail pour les notifications     |
| `GMAIL_PASS`     | App Password Google (pas votre vrai mdp) |
| `ADMIN_EMAIL`    | Email du compte admin                    |
| `ADMIN_PASSWORD` | Mot de passe admin (fort !)              |
| `ADMIN_NOM`      | Nom affiché pour l'admin                 |

### Sur Render.com (gratuit) :
1. Connecter le dépôt GitHub
2. Build Command : `pip install -r requirements.txt && python database.py`
3. Start Command : `python app.py`
4. Ajouter les variables d'environnement dans le dashboard

### Sur un VPS (nginx + gunicorn) :
```bash
pip install gunicorn
gunicorn -w 2 -b 0.0.0.0:5000 app:app
```

## Compte admin par défaut
- Email : `admin@msservice.com` (configurable dans `.env`)
- Mot de passe : `ChangeMe2025!` → **à changer impérativement**

## API Routes

| Méthode | Route                        | Description              | Auth requise |
|---------|------------------------------|--------------------------|--------------|
| POST    | `/api/register`              | Inscription              | Non          |
| POST    | `/api/login`                 | Connexion                | Non          |
| GET     | `/api/orders?user_id=X`      | Commandes d'un client    | Non          |
| POST    | `/api/orders`                | Créer une commande       | Non          |
| POST    | `/api/contact`               | Formulaire de contact    | Non          |
| GET     | `/api/users`                 | Liste utilisateurs       | Admin        |
| PATCH   | `/api/users/:id/status`      | Activer/suspendre        | Admin        |
| DELETE  | `/api/users/:id`             | Supprimer utilisateur    | Admin        |
| GET     | `/api/orders`                | Toutes les commandes     | Admin        |
| PATCH   | `/api/orders/:id/status`     | Mettre à jour statut     | Admin        |

> L'authentification admin se fait via le header `X-User-Id` (userId de la session).
