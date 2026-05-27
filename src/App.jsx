import { useState, useEffect, createContext, useContext } from "react";

// ─── API Configuration ────────────────────────────────────────────────────────
const API_BASE = "";

const api = {
  post: async (url, data, token) => {
    const res = await fetch(`${API_BASE}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  get: async (url, token) => {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
  put: async (url, data, token) => {
    const res = await fetch(`${API_BASE}${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

// ─── Auth Context ─────────────────────────────────────────────────────────────
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #050a14;
    --bg2: #0a1220;
    --bg3: #0f1a2e;
    --surface: #111d33;
    --surface2: #162240;
    --border: #1e3050;
    --accent: #00d4ff;
    --accent2: #7c3aed;
    --accent3: #10b981;
    --danger: #ef4444;
    --warning: #f59e0b;
    --text: #e2e8f0;
    --text2: #94a3b8;
    --text3: #475569;
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --radius: 12px;
    --radius-lg: 20px;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
    --glow: 0 0 40px rgba(0,212,255,0.15);
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    min-height: 100vh;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg2); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  /* Animations */
  @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(0,212,255,0.2); } 50% { box-shadow: 0 0 40px rgba(0,212,255,0.4); } }
  @keyframes slideIn { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

  .fade-in { animation: fadeIn 0.4s ease forwards; }
  .slide-in { animation: slideIn 0.3s ease forwards; }

  /* Layout */
  .app-layout { display: flex; min-height: 100vh; }

  /* Sidebar */
  .sidebar {
    width: 260px; min-height: 100vh; background: var(--bg2);
    border-right: 1px solid var(--border); display: flex;
    flex-direction: column; padding: 24px 16px; position: fixed;
    top: 0; left: 0; z-index: 100;
  }
  .sidebar-logo {
    display: flex; align-items: center; gap: 10px;
    padding: 0 8px 28px; border-bottom: 1px solid var(--border); margin-bottom: 24px;
  }
  .logo-icon {
    width: 36px; height: 36px; background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px;
  }
  .logo-text { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--text); }
  .logo-sub { font-size: 10px; color: var(--text3); letter-spacing: 2px; text-transform: uppercase; }

  .nav-section { margin-bottom: 8px; }
  .nav-label { font-size: 10px; color: var(--text3); letter-spacing: 2px; text-transform: uppercase; padding: 0 8px; margin-bottom: 6px; }
  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    border-radius: 10px; cursor: pointer; color: var(--text2); font-size: 13px;
    font-weight: 500; transition: all 0.2s; margin-bottom: 2px; border: 1px solid transparent;
  }
  .nav-item:hover { background: var(--surface); color: var(--text); }
  .nav-item.active { background: var(--surface2); color: var(--accent); border-color: var(--border); }
  .nav-item .nav-icon { font-size: 16px; width: 20px; text-align: center; }

  .sidebar-bottom { margin-top: auto; padding-top: 16px; border-top: 1px solid var(--border); }
  .user-card {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    background: var(--surface); border-radius: 10px; border: 1px solid var(--border);
  }
  .avatar {
    width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #000; flex-shrink: 0;
  }
  .user-name { font-size: 12px; font-weight: 600; color: var(--text); }
  .user-role { font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; }

  /* Main content */
  .main-content { margin-left: 260px; flex: 1; padding: 32px; min-height: 100vh; }

  /* Page header */
  .page-header { margin-bottom: 28px; }
  .page-title { font-family: var(--font-display); font-size: 28px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .page-sub { font-size: 13px; color: var(--text2); }

  /* Cards */
  .card {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg);
    padding: 24px; transition: all 0.2s;
  }
  .card:hover { border-color: var(--accent2); box-shadow: var(--shadow); }
  .card-title { font-family: var(--font-display); font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
  .card-sub { font-size: 12px; color: var(--text2); }

  /* Stat cards */
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 28px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg);
    padding: 20px; position: relative; overflow: hidden;
  }
  .stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
  }
  .stat-value { font-family: var(--font-display); font-size: 32px; font-weight: 800; color: var(--text); }
  .stat-label { font-size: 11px; color: var(--text2); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
  .stat-icon { position: absolute; top: 20px; right: 20px; font-size: 28px; opacity: 0.3; }

  /* Grid layouts */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }

  /* Tables */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; padding: 10px 16px; color: var(--text3); font-size: 10px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid var(--border); font-weight: 600; }
  td { padding: 14px 16px; border-bottom: 1px solid var(--border); color: var(--text2); vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--bg3); color: var(--text); }

  /* Forms */
  .form-group { margin-bottom: 18px; }
  label { display: block; font-size: 12px; color: var(--text2); margin-bottom: 6px; font-weight: 500; letter-spacing: 0.5px; }
  input, select, textarea {
    width: 100%; padding: 11px 14px; background: var(--bg3); border: 1px solid var(--border);
    border-radius: 8px; color: var(--text); font-size: 13px; font-family: var(--font-body);
    outline: none; transition: border-color 0.2s;
  }
  input:focus, select:focus, textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,212,255,0.1); }
  textarea { resize: vertical; min-height: 80px; }
  select option { background: var(--bg3); }

  /* Buttons */
  .btn {
    padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer;
    font-size: 13px; font-weight: 600; font-family: var(--font-body); transition: all 0.2s;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-primary { background: var(--accent); color: #000; }
  .btn-primary:hover { background: #00b8d9; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,212,255,0.3); }
  .btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
  .btn-secondary:hover { background: var(--bg3); border-color: var(--accent); }
  .btn-danger { background: var(--danger); color: #fff; }
  .btn-danger:hover { background: #dc2626; }
  .btn-success { background: var(--accent3); color: #000; }
  .btn-sm { padding: 6px 12px; font-size: 11px; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }

  /* Badges */
  .badge {
    display: inline-block; padding: 3px 10px; border-radius: 20px;
    font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;
  }
  .badge-green { background: rgba(16,185,129,0.15); color: var(--accent3); border: 1px solid rgba(16,185,129,0.3); }
  .badge-blue { background: rgba(0,212,255,0.15); color: var(--accent); border: 1px solid rgba(0,212,255,0.3); }
  .badge-yellow { background: rgba(245,158,11,0.15); color: var(--warning); border: 1px solid rgba(245,158,11,0.3); }
  .badge-red { background: rgba(239,68,68,0.15); color: var(--danger); border: 1px solid rgba(239,68,68,0.3); }
  .badge-purple { background: rgba(124,58,237,0.15); color: #a78bfa; border: 1px solid rgba(124,58,237,0.3); }

  /* Auth page */
  .auth-page {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--bg);
    background-image: radial-gradient(ellipse at 20% 50%, rgba(0,212,255,0.08) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.08) 0%, transparent 60%);
  }
  .auth-box {
    width: 420px; background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 40px; animation: glow 3s ease-in-out infinite;
  }
  .auth-logo { text-align: center; margin-bottom: 32px; }
  .auth-logo-icon {
    width: 64px; height: 64px; background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 18px; display: flex; align-items: center; justify-content: center;
    font-size: 32px; margin: 0 auto 12px;
  }
  .auth-title { font-family: var(--font-display); font-size: 24px; font-weight: 800; color: var(--text); }
  .auth-sub { font-size: 13px; color: var(--text2); margin-top: 4px; }
  .auth-tabs { display: flex; background: var(--bg3); border-radius: 8px; padding: 4px; margin-bottom: 24px; }
  .auth-tab {
    flex: 1; padding: 8px; text-align: center; border-radius: 6px; cursor: pointer;
    font-size: 13px; font-weight: 500; color: var(--text2); transition: all 0.2s;
  }
  .auth-tab.active { background: var(--surface2); color: var(--accent); }
  .auth-footer { text-align: center; margin-top: 20px; font-size: 12px; color: var(--text3); }

  /* Alerts */
  .alert { padding: 12px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }
  .alert-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; }
  .alert-success { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: #6ee7b7; }

  /* Loading */
  .spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
  .loading-center { display: flex; align-items: center; justify-content: center; padding: 60px; }

  /* Modal */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex;
    align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px);
  }
  .modal {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg);
    padding: 28px; width: 500px; max-width: 90vw; max-height: 85vh; overflow-y: auto;
    animation: fadeIn 0.2s ease;
  }
  .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .modal-title { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--text); }
  .modal-close { background: none; border: none; color: var(--text2); cursor: pointer; font-size: 20px; padding: 4px; }

  /* Empty state */
  .empty { text-align: center; padding: 60px 20px; color: var(--text3); }
  .empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.5; }
  .empty-title { font-size: 16px; color: var(--text2); margin-bottom: 8px; }

  /* Topbar */
  .topbar {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 32px; padding-bottom: 20px; border-bottom: 1px solid var(--border);
  }
  .topbar-search {
    display: flex; align-items: center; gap: 10px; background: var(--surface);
    border: 1px solid var(--border); border-radius: 8px; padding: 8px 14px; width: 280px;
  }
  .topbar-search input { background: none; border: none; padding: 0; font-size: 13px; }
  .topbar-actions { display: flex; align-items: center; gap: 12px; }
  .notif-btn {
    position: relative; width: 36px; height: 36px; background: var(--surface);
    border: 1px solid var(--border); border-radius: 8px; display: flex;
    align-items: center; justify-content: center; cursor: pointer; font-size: 16px;
  }
  .notif-dot { position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; background: var(--danger); border-radius: 50%; }

  /* Timeline */
  .timeline { position: relative; padding-left: 24px; }
  .timeline::before { content: ''; position: absolute; left: 7px; top: 0; bottom: 0; width: 2px; background: var(--border); }
  .timeline-item { position: relative; margin-bottom: 20px; }
  .timeline-dot { position: absolute; left: -21px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: var(--accent); border: 2px solid var(--bg2); }
  .timeline-content { background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; padding: 12px; }
  .timeline-title { font-size: 13px; font-weight: 600; color: var(--text); }
  .timeline-sub { font-size: 11px; color: var(--text3); margin-top: 2px; }

  /* Misc */
  .divider { height: 1px; background: var(--border); margin: 20px 0; }
  .flex { display: flex; }
  .flex-between { display: flex; justify-content: space-between; align-items: center; }
  .flex-center { display: flex; align-items: center; }
  .gap-8 { gap: 8px; }
  .gap-12 { gap: 12px; }
  .gap-16 { gap: 16px; }
  .mb-16 { margin-bottom: 16px; }
  .mb-24 { margin-bottom: 24px; }
  .text-accent { color: var(--accent); }
  .text-success { color: var(--accent3); }
  .text-danger { color: var(--danger); }
  .text-sm { font-size: 12px; }
  .font-display { font-family: var(--font-display); }
  .w-full { width: 100%; }
`;

// ─── Badge Helper ─────────────────────────────────────────────────────────────
const statusBadge = (status) => {
  const map = {
    SCHEDULED: "badge-blue", CONFIRMED: "badge-green", CANCELLED: "badge-red",
    COMPLETED: "badge-green", NO_SHOW: "badge-yellow",
    PATIENT: "badge-blue", DOCTOR: "badge-purple", ADMIN: "badge-red",
  };
  return <span className={`badge ${map[status] || "badge-blue"}`}>{status}</span>;
};

// ─── Auth Page ────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "PATIENT" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      const url = tab === "login" ? "/api/auth/login" : "/api/auth/register";
      const data = tab === "login"
        ? { email: form.email, password: form.password }
        : form;
      const res = await api.post(url, data);
      if (res.token) onLogin(res);
      else setError(res.error || res.message || "Something went wrong");
    } catch {
      setError("Cannot connect to server. Make sure all services are running.");
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">
          <div className="auth-logo-icon">🏥</div>
          <div className="auth-title">MediConnect</div>
          <div className="auth-sub">Healthcare Management Platform</div>
        </div>

        <div className="auth-tabs">
          {["login", "register"].map(t => (
            <div key={t} className={`auth-tab ${tab === t ? "active" : ""}`}
              onClick={() => { setTab(t); setError(""); }}>
              {t === "login" ? "Sign In" : "Create Account"}
            </div>
          ))}
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        {tab === "register" && (
          <div className="form-group">
            <label>Full Name</label>
            <input placeholder="Dr. Rajesh Kumar" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
        )}
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" placeholder="you@example.com" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} />
        </div>
        {tab === "register" && (
          <div className="form-group">
            <label>I am a</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        )}

        <button className="btn btn-primary w-full" onClick={handleSubmit} disabled={loading}
          style={{ justifyContent: "center", padding: "13px" }}>
          {loading ? <div className="spinner" /> : tab === "login" ? "Sign In →" : "Create Account →"}
        </button>

        <div className="auth-footer">
          {tab === "login" ? "Don't have an account? " : "Already have an account? "}
          <span className="text-accent" style={{ cursor: "pointer" }}
            onClick={() => { setTab(tab === "login" ? "register" : "login"); setError(""); }}>
            {tab === "login" ? "Register" : "Sign In"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, user, onLogout }) {
  const allNav = [
    { id: "dashboard", icon: "⊞", label: "Dashboard", roles: ["PATIENT", "DOCTOR", "ADMIN"] },
    { id: "patients", icon: "👤", label: "Patients", roles: ["DOCTOR", "ADMIN"] },
    { id: "doctors", icon: "👨‍⚕️", label: "Doctors", roles: ["PATIENT", "ADMIN"] },
    { id: "appointments", icon: "📅", label: "Appointments", roles: ["PATIENT", "DOCTOR", "ADMIN"] },
    { id: "prescriptions", icon: "💊", label: "Prescriptions", roles: ["PATIENT", "DOCTOR", "ADMIN"] },
    { id: "notifications", icon: "🔔", label: "Notifications", roles: ["PATIENT", "DOCTOR", "ADMIN"] },
    { id: "admin", icon: "⚙️", label: "Admin Panel", roles: ["ADMIN"] },
    { id: "profile", icon: "👤", label: "My Profile", roles: ["PATIENT", "DOCTOR", "ADMIN"] },
  ];

  const nav = allNav.filter(n => n.roles.includes(user?.role));

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🏥</div>
        <div>
          <div className="logo-text">MediConnect</div>
          <div className="logo-sub">Healthcare Platform</div>
        </div>
      </div>

      <div className="nav-section">
        <div className="nav-label">Navigation</div>
        {nav.map(item => (
          <div key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`}
            onClick={() => setPage(item.id)}>
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>

      <div className="sidebar-bottom">
        <div className="user-card" style={{ marginBottom: 10 }}>
          <div className="avatar">{user?.name?.[0] || "U"}</div>
          <div>
            <div className="user-name">{user?.name || "User"}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>
        <div className="nav-item" onClick={onLogout} style={{ color: "var(--danger)" }}>
          <span className="nav-icon">🚪</span> Logout
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ user }) {
  const stats = user?.role === "PATIENT"
    ? [
        { value: "3", label: "Appointments", icon: "📅" },
        { value: "2", label: "Prescriptions", icon: "💊" },
        { value: "1", label: "Doctors", icon: "👨‍⚕️" },
        { value: "0", label: "Pending", icon: "⏳" },
      ]
    : user?.role === "DOCTOR"
    ? [
        { value: "12", label: "Today's Patients", icon: "👤" },
        { value: "5", label: "Pending", icon: "⏳" },
        { value: "48", label: "This Month", icon: "📅" },
        { value: "128", label: "Total Patients", icon: "🏥" },
      ]
    : [
        { value: "24", label: "Total Doctors", icon: "👨‍⚕️" },
        { value: "156", label: "Total Patients", icon: "👤" },
        { value: "89", label: "Appointments Today", icon: "📅" },
        { value: "12", label: "Pending Issues", icon: "⚠️" },
      ];

  const recentActivity = [
    { title: "Appointment booked", sub: "Dr. Sharma — Tomorrow 10:00 AM", dot: "var(--accent)" },
    { title: "Prescription issued", sub: "Paracetamol 500mg — 5 days", dot: "var(--accent3)" },
    { title: "Profile updated", sub: "Emergency contact added", dot: "var(--warning)" },
    { title: "Login detected", sub: "New device — Today 9:30 AM", dot: "var(--accent2)" },
  ];

  return (
    <div className="fade-in">
      <div className="topbar">
        <div>
          <div className="page-title">Good morning, {user?.name?.split(" ")[0]} 👋</div>
          <div className="page-sub">Here's what's happening today</div>
        </div>
        <div className="topbar-actions">
          <div className="notif-btn">🔔<div className="notif-dot" /></div>
          <div className="avatar" style={{ width: 36, height: 36 }}>{user?.name?.[0]}</div>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="flex-between mb-16">
            <div className="card-title">Recent Activity</div>
            <span className="badge badge-blue">Live</span>
          </div>
          <div className="timeline">
            {recentActivity.map((a, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot" style={{ background: a.dot }} />
                <div className="timeline-content">
                  <div className="timeline-title">{a.title}</div>
                  <div className="timeline-sub">{a.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title mb-16">Quick Actions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {user?.role === "PATIENT" && <>
              <button className="btn btn-primary">📅 Book Appointment</button>
              <button className="btn btn-secondary">💊 View Prescriptions</button>
              <button className="btn btn-secondary">👨‍⚕️ Find a Doctor</button>
            </>}
            {user?.role === "DOCTOR" && <>
              <button className="btn btn-primary">📋 View Today's Schedule</button>
              <button className="btn btn-secondary">💊 Write Prescription</button>
              <button className="btn btn-secondary">👤 View Patient Records</button>
            </>}
            {user?.role === "ADMIN" && <>
              <button className="btn btn-primary">➕ Add Doctor</button>
              <button className="btn btn-secondary">📊 View Reports</button>
              <button className="btn btn-secondary">🔔 Send Notification</button>
            </>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Appointments Page ────────────────────────────────────────────────────────
function AppointmentsPage({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ patientId: "", doctorId: "", appointmentDate: "", appointmentTime: "", reasonForVisit: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setAppointments([
        { id: "1", patientName: "Rahul Sharma", doctorName: "Dr. Priya Singh", specialization: "Cardiologist", appointmentDate: "2024-02-15", appointmentTime: "10:30", status: "CONFIRMED", consultationFee: 500 },
        { id: "2", patientName: "Anjali Gupta", doctorName: "Dr. Arjun Mehta", specialization: "General Physician", appointmentDate: "2024-02-16", appointmentTime: "14:00", status: "SCHEDULED", consultationFee: 300 },
        { id: "3", patientName: "Vikram Patel", doctorName: "Dr. Neha Joshi", specialization: "Dermatologist", appointmentDate: "2024-02-10", appointmentTime: "11:00", status: "COMPLETED", consultationFee: 600 },
        { id: "4", patientName: "Meera Iyer", doctorName: "Dr. Suresh Kumar", specialization: "Orthopedic", appointmentDate: "2024-02-08", appointmentTime: "09:00", status: "CANCELLED", consultationFee: 700 },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const book = async () => {
    setMsg("");
    try {
      const res = await api.post("/api/appointments", form, user.token);
      if (res.id) { setMsg("✅ Appointment booked!"); setShowModal(false); }
      else setMsg("❌ " + (res.error || "Failed to book"));
    } catch { setMsg("❌ Connection error"); }
  };

  return (
    <div className="fade-in">
      <div className="flex-between mb-24">
        <div>
          <div className="page-title">Appointments</div>
          <div className="page-sub">Manage all appointments</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Book Appointment</button>
      </div>

      {msg && <div className={`alert ${msg.includes("✅") ? "alert-success" : "alert-error"}`}>{msg}</div>}

      <div className="card">
        {loading ? <div className="loading-center"><div className="spinner" /></div> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Patient</th><th>Doctor</th><th>Specialization</th>
                  <th>Date & Time</th><th>Fee</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a.id}>
                    <td><strong style={{ color: "var(--text)" }}>{a.patientName}</strong></td>
                    <td>{a.doctorName}</td>
                    <td><span className="badge badge-purple">{a.specialization}</span></td>
                    <td>{a.appointmentDate} <span className="text-accent">@ {a.appointmentTime}</span></td>
                    <td className="text-success">₹{a.consultationFee}</td>
                    <td>{statusBadge(a.status)}</td>
                    <td>
                      <div className="flex gap-8">
                        <button className="btn btn-secondary btn-sm">View</button>
                        {a.status === "SCHEDULED" && <button className="btn btn-danger btn-sm">Cancel</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Book Appointment</div>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            {[
              { label: "Patient ID", key: "patientId", ph: "Enter patient ID" },
              { label: "Doctor ID", key: "doctorId", ph: "Enter doctor ID" },
              { label: "Date", key: "appointmentDate", type: "date" },
              { label: "Time", key: "appointmentTime", type: "time" },
            ].map(f => (
              <div className="form-group" key={f.key}>
                <label>{f.label}</label>
                <input type={f.type || "text"} placeholder={f.ph} value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
              </div>
            ))}
            <div className="form-group">
              <label>Reason for Visit</label>
              <textarea placeholder="Describe your symptoms..." value={form.reasonForVisit}
                onChange={e => setForm({ ...form, reasonForVisit: e.target.value })} />
            </div>
            <div className="flex gap-12">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={book}>Confirm Booking</button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Doctors Page ─────────────────────────────────────────────────────────────
function DoctorsPage({ user }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setDoctors([
        { id: "1", name: "Dr. Priya Singh", specialization: "Cardiologist", qualification: "MBBS, MD", experienceYears: 12, consultationFee: 500, available: true },
        { id: "2", name: "Dr. Arjun Mehta", specialization: "General Physician", qualification: "MBBS", experienceYears: 8, consultationFee: 300, available: true },
        { id: "3", name: "Dr. Neha Joshi", specialization: "Dermatologist", qualification: "MBBS, DVD", experienceYears: 6, consultationFee: 600, available: false },
        { id: "4", name: "Dr. Suresh Kumar", specialization: "Orthopedic", qualification: "MBBS, MS", experienceYears: 15, consultationFee: 700, available: true },
        { id: "5", name: "Dr. Kavita Sharma", specialization: "Gynecologist", qualification: "MBBS, DGO", experienceYears: 10, consultationFee: 550, available: true },
        { id: "6", name: "Dr. Ravi Patel", specialization: "Neurologist", qualification: "MBBS, DM", experienceYears: 14, consultationFee: 800, available: false },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div className="flex-between mb-24">
        <div>
          <div className="page-title">Doctors</div>
          <div className="page-sub">{doctors.length} doctors available</div>
        </div>
        <input placeholder="🔍 Search by name or specialization..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: 280 }} />
      </div>

      {loading ? <div className="loading-center"><div className="spinner" /></div> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {filtered.map(d => (
            <div key={d.id} className="card" style={{ cursor: "pointer" }}>
              <div className="flex-between mb-16">
                <div className="flex flex-center gap-12">
                  <div className="avatar" style={{ width: 44, height: 44, fontSize: 18 }}>
                    {d.name.split(" ")[1]?.[0] || "D"}
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text)" }}>{d.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text2)" }}>{d.qualification}</div>
                  </div>
                </div>
                <span className={`badge ${d.available ? "badge-green" : "badge-red"}`}>
                  {d.available ? "Available" : "Busy"}
                </span>
              </div>
              <div className="divider" style={{ margin: "12px 0" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                {[
                  { label: "Specialization", val: d.specialization },
                  { label: "Experience", val: `${d.experienceYears} years` },
                  { label: "Consultation Fee", val: `₹${d.consultationFee}` },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{item.val}</div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary w-full" style={{ justifyContent: "center" }}
                disabled={!d.available}>
                {d.available ? "📅 Book Appointment" : "Not Available"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Patients Page ────────────────────────────────────────────────────────────
function PatientsPage({ user }) {
  const [patients] = useState([
    { id: "1", name: "Rahul Sharma", email: "rahul@example.com", phone: "9876543210", bloodGroup: "O+", gender: "Male", chronicDiseases: ["Diabetes"] },
    { id: "2", name: "Anjali Gupta", email: "anjali@example.com", phone: "9876543211", bloodGroup: "A+", gender: "Female", chronicDiseases: [] },
    { id: "3", name: "Vikram Patel", email: "vikram@example.com", phone: "9876543212", bloodGroup: "B+", gender: "Male", chronicDiseases: ["Hypertension"] },
    { id: "4", name: "Meera Iyer", email: "meera@example.com", phone: "9876543213", bloodGroup: "AB+", gender: "Female", chronicDiseases: [] },
  ]);

  return (
    <div className="fade-in">
      <div className="flex-between mb-24">
        <div>
          <div className="page-title">Patients</div>
          <div className="page-sub">{patients.length} registered patients</div>
        </div>
        <button className="btn btn-primary">+ Add Patient</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Patient</th><th>Contact</th><th>Blood Group</th><th>Gender</th><th>Conditions</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {patients.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="flex flex-center gap-8">
                      <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{p.name[0]}</div>
                      <div>
                        <div style={{ color: "var(--text)", fontWeight: 500 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text3)" }}>{p.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{p.phone}</td>
                  <td><span className="badge badge-red">{p.bloodGroup}</span></td>
                  <td>{p.gender}</td>
                  <td>
                    {p.chronicDiseases.length > 0
                      ? p.chronicDiseases.map(c => <span key={c} className="badge badge-yellow" style={{ marginRight: 4 }}>{c}</span>)
                      : <span style={{ color: "var(--text3)", fontSize: 12 }}>None</span>}
                  </td>
                  <td>
                    <div className="flex gap-8">
                      <button className="btn btn-secondary btn-sm">View</button>
                      <button className="btn btn-secondary btn-sm">History</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Prescriptions Page ───────────────────────────────────────────────────────
function PrescriptionsPage({ user }) {
  const [prescriptions] = useState([
    {
      id: "1", patientName: "Rahul Sharma", doctorName: "Dr. Priya Singh",
      prescriptionDate: "2024-02-10", diagnosis: "Viral Fever",
      medicines: [
        { name: "Paracetamol 500mg", dosage: "1 tablet", frequency: "Twice daily", duration: "5 days" },
        { name: "Cetirizine 10mg", dosage: "1 tablet", frequency: "Once daily", duration: "3 days" },
      ],
      advice: "Rest for 3 days, drink plenty of fluids", followUpDate: "2024-02-17"
    },
    {
      id: "2", patientName: "Anjali Gupta", doctorName: "Dr. Arjun Mehta",
      prescriptionDate: "2024-02-08", diagnosis: "Hypertension",
      medicines: [
        { name: "Amlodipine 5mg", dosage: "1 tablet", frequency: "Once daily", duration: "30 days" },
      ],
      advice: "Reduce salt intake, regular exercise", followUpDate: "2024-03-08"
    },
  ]);

  const [selected, setSelected] = useState(null);

  return (
    <div className="fade-in">
      <div className="flex-between mb-24">
        <div>
          <div className="page-title">Prescriptions</div>
          <div className="page-sub">Digital prescription records</div>
        </div>
        {(user?.role === "DOCTOR") && <button className="btn btn-primary">+ New Prescription</button>}
      </div>

      <div className="grid-2">
        <div className="card" style={{ padding: 0 }}>
          {prescriptions.map((p, i) => (
            <div key={p.id} onClick={() => setSelected(p)}
              style={{
                padding: "16px 20px", cursor: "pointer", borderBottom: i < prescriptions.length - 1 ? "1px solid var(--border)" : "none",
                background: selected?.id === p.id ? "var(--bg3)" : "transparent",
                borderLeft: selected?.id === p.id ? "3px solid var(--accent)" : "3px solid transparent",
              }}>
              <div className="flex-between">
                <div style={{ fontWeight: 600, color: "var(--text)" }}>{p.patientName}</div>
                <span className="badge badge-blue">{p.prescriptionDate}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4 }}>{p.diagnosis} · {p.doctorName}</div>
            </div>
          ))}
        </div>

        {selected ? (
          <div className="card">
            <div className="flex-between mb-16">
              <div className="card-title">Prescription Details</div>
              <button className="btn btn-secondary btn-sm">🖨️ Print</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[
                ["Patient", selected.patientName],
                ["Doctor", selected.doctorName],
                ["Date", selected.prescriptionDate],
                ["Diagnosis", selected.diagnosis],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>{k}</div>
                  <div style={{ fontSize: 13, color: "var(--text)", marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>
            <div className="divider" />
            <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 12, fontSize: 13 }}>💊 Medicines</div>
            {selected.medicines.map((m, i) => (
              <div key={i} style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px", marginBottom: 8 }}>
                <div style={{ fontWeight: 600, color: "var(--accent)", fontSize: 13 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4 }}>
                  {m.dosage} · {m.frequency} · {m.duration}
                </div>
              </div>
            ))}
            <div className="divider" />
            <div style={{ fontSize: 12, color: "var(--text2)" }}>
              <strong style={{ color: "var(--text)" }}>Advice:</strong> {selected.advice}
            </div>
            {selected.followUpDate && (
              <div style={{ marginTop: 8, fontSize: 12, color: "var(--warning)" }}>
                📅 Follow-up: {selected.followUpDate}
              </div>
            )}
          </div>
        ) : (
          <div className="card">
            <div className="empty">
              <div className="empty-icon">💊</div>
              <div className="empty-title">Select a prescription to view details</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Notifications Page ───────────────────────────────────────────────────────
function NotificationsPage({ user }) {
  const [notifications] = useState([
    { id: "1", subject: "Appointment Confirmed ✅", message: "Your appointment with Dr. Priya Singh is confirmed for Feb 15 at 10:30 AM", type: "APPOINTMENT_BOOKED", status: "SENT", createdAt: "2024-02-14T09:00:00" },
    { id: "2", subject: "⏰ Appointment Reminder", message: "Reminder: You have an appointment tomorrow with Dr. Arjun Mehta", type: "APPOINTMENT_REMINDER", status: "SENT", createdAt: "2024-02-15T08:00:00" },
    { id: "3", subject: "Welcome to MediConnect 🏥", message: "Welcome! Your account has been created successfully.", type: "WELCOME", status: "SENT", createdAt: "2024-02-01T10:00:00" },
  ]);

  const typeColors = {
    APPOINTMENT_BOOKED: "badge-green", APPOINTMENT_REMINDER: "badge-yellow",
    WELCOME: "badge-blue", PRESCRIPTION_READY: "badge-purple",
  };

  return (
    <div className="fade-in">
      <div className="flex-between mb-24">
        <div>
          <div className="page-title">Notifications</div>
          <div className="page-sub">{notifications.length} notifications</div>
        </div>
        {user?.role === "ADMIN" && <button className="btn btn-primary">📧 Send Notification</button>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {notifications.map(n => (
          <div key={n.id} className="card" style={{ cursor: "pointer" }}>
            <div className="flex-between mb-16">
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text)" }}>{n.subject}</div>
              <div className="flex gap-8">
                <span className={`badge ${typeColors[n.type] || "badge-blue"}`}>{n.type.replace(/_/g, " ")}</span>
                <span className="badge badge-green">{n.status}</span>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 8 }}>{n.message}</div>
            <div style={{ fontSize: 11, color: "var(--text3)" }}>📅 {new Date(n.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Admin Panel ──────────────────────────────────────────────────────────────
function AdminPanel() {
  const stats = [
    { label: "Total Users", value: "182", icon: "👥", color: "var(--accent)" },
    { label: "Total Doctors", value: "24", icon: "👨‍⚕️", color: "var(--accent2)" },
    { label: "Appointments Today", value: "89", icon: "📅", color: "var(--accent3)" },
    { label: "Revenue Today", value: "₹45,200", icon: "💰", color: "var(--warning)" },
  ];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Admin Panel</div>
        <div className="page-sub">System overview and management</div>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title mb-16">System Health</div>
          {[
            { service: "API Gateway", port: "8080", status: "UP" },
            { service: "Auth Service", port: "8081", status: "UP" },
            { service: "Patient Service", port: "8082", status: "UP" },
            { service: "Doctor Service", port: "8083", status: "UP" },
            { service: "Appointment Service", port: "8084", status: "UP" },
            { service: "Prescription Service", port: "8085", status: "UP" },
            { service: "Notification Service", port: "8086", status: "UP" },
          ].map(s => (
            <div key={s.service} className="flex-between" style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <div>
                <span style={{ fontSize: 13, color: "var(--text)" }}>{s.service}</span>
                <span style={{ fontSize: 11, color: "var(--text3)", marginLeft: 8 }}>:{s.port}</span>
              </div>
              <span className="badge badge-green">{s.status}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-title mb-16">Quick Admin Actions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="btn btn-primary">➕ Register New Doctor</button>
            <button className="btn btn-secondary">📊 Export Reports</button>
            <button className="btn btn-secondary">📧 Broadcast Notification</button>
            <button className="btn btn-secondary">🔄 Refresh Services</button>
            <button className="btn btn-secondary">📋 View Audit Logs</button>
            <button className="btn btn-danger">🚨 Emergency Broadcast</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
function ProfilePage({ user }) {
  const [form, setForm] = useState({
    name: user?.name || "", email: user?.email || "",
    phone: "", bloodGroup: "", dateOfBirth: "",
  });

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">My Profile</div>
        <div className="page-sub">Manage your personal information</div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div className="avatar" style={{ width: 72, height: 72, fontSize: 28, margin: "0 auto 12px" }}>
              {user?.name?.[0]}
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700 }}>{user?.name}</div>
            <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 4 }}>{user?.email}</div>
            <div style={{ marginTop: 8 }}>{statusBadge(user?.role)}</div>
          </div>
          <div className="divider" />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "User ID", val: user?.userId },
              { label: "Role", val: user?.role },
              { label: "Member Since", val: "February 2024" },
            ].map(item => (
              <div key={item.label} className="flex-between">
                <span style={{ fontSize: 12, color: "var(--text3)" }}>{item.label}</span>
                <span style={{ fontSize: 13, color: "var(--text)" }}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title mb-16">Update Profile</div>
          {[
            { label: "Full Name", key: "name" },
            { label: "Email", key: "email", type: "email" },
            { label: "Phone", key: "phone", ph: "9876543210" },
            { label: "Date of Birth", key: "dateOfBirth", type: "date" },
          ].map(f => (
            <div className="form-group" key={f.key}>
              <label>{f.label}</label>
              <input type={f.type || "text"} placeholder={f.ph} value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
            </div>
          ))}
          <div className="form-group">
            <label>Blood Group</label>
            <select value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })}>
              <option value="">Select blood group</option>
              {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <button className="btn btn-primary w-full" style={{ justifyContent: "center" }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mediconnect_user")); } catch { return null; }
  });
  const [page, setPage] = useState("dashboard");

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("mediconnect_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("mediconnect_user");
  };

  const pages = {
    dashboard: <Dashboard user={user} />,
    appointments: <AppointmentsPage user={user} />,
    doctors: <DoctorsPage user={user} />,
    patients: <PatientsPage user={user} />,
    prescriptions: <PrescriptionsPage user={user} />,
    notifications: <NotificationsPage user={user} />,
    admin: <AdminPanel />,
    profile: <ProfilePage user={user} />,
  };

  if (!user) return (
    <>
      <style>{styles}</style>
      <AuthPage onLogin={handleLogin} />
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="app-layout">
        <Sidebar page={page} setPage={setPage} user={user} onLogout={handleLogout} />
        <div className="main-content">
          {pages[page] || <Dashboard user={user} />}
        </div>
      </div>
    </>
  );
}
