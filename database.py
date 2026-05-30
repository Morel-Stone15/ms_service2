import hashlib
import os
from dotenv import load_dotenv
load_dotenv()

from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def get_supabase():
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def hash_password(password):
    """SHA-256 — must match app.py."""
    return hashlib.sha256(password.encode()).hexdigest()

def init_admin():
    """Create admin user if it doesn't exist."""
    supabase = get_supabase()

    admin_email    = os.getenv("ADMIN_EMAIL",    "ms_service@gmail.com")
    admin_password = os.getenv("ADMIN_PASSWORD", "MSSERVICE")
    admin_nom      = os.getenv("ADMIN_NOM",      "MSSERVICE")

    # Check if admin already exists
    result = supabase.table('users').select('id').eq('email', admin_email).execute()
    if not result.data:
        pwd_hash = hash_password(admin_password)
        supabase.table('users').insert({
            'nom': admin_nom,
            'email': admin_email,
            'phone': '0000000',
            'password': pwd_hash,
            'role': 'admin',
            'status': 'active'
        }).execute()
        print(f"✓ Admin account created: {admin_email}")
    else:
        print(f"✓ Admin already exists: {admin_email}")

    print("✓ MS SERVICE connected to Supabase!")

if __name__ == "__main__":
    init_admin()
