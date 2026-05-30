/* =========================================================
   MS SERVICE — Auth Module
   Gère sessions, appels API auth, panier et commandes.
   ========================================================= */
const Auth = (function () {
  const SESSION_KEY = 'ms_session';

  function _get() { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); }
  function _save(s) { sessionStorage.setItem(SESSION_KEY, JSON.stringify(s)); }

  /** Headers incluant X-User-Id pour les routes admin */
  function _headers() {
    const s = _get();
    const h = { 'Content-Type': 'application/json' };
    if (s?.userId) h['X-User-Id'] = String(s.userId);
    return h;
  }

  async function register({ nom, email, telephone, password }) {
    if (!nom || !email || !password)
      return { success: false, message: 'Champs obligatoires manquants.' };
    try {
      const r = await fetch('/api/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, email, phone: telephone, password })
      });
      const d = await r.json();
      if (d.success) {
        _save({ userId: d.user.id, user: d.user, role: d.user.role, expires: Date.now() + 7*86400000 });
        return { success: true, role: d.user.role };
      }
      return { success: false, message: d.message };
    } catch { return { success: false, message: 'Erreur réseau.' }; }
  }

  async function login(email, password) {
    if (!email || !password)
      return { success: false, message: 'Email et mot de passe requis.' };
    try {
      const r = await fetch('/api/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const d = await r.json();
      if (d.success) {
        if (d.user.status !== 'active')
          return { success: false, message: "Compte désactivé. Contactez l'administrateur." };
        _save({ userId: d.user.id, user: d.user, role: d.user.role, expires: Date.now() + 7*86400000 });
        return { success: true, role: d.user.role };
      }
      return { success: false, message: d.message };
    } catch { return { success: false, message: 'Erreur réseau.' }; }
  }

  function getSession() {
    const s = _get();
    if (!s) return null;
    if (Date.now() > s.expires) { clear(); return null; }
    return s;
  }

  function getRole()        { return getSession()?.role ?? null; }
  function isAdmin()        { return getRole() === 'admin'; }
  function isLoggedIn()     { return !!getSession(); }
  function getCurrentUser() { return getSession()?.user ?? null; }
  function clear()          { sessionStorage.removeItem(SESSION_KEY); }
  function getToken()       { return null; }
  function setToken()       {}
  function setRole()        {}

  // ── Admin: Users ──────────────────────────────────────
  async function getAllUsers() {
    try {
      const r = await fetch('/api/users', { headers: _headers() });
      const d = await r.json();
      return d.success ? d.users : [];
    } catch { return []; }
  }

  async function toggleUserStatus(userId) {
    const users = await getAllUsers();
    const user  = users.find(u => u.id == userId);
    if (!user) return false;
    try {
      const r = await fetch(`/api/users/${userId}/status`, {
        method: 'PATCH', headers: _headers(),
        body: JSON.stringify({ status: user.status === 'active' ? 'suspended' : 'active' })
      });
      return (await r.json()).success;
    } catch { return false; }
  }

  async function deleteUser(userId) {
    try {
      const r = await fetch(`/api/users/${userId}`, { method: 'DELETE', headers: _headers() });
      return (await r.json()).success;
    } catch { return false; }
  }

  // ── Orders ────────────────────────────────────────────
  async function addOrder(order) {
    try {
      const r = await fetch('/api/orders', {
        method: 'POST', headers: _headers(),
        body: JSON.stringify({ user_id: order.user_id, service: order.service, montant: order.montant, statut: order.statut || 'En attente' })
      });
      const d = await r.json();
      return d.success ? d.order : null;
    } catch { return null; }
  }

  async function getMyOrders() {
    const s = getSession();
    if (!s) return [];
    try {
      const r = await fetch('/api/orders?user_id=' + s.userId, { headers: _headers() });
      const d = await r.json();
      return d.success ? d.orders : [];
    } catch { return []; }
  }

  async function getAllOrders() {
    try {
      const r = await fetch('/api/orders', { headers: _headers() });
      const d = await r.json();
      return d.success ? d.orders : [];
    } catch { return []; }
  }

  async function updateOrderStatus(orderId, status) {
    try {
      const r = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH', headers: _headers(),
        body: JSON.stringify({ status })
      });
      return (await r.json()).success;
    } catch { return false; }
  }

  // ── Guards ────────────────────────────────────────────
  function requireAuth() {
    if (!isLoggedIn()) { window.location.href = 'login.html'; return false; }
    return true;
  }
  function requireAdmin() {
    if (!isLoggedIn()) { window.location.href = 'login.html'; return false; }
    if (!isAdmin())    { window.location.href = 'dashboard.html'; return false; }
    return true;
  }

  return { register, login, getToken, getRole, setToken, setRole, isAdmin, isLoggedIn,
           getCurrentUser, getSession, clear, requireAuth, requireAdmin,
           getAllUsers, toggleUserStatus, deleteUser, addOrder, getMyOrders, getAllOrders, updateOrderStatus };
})();
