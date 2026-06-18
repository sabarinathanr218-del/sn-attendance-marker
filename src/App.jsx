import { useState, useEffect } from "react";

// ── PWA INSTALL PROMPT ─────────────────────────────────────────────────────────
function useInstallPrompt() {
  const [prompt, setPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) {
      setInstalled(true); return;
    }
    const handler = (e) => { e.preventDefault(); setPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => { setInstalled(true); setPrompt(null); });
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function triggerInstall() {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setPrompt(null);
  }

  return { prompt, installed, triggerInstall };
}

// ── PWA INSTALL BANNER ─────────────────────────────────────────────────────────
function InstallBanner({ onDismiss }) {
  const [show, setShow] = useState(true);
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isAndroid = /android/i.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (!show) return null;

  function dismiss() { setShow(false); onDismiss && onDismiss(); }

  if (isIOS && isSafari) {
    return (
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "#fff", borderTop: "1px solid #E5E7EB", padding: "14px 16px 28px", zIndex: 200, boxShadow: "0 -4px 24px rgba(0,0,0,0.13)" }}>
        <button onClick={dismiss} style={{ position: "absolute", top: 10, right: 14, background: "none", border: "none", fontSize: 18, color: "#9CA3AF", cursor: "pointer" }}>✕</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#4F46E5,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 18, flexShrink: 0 }}>SN</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>Install SN Attendance</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>Add to your Home Screen</div>
          </div>
        </div>
        <div style={{ background: "#F0F4FF", border: "1.5px solid #C7D2FE", borderRadius: 12, padding: 12 }}>
          <div style={{ fontSize: 13, color: "#4F46E5", fontWeight: 600, marginBottom: 8 }}>📲 How to install on iPhone:</div>
          <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>
            1. Tap the <span style={{ fontWeight: 700 }}>Share</span> button <span style={{ fontSize: 16 }}>⬆️</span> at the bottom<br/>
            2. Scroll and tap <span style={{ fontWeight: 700 }}>"Add to Home Screen"</span><br/>
            3. Tap <span style={{ fontWeight: 700 }}>"Add"</span> — Done! 🎉
          </div>
        </div>
      </div>
    );
  }

  if (isAndroid || (!isIOS)) {
    return (
      <div style={{ position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)", width: "calc(100% - 32px)", maxWidth: 398, background: "#fff", borderRadius: 18, padding: "14px 16px", zIndex: 200, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", border: "1px solid #E5E7EB" }}>
        <button onClick={dismiss} style={{ position: "absolute", top: 10, right: 14, background: "none", border: "none", fontSize: 18, color: "#9CA3AF", cursor: "pointer" }}>✕</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#4F46E5,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 16, flexShrink: 0 }}>SN</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14 }}>Install SN Attendance Marker</div>
            <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>Works offline · Fast · No app store needed</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#6B7280", marginTop: 10, marginBottom: 4 }}>
          📲 Tap <b>Install</b> then tap <b>Add to Home Screen</b> in the popup
        </div>
      </div>
    );
  }
  return null;
}

// ── BRIGHT VIBRANT PALETTE ─────────────────────────────────────────────────────
const C = {
  bg: "#F0F4FF",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  accent: "#4F46E5",
  accent2: "#7C3AED",
  accentGrad: "linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%)",
  accentGradH: "linear-gradient(135deg,#6366F1 0%,#9333EA 100%)",
  present: "#059669",
  presentBg: "#ECFDF5",
  absent: "#DC2626",
  absentBg: "#FEF2F2",
  od: "#D97706",
  odBg: "#FFFBEB",
  edit: "#7C3AED",
  editBg: "#F5F3FF",
  text: "#1E1B4B",
  sub: "#6B7280",
  muted: "#9CA3AF",
  border: "#E5E7EB",
  shadow: "0 2px 16px rgba(79,70,229,0.10)",
  shadowCard: "0 1px 6px rgba(0,0,0,0.07)",
};

const load = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const uid = () => Math.random().toString(36).slice(2, 9);
const today = () => new Date().toISOString().slice(0, 10);

const FOUNDER_USER = "SN_founder";
const FOUNDER_PASS = "SN@admin1";
function initUsers() {
  // Migrate: remove any legacy email-based users that have no username
  let users = load("alm_users", []).filter(u => u.username);
  if (!users.find(u => u.username === FOUNDER_USER)) {
    users.push({ username: FOUNDER_USER, password: FOUNDER_PASS, role: "founder", classId: null });
  }
  save("alm_users", users);
}
initUsers();

function validateUsername(u) {
  if (u.length < 4) return "Username must be at least 4 characters.";
  if (!/^[a-zA-Z0-9_]+$/.test(u)) return "Only letters, numbers and _ are allowed.";
  return null;
}

// Password must be >6 chars, has letters AND numbers
function validatePassword(p) {
  if (p.length < 7) return "Password must be at least 7 characters.";
  if (!/[a-zA-Z]/.test(p)) return "Password must include at least one letter.";
  if (!/[0-9]/.test(p)) return "Password must include at least one number.";
  return null;
}

// ── SHARED STYLES ──────────────────────────────────────────────────────────────
const T = {
  wrap: {
    minHeight: "100vh", background: C.bg,
    color: C.text, fontFamily: "'Inter','Segoe UI',sans-serif",
    maxWidth: 430, margin: "0 auto", paddingBottom: 90,
  },
  hdr: {
    background: C.surface, padding: "13px 16px",
    display: "flex", alignItems: "center", gap: 10,
    borderBottom: `1px solid ${C.border}`,
    position: "sticky", top: 0, zIndex: 10,
    boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
  },
  htitle: { fontSize: 16, fontWeight: 800, flex: 1, color: C.text, letterSpacing: -0.3 },
  card: {
    background: C.card, borderRadius: 16, padding: 16,
    marginBottom: 12, border: `1px solid ${C.border}`,
    boxShadow: C.shadowCard,
  },
  inp: {
    width: "100%", background: "#F9FAFB",
    border: `1.5px solid ${C.border}`, borderRadius: 12,
    padding: "12px 14px", color: C.text, fontSize: 14,
    outline: "none", boxSizing: "border-box",
    fontFamily: "inherit", transition: "border 0.2s",
  },
  btn: (grad = C.accentGrad, mt = 10) => ({
    background: grad, color: "#fff", border: "none",
    borderRadius: 12, padding: "13px 20px",
    fontSize: 15, fontWeight: 700, cursor: "pointer",
    width: "100%", marginTop: mt,
    boxShadow: "0 4px 14px rgba(79,70,229,0.25)",
    letterSpacing: 0.2,
  }),
  outbtn: (color, mt = 0) => ({
    background: color + "12", color,
    border: `1.5px solid ${color}33`,
    borderRadius: 10, padding: "7px 12px",
    fontSize: 12, fontWeight: 700, cursor: "pointer", marginTop: mt,
  }),
  badge: (color, bg) => ({
    background: bg || color + "18", color,
    border: `1px solid ${color}30`,
    borderRadius: 8, padding: "3px 9px",
    fontSize: 11, fontWeight: 700,
  }),
  lbl: { fontSize: 12, color: C.sub, marginBottom: 5, fontWeight: 600, letterSpacing: 0.3, textTransform: "uppercase" },
  pill: (active, color = C.accent) => ({
    background: active ? color : "#F3F4F6",
    color: active ? "#fff" : C.sub,
    border: `1.5px solid ${active ? color : C.border}`,
    borderRadius: 20, padding: "7px 14px",
    fontSize: 12, fontWeight: 700, cursor: "pointer",
    transition: "all 0.15s",
  }),
  iconBtn: (color) => ({ background: "none", border: "none", color, cursor: "pointer", fontSize: 18, padding: "4px 5px" }),
  sec: { padding: "0 14px", marginTop: 14 },
  row: { display: "flex", alignItems: "center", gap: 8 },
};

// ── SN LOGO COMPONENTS ─────────────────────────────────────────────────────────
function SNLogo({ size = 72 }) {
  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <div style={{
        width: size, height: size, borderRadius: size * 0.27,
        background: C.accentGrad,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 8px 30px rgba(79,70,229,0.4)",
      }}>
        <span style={{ fontSize: size * 0.4, fontWeight: 900, color: "#fff", letterSpacing: -1 }}>SN</span>
      </div>
      <div style={{
        position: "absolute", bottom: -4, right: -4,
        width: size * 0.3, height: size * 0.3, borderRadius: size * 0.1,
        background: C.present, border: "2px solid #fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.15, boxShadow: "0 2px 8px rgba(5,150,105,0.5)",
      }}>✓</div>
    </div>
  );
}

function SNMini() {
  return (
    <div style={{
      width: 30, height: 30, borderRadius: 9,
      background: C.accentGrad,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 11, fontWeight: 900, color: "#fff", flexShrink: 0,
      boxShadow: "0 2px 8px rgba(79,70,229,0.3)",
    }}>SN</div>
  );
}

// ── LOGIN SCREEN ───────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [tab, setTab] = useState("login");

  // Load saved credentials on first render
  const savedCreds = (() => { try { return JSON.parse(localStorage.getItem("sn_remember") || "{}"); } catch { return {}; } })();
  const [uname, setUname] = useState(savedCreds.username || "");
  const [pass, setPass] = useState(savedCreds.password || "");
  const [err, setErr] = useState("");
  const [showP, setShowP] = useState(false);
  const [rememberMe, setRememberMe] = useState(savedCreds.username ? (savedCreds.permission === "full" ? "full" : "user") : null);
  // null = not asked yet, "full" = save both, "user" = save username only, "none" = don't save
  const [showPermModal, setShowPermModal] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  const [rU, setRU] = useState(""); const [rP, setRP] = useState(""); const [rC, setRC] = useState("");
  const [rErr, setRErr] = useState(""); const [rOk, setROk] = useState(""); const [showRP, setShowRP] = useState(false);
  // Forgot password states
  const [fUser, setFUser] = useState(""); const [fSecret, setFSecret] = useState("");
  const [fNewP, setFNewP] = useState(""); const [fConfP, setFConfP] = useState("");
  const [fStep, setFStep] = useState(1);
  const [fErr, setFErr] = useState(""); const [fOk, setFOk] = useState(""); const [showFP, setShowFP] = useState(false);

  const pwStrength = (p) => {
    if (!p) return null;
    const hasL = /[a-zA-Z]/.test(p), hasN = /[0-9]/.test(p);
    if (p.length < 4) return { label: "Too short", color: C.absent, w: "25%" };
    if (p.length < 7 || !hasL || !hasN) return { label: "Weak", color: C.od, w: "50%" };
    if (p.length >= 7 && hasL && hasN && p.length < 10) return { label: "Good", color: "#0891B2", w: "75%" };
    return { label: "Strong 💪", color: C.present, w: "100%" };
  };
  const strength = pwStrength(rP);

  function doLogin() {
    setErr("");
    if (!uname.trim() || !pass) { setErr("Please fill in all fields."); return; }
    const u = load("alm_users", []).find(x => x.username && x.username.toLowerCase() === uname.trim().toLowerCase() && x.password === pass);
    if (!u) { setErr("Incorrect username or password. Try again."); return; }
    // If never asked permission before, ask now
    const saved = (() => { try { return JSON.parse(localStorage.getItem("sn_remember") || "{}"); } catch { return {}; } })();
    if (!saved.permission) {
      setPendingUser(u);
      setShowPermModal(true);
    } else {
      // Update stored username/password based on existing permission
      if (saved.permission === "full") {
        localStorage.setItem("sn_remember", JSON.stringify({ username: uname.trim(), password: pass, permission: "full" }));
      } else if (saved.permission === "user") {
        localStorage.setItem("sn_remember", JSON.stringify({ username: uname.trim(), permission: "user" }));
      }
      onLogin(u);
    }
  }

  function handlePermission(choice) {
    // choice: "full" | "user" | "none"
    setShowPermModal(false);
    if (choice === "full") {
      localStorage.setItem("sn_remember", JSON.stringify({ username: uname.trim(), password: pass, permission: "full" }));
    } else if (choice === "user") {
      localStorage.setItem("sn_remember", JSON.stringify({ username: uname.trim(), permission: "user" }));
    } else {
      localStorage.setItem("sn_remember", JSON.stringify({ permission: "none" }));
    }
    if (pendingUser) onLogin(pendingUser);
  }

  function doRegister() {
    setRErr(""); setROk("");
    const unErr = validateUsername(rU.trim());
    if (unErr) { setRErr(unErr); return; }
    const pwErr = validatePassword(rP);
    if (pwErr) { setRErr(pwErr); return; }
    if (!rC.trim()) { setRErr("Please enter your class name (e.g. SC-A)."); return; }
    const users = load("alm_users", []);
    if (users.find(u => u.username && u.username.toLowerCase() === rU.trim().toLowerCase())) { setRErr("This username is already taken. Choose another."); return; }
    const classes = load("alm_classes", []);
    const norm = rC.trim().toUpperCase();
    let cls = classes.find(c => c.name.toUpperCase() === norm);
    if (!cls) { cls = { id: uid(), name: norm }; classes.push(cls); save("alm_classes", classes); }
    users.push({ username: rU.trim(), password: rP, role: "admin", classId: cls.id });
    save("alm_users", users);
    setROk("🎉 Account created! You can now sign in."); setTab("login"); setUname(rU.trim());
  }

  function doFindUser() {
    setFErr("");
    if (!fUser.trim()) { setFErr("Enter your username."); return; }
    const users = load("alm_users", []);
    const u = users.find(x => x.username && x.username.toLowerCase() === fUser.trim().toLowerCase());
    if (!u) { setFErr("No account found with that username."); return; }
    // Security question: ask class name they registered with
    setFStep(2); setFErr("");
  }

  function doResetPassword() {
    setFErr("");
    const pwErr = validatePassword(fNewP);
    if (pwErr) { setFErr(pwErr); return; }
    if (fNewP !== fConfP) { setFErr("Passwords do not match."); return; }
    // Verify class name as security check
    const classes = load("alm_classes", []);
    const users = load("alm_users", []);
    const u = users.find(x => x.username && x.username.toLowerCase() === fUser.trim().toLowerCase());
    const cls = classes.find(c => c.id === u.classId);
    if (!cls || cls.name.toUpperCase() !== fSecret.trim().toUpperCase()) {
      setFErr("Class name doesn't match your account. Try again."); return;
    }
    const updated = users.map(x => x.username && x.username.toLowerCase() === fUser.trim().toLowerCase() ? { ...x, password: fNewP } : x);
    save("alm_users", updated);
    setFOk("✅ Password reset! You can now sign in."); setTab("login"); setUname(fUser.trim());
    setFStep(1); setFUser(""); setFSecret(""); setFNewP(""); setFConfP("");
  }

  return (
    <div style={{ ...T.wrap, display: "flex", flexDirection: "column", justifyContent: "center", padding: "28px 22px", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <SNLogo size={80} />
        <div style={{ marginTop: 18, fontSize: 26, fontWeight: 900, color: C.text, letterSpacing: -0.8 }}>
          Attendance <span style={{ background: C.accentGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Marker</span>
        </div>
        <div style={{ color: C.sub, fontSize: 14, marginTop: 5, fontWeight: 500 }}>Smart Attendance for Class Reps</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8, background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: 20, padding: "3px 12px" }}>
          <span style={{ fontSize: 10, color: C.accent, fontWeight: 800, letterSpacing: 1.5 }}>POWERED BY SN</span>
        </div>

      </div>

      {/* Tab switcher */}
      <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 14, padding: 4, marginBottom: 20 }}>
        {[["login", "🔑 Sign In"], ["register", "✨ Sign Up"], ["forgot", "🔓 Reset"]].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, background: tab === t ? "#fff" : "none",
            color: tab === t ? C.accent : C.muted,
            border: "none", borderRadius: 11, padding: "9px 0",
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            boxShadow: tab === t ? "0 1px 6px rgba(0,0,0,0.1)" : "none",
            transition: "all 0.2s",
          }}>{l}</button>
        ))}
      </div>

      {tab === "login" && (
        <div style={T.card}>
          <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 16, color: C.text }}>Welcome back! 👋</div>
          <div style={T.lbl}>SN Username</div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: C.accent, fontWeight: 800, fontSize: 15 }}>@</span>
            <input style={{ ...T.inp, paddingLeft: 30 }} type="text" placeholder="Your username" value={uname} onChange={e => setUname(e.target.value)} autoCapitalize="none" />
          </div>
          <div style={{ ...T.lbl, marginTop: 14 }}>Password</div>
          <div style={{ position: "relative" }}>
            <input style={{ ...T.inp, paddingRight: 44 }} type={showP ? "text" : "password"} placeholder="Enter your password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && doLogin()} />
            <button onClick={() => setShowP(!showP)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 16 }}>{showP ? "🙈" : "👁"}</button>
          </div>
          {err && <div style={{ color: C.absent, fontSize: 13, marginTop: 8, fontWeight: 500 }}>⚠️ {err}</div>}
          <button style={T.btn()} onClick={doLogin}>Sign In →</button>
          <div style={{ color: C.muted, fontSize: 11, textAlign: "center", marginTop: 12 }}>
            Demo founder: <span style={{ color: C.accent, fontWeight: 700 }}>@SN_founder</span> / SN@admin1
          </div>
        </div>
      )}

      {tab === "register" && (
        <div style={T.card}>
          <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 4, color: C.text }}>Create your account ✨</div>
          <div style={{ color: C.sub, fontSize: 13, marginBottom: 16 }}>Pick a unique SN username &amp; get started</div>

          <div style={T.lbl}>Create Your SN Username</div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: C.accent, fontWeight: 800, fontSize: 15 }}>@</span>
            <input style={{ ...T.inp, paddingLeft: 30 }} type="text" placeholder="e.g. classrep_sca" value={rU} onChange={e => setRU(e.target.value)} autoCapitalize="none" />
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Letters, numbers and _ only. Min 4 characters.</div>

          <div style={{ ...T.lbl, marginTop: 14 }}>Create Password</div>
          <div style={{ position: "relative" }}>
            <input style={{ ...T.inp, paddingRight: 44 }} type={showRP ? "text" : "password"} placeholder="Min 7 chars, letters + numbers" value={rP} onChange={e => setRP(e.target.value)} />
            <button onClick={() => setShowRP(!showRP)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 16 }}>{showRP ? "🙈" : "👁"}</button>
          </div>
          {rP && strength && (
            <div style={{ marginTop: 6 }}>
              <div style={{ height: 4, background: "#E5E7EB", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: strength.w, background: strength.color, borderRadius: 4, transition: "width 0.3s" }} />
              </div>
              <div style={{ fontSize: 11, color: strength.color, fontWeight: 700, marginTop: 3 }}>{strength.label}</div>
            </div>
          )}

          <div style={{ ...T.lbl, marginTop: 14 }}>Class Name</div>
          <input style={T.inp} placeholder="e.g. SC-A, CS-B, IT-A" value={rC} onChange={e => setRC(e.target.value)} />
          <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>You'll manage attendance for this class</div>

          {rErr && <div style={{ color: C.absent, fontSize: 13, marginTop: 10, fontWeight: 500 }}>⚠️ {rErr}</div>}
          {rOk && <div style={{ color: C.present, fontSize: 13, marginTop: 10, fontWeight: 600 }}>{rOk}</div>}
          <button style={T.btn()} onClick={doRegister}>Create Account ✨</button>
        </div>
      )}

      {tab === "forgot" && (
        <div style={T.card}>
          {fStep === 1 && <>
            <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 4, color: C.text }}>🔓 Reset Password</div>
            <div style={{ color: C.sub, fontSize: 13, marginBottom: 16 }}>Enter your username to get started</div>
            <div style={T.lbl}>Your SN Username</div>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: C.accent, fontWeight: 800, fontSize: 15 }}>@</span>
              <input style={{ ...T.inp, paddingLeft: 30 }} type="text" placeholder="Your username" value={fUser} onChange={e => setFUser(e.target.value)} autoCapitalize="none" />
            </div>
            {fErr && <div style={{ color: C.absent, fontSize: 13, marginTop: 8, fontWeight: 500 }}>⚠️ {fErr}</div>}
            <button style={T.btn()} onClick={doFindUser}>Find My Account →</button>
          </>}

          {fStep === 2 && <>
            <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 4, color: C.text }}>🔐 Verify & Reset</div>
            <div style={{ color: C.sub, fontSize: 13, marginBottom: 16 }}>
              Verifying account: <span style={{ color: C.accent, fontWeight: 700 }}>@{fUser}</span>
            </div>

            <div style={{ background: "#FFF7ED", border: "1.5px solid #FED7AA", borderRadius: 12, padding: 12, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#92400E" }}>🔑 Security Check</div>
              <div style={{ fontSize: 12, color: "#B45309", marginTop: 3 }}>Enter the class name you registered with (e.g. SC-A)</div>
            </div>

            <div style={T.lbl}>Your Class Name</div>
            <input style={T.inp} placeholder="e.g. SC-A" value={fSecret} onChange={e => setFSecret(e.target.value)} />

            <div style={{ ...T.lbl, marginTop: 14 }}>New Password</div>
            <div style={{ position: "relative" }}>
              <input style={{ ...T.inp, paddingRight: 44 }} type={showFP ? "text" : "password"} placeholder="Min 7 chars, letters + numbers" value={fNewP} onChange={e => setFNewP(e.target.value)} />
              <button onClick={() => setShowFP(!showFP)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 16 }}>{showFP ? "🙈" : "👁"}</button>
            </div>

            <div style={{ ...T.lbl, marginTop: 12 }}>Confirm New Password</div>
            <input style={T.inp} type="password" placeholder="Re-enter new password" value={fConfP} onChange={e => setFConfP(e.target.value)} />

            {fNewP && fConfP && (
              <div style={{ fontSize: 12, marginTop: 5, color: fNewP === fConfP ? C.present : C.absent, fontWeight: 600 }}>
                {fNewP === fConfP ? "✅ Passwords match!" : "❌ Passwords don't match"}
              </div>
            )}

            {fErr && <div style={{ color: C.absent, fontSize: 13, marginTop: 8, fontWeight: 500 }}>⚠️ {fErr}</div>}
            {fOk && <div style={{ color: C.present, fontSize: 13, marginTop: 8, fontWeight: 600 }}>{fOk}</div>}

            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={() => { setFStep(1); setFErr(""); }} style={{ ...T.outbtn(C.muted), flex: 1, textAlign: "center" }}>← Back</button>
              <button style={{ ...T.btn(C.accentGrad, 0), flex: 2 }} onClick={doResetPassword}>Reset Password 🔐</button>
            </div>
          </>}
        </div>
      )}
      {/* ── PERMISSION MODAL ── */}
      {showPermModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,17,40,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: "28px 22px 36px", width: "100%", maxWidth: 430, boxShadow: "0 -8px 40px rgba(0,0,0,0.18)" }}>
            <div style={{ width: 40, height: 4, background: "#E5E7EB", borderRadius: 4, margin: "0 auto 20px" }} />
            <div style={{ fontSize: 22, textAlign: "center", marginBottom: 6 }}>🔐</div>
            <div style={{ fontWeight: 900, fontSize: 18, textAlign: "center", color: C.text, marginBottom: 6 }}>Remember Me?</div>
            <div style={{ fontSize: 13, color: C.sub, textAlign: "center", marginBottom: 22, lineHeight: 1.6 }}>
              Would you like SN to remember your login details so you don't have to type them next time?
            </div>

            <button onClick={() => handlePermission("full")} style={{ width: "100%", background: C.accentGrad, color: "#fff", border: "none", borderRadius: 14, padding: "14px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 10, boxShadow: "0 4px 14px rgba(79,70,229,0.3)", textAlign: "left", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22 }}>✅</span>
              <div>
                <div>Yes, save username & password</div>
                <div style={{ fontSize: 11, opacity: 0.85, fontWeight: 500, marginTop: 2 }}>One tap sign-in next time</div>
              </div>
            </button>

            <button onClick={() => handlePermission("user")} style={{ width: "100%", background: "#F0F4FF", color: C.accent, border: `1.5px solid ${C.accent}30`, borderRadius: 14, padding: "14px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 10, textAlign: "left", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22 }}>👤</span>
              <div>
                <div>Save username only</div>
                <div style={{ fontSize: 11, color: C.sub, fontWeight: 500, marginTop: 2 }}>I'll type my password each time</div>
              </div>
            </button>

            <button onClick={() => handlePermission("none")} style={{ width: "100%", background: "#F9FAFB", color: C.muted, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "14px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22 }}>🚫</span>
              <div>
                <div>No, don't save anything</div>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 500, marginTop: 2 }}>I'll enter everything manually</div>
              </div>
            </button>

            <div style={{ fontSize: 11, color: C.muted, textAlign: "center", marginTop: 14, lineHeight: 1.5 }}>
              🔒 Saved only on this device. You can change this anytime from settings.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── FOUNDER DASHBOARD ──────────────────────────────────────────────────────────
function FounderDashboard({ user, onLogout }) {
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [sel, setSel] = useState(null);
  const [editCls, setEditCls] = useState(null);
  const [editName, setEditName] = useState(""); const [editErr, setEditErr] = useState("");

  function refresh() { setClasses(load("alm_classes", [])); setUsers(load("alm_users", [])); }
  useEffect(() => { refresh(); }, []);

  function saveClassName() {
    setEditErr("");
    const norm = editName.trim().toUpperCase();
    if (!norm) { setEditErr("Name cannot be empty."); return; }
    const all = load("alm_classes", []);
    if (all.find(c => c.name.toUpperCase() === norm && c.id !== editCls.id)) { setEditErr("Class name already exists."); return; }
    save("alm_classes", all.map(c => c.id === editCls.id ? { ...c, name: norm } : c));
    setEditCls(null); refresh();
  }

  function deleteClass(cls) {
    if (!window.confirm(`Delete "${cls.name}" and ALL its data?`)) return;
    save("alm_classes", load("alm_classes", []).filter(c => c.id !== cls.id));
    save("alm_students", load("alm_students", []).filter(s => s.classId !== cls.id));
    save("alm_attendance", load("alm_attendance", []).filter(r => r.classId !== cls.id));
    save("alm_users", load("alm_users", []).map(u => u.classId === cls.id ? { ...u, classId: null } : u));
    refresh();
  }

  const adminsFor = cid => users.filter(u => u.classId === cid && u.role === "admin").map(u => u.username);
  const studentsFor = cid => load("alm_students", []).filter(s => s.classId === cid).length;

  if (sel) return <ClassDashboard user={{ ...user, classId: sel.id }} classObj={sel} onLogout={onLogout} onBack={() => { setSel(null); refresh(); }} />;

  return (
    <div style={T.wrap}>
      <div style={T.hdr}>
        <SNMini />
        <div style={T.htitle}>Founder Dashboard</div>
        <span style={T.badge("#F59E0B", "#FFFBEB")}>👑 All Classes</span>
        <button onClick={onLogout} style={T.iconBtn(C.muted)} title="Logout">🚪</button>
      </div>
      <div style={T.sec}>
        <div style={{ fontSize: 13, color: C.sub, marginBottom: 12, fontWeight: 500 }}>
          {classes.length} class{classes.length !== 1 ? "es" : ""} registered across the platform
        </div>
        {classes.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: C.muted }}>
            <div style={{ fontSize: 40 }}>🏫</div>
            <div style={{ marginTop: 10, fontWeight: 600 }}>No classes registered yet</div>
          </div>
        )}
        {classes.map(cls => (
          <div key={cls.id} style={T.card}>
            {editCls?.id === cls.id ? (
              <div>
                <div style={{ fontWeight: 700, color: C.edit, marginBottom: 10 }}>✏️ Rename Class</div>
                <div style={T.lbl}>Class Name</div>
                <input style={T.inp} value={editName} onChange={e => setEditName(e.target.value)} autoFocus />
                {editErr && <div style={{ color: C.absent, fontSize: 12, marginTop: 5 }}>{editErr}</div>}
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button onClick={saveClassName} style={{ ...T.outbtn(C.present), flex: 1 }}>✔ Save</button>
                  <button onClick={() => setEditCls(null)} style={{ ...T.outbtn(C.muted), flex: 1 }}>✖ Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: C.accentGrad, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{cls.name.slice(0, 3)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>{cls.name}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{adminsFor(cls.id)[0] || "No admin"}</div>
                  </div>
                  <span style={T.badge(C.accent)}>{studentsFor(cls.id)} students</span>
                </div>
                <div style={{ display: "flex", gap: 7, marginTop: 12 }}>
                  <button onClick={() => setSel(cls)} style={{ ...T.outbtn(C.accent), flex: 2 }}>📂 Open Class</button>
                  <button onClick={() => { setEditCls(cls); setEditName(cls.name); setEditErr(""); }} style={{ ...T.outbtn(C.edit), flex: 1 }}>✏️ Rename</button>
                  <button onClick={() => deleteClass(cls)} style={{ ...T.outbtn(C.absent), flex: 1 }}>🗑</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CLASS DASHBOARD ────────────────────────────────────────────────────────────
function ClassDashboard({ user, classObj, onLogout, onBack }) {
  const [tab, setTab] = useState("mark");
  const myClass = classObj || load("alm_classes", []).find(c => c.id === user.classId);
  if (!myClass) return (
    <div style={{ ...T.wrap, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28 }}>
      <div style={{ fontSize: 52 }}>⚠️</div>
      <div style={{ fontWeight: 800, fontSize: 18, marginTop: 14 }}>No Class Assigned</div>
      <div style={{ color: C.sub, marginTop: 6, textAlign: "center" }}>Contact the app founder to assign your class.</div>
      <button style={T.btn(C.accentGrad, 24)} onClick={onLogout}>Back to Login</button>
    </div>
  );

  const tabs = [
    { id: "mark", icon: "✅", label: "Mark" },
    { id: "students", icon: "👥", label: "Students" },
    { id: "history", icon: "📊", label: "History" },
  ];

  return (
    <div style={T.wrap}>
      <div style={T.hdr}>
        {onBack && <button onClick={onBack} style={T.iconBtn(C.accent)}>←</button>}
        <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accentGrad, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{myClass.name.slice(0, 3)}</div>
        <div style={T.htitle}>{myClass.name}</div>
        {user.role === "founder" && <span style={T.badge("#7C3AED", "#F5F3FF")}>👑</span>}
        <SNMini />
        <button onClick={onLogout} style={T.iconBtn(C.muted)}>🚪</button>
      </div>

      <div style={{ padding: "0 14px", marginTop: 14 }}>
        {tab === "mark" && <MarkAttendance classId={myClass.id} />}
        {tab === "students" && <StudentManager classId={myClass.id} />}
        {tab === "history" && <AttendanceHistory classId={myClass.id} />}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "#fff", borderTop: `1px solid ${C.border}`, display: "flex", zIndex: 20, boxShadow: "0 -4px 20px rgba(0,0,0,0.07)" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, background: "none", border: "none", padding: "12px 0 8px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: tab === t.id ? C.accent : C.muted, letterSpacing: 0.3 }}>{t.label.toUpperCase()}</span>
            {tab === t.id && <div style={{ width: 28, height: 3, background: C.accentGrad, borderRadius: 3 }} />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── STUDENT MANAGER ────────────────────────────────────────────────────────────
function StudentManager({ classId }) {
  const [students, setStudents] = useState([]);
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ rollNo: "", name: "", dob: "", gender: "" });
  const [editForm, setEditForm] = useState({});
  const [err, setErr] = useState(""); const [editErr, setEditErr] = useState("");
  const [search, setSearch] = useState("");

  function refresh() {
    setStudents(load("alm_students", []).filter(s => s.classId === classId)
      .sort((a, b) => a.rollNo.localeCompare(b.rollNo, undefined, { numeric: true })));
  }
  useEffect(() => { refresh(); }, [classId]);

  function addStudent() {
    setErr("");
    if (!form.rollNo.trim() || !form.name.trim()) { setErr("Roll No and Name are required."); return; }
    const all = load("alm_students", []);
    if (all.find(s => s.classId === classId && s.rollNo.toLowerCase() === form.rollNo.trim().toLowerCase())) { setErr("This Roll No already exists in the class."); return; }
    const ns = { id: uid(), classId, rollNo: form.rollNo.trim().toUpperCase(), name: form.name.trim(), dob: form.dob, gender: form.gender };
    save("alm_students", [...all, ns].sort((a, b) => a.rollNo.localeCompare(b.rollNo, undefined, { numeric: true })));
    refresh(); setForm({ rollNo: "", name: "", dob: "", gender: "" }); setAdding(false);
  }

  function startEdit(s) { setEditId(s.id); setEditForm({ rollNo: s.rollNo, name: s.name, dob: s.dob || "", gender: s.gender || "" }); setEditErr(""); }

  function saveEdit() {
    setEditErr("");
    if (!editForm.rollNo.trim() || !editForm.name.trim()) { setEditErr("Roll No and Name required."); return; }
    const all = load("alm_students", []);
    if (all.find(s => s.classId === classId && s.rollNo.toLowerCase() === editForm.rollNo.trim().toLowerCase() && s.id !== editId)) { setEditErr("Roll No already taken."); return; }
    save("alm_students", all.map(s => s.id === editId ? { ...s, rollNo: editForm.rollNo.trim().toUpperCase(), name: editForm.name.trim(), dob: editForm.dob, gender: editForm.gender } : s)
      .sort((a, b) => a.rollNo.localeCompare(b.rollNo, undefined, { numeric: true })));
    refresh(); setEditId(null);
  }

  function deleteStudent(id, name) {
    if (!window.confirm(`Remove "${name}" from this class?`)) return;
    save("alm_students", load("alm_students", []).filter(s => s.id !== id)); refresh();
  }

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase()));

  const genderColor = g => g === "Male" ? "#3B82F6" : g === "Female" ? "#EC4899" : C.sub;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Students</div>
          <div style={{ fontSize: 12, color: C.sub }}>{students.length} enrolled</div>
        </div>
        <button onClick={() => { setAdding(!adding); setEditId(null); }} style={{ background: adding ? C.absentBg : C.accentGrad, color: adding ? C.absent : "#fff", border: adding ? `1.5px solid ${C.absent}30` : "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: adding ? "none" : "0 3px 10px rgba(79,70,229,0.25)" }}>
          {adding ? "✖ Cancel" : "+ Add Student"}
        </button>
      </div>

      {adding && (
        <div style={{ ...T.card, borderLeft: `4px solid ${C.accent}` }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: C.accent, marginBottom: 12 }}>➕ New Student</div>
          <div style={T.lbl}>Roll Number *</div>
          <input style={T.inp} placeholder="e.g. 101" value={form.rollNo} onChange={e => setForm({ ...form, rollNo: e.target.value })} />
          <div style={{ ...T.lbl, marginTop: 12 }}>Full Name *</div>
          <input style={T.inp} placeholder="Student's full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <div style={{ ...T.lbl, marginTop: 12 }}>Date of Birth</div>
          <input style={T.inp} type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
          <div style={{ ...T.lbl, marginTop: 12 }}>Gender</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["Male", "Female", "Other"].map(g => <button key={g} onClick={() => setForm({ ...form, gender: g })} style={T.pill(form.gender === g, genderColor(g))}>{g}</button>)}
          </div>
          {err && <div style={{ color: C.absent, fontSize: 13, marginTop: 8, fontWeight: 500 }}>⚠️ {err}</div>}
          <button style={T.btn("linear-gradient(135deg,#059669,#10B981)")} onClick={addStudent}>✔ Add Student</button>
        </div>
      )}

      <div style={{ position: "relative", marginBottom: 12 }}>
        <input style={{ ...T.inp, paddingLeft: 38 }} placeholder="Search by name or roll number..." value={search} onChange={e => setSearch(e.target.value)} />
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.muted, fontSize: 16 }}>🔍</span>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "30px 0", color: C.muted }}>
          <div style={{ fontSize: 36 }}>👤</div>
          <div style={{ marginTop: 8, fontWeight: 600 }}>{search ? "No results found" : "No students yet — add one above!"}</div>
        </div>
      )}

      {filtered.map(s => (
        <div key={s.id} style={{ ...T.card, padding: 12 }}>
          {editId === s.id ? (
            <div>
              <div style={{ fontWeight: 800, color: C.edit, fontSize: 13, marginBottom: 10 }}>✏️ Editing Student</div>
              <div style={T.lbl}>Roll Number *</div>
              <input style={T.inp} value={editForm.rollNo} onChange={e => setEditForm({ ...editForm, rollNo: e.target.value })} />
              <div style={{ ...T.lbl, marginTop: 10 }}>Full Name *</div>
              <input style={T.inp} value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
              <div style={{ ...T.lbl, marginTop: 10 }}>Date of Birth</div>
              <input style={T.inp} type="date" value={editForm.dob} onChange={e => setEditForm({ ...editForm, dob: e.target.value })} />
              <div style={{ ...T.lbl, marginTop: 10 }}>Gender</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                {["Male", "Female", "Other"].map(g => <button key={g} onClick={() => setEditForm({ ...editForm, gender: g })} style={T.pill(editForm.gender === g, genderColor(g))}>{g}</button>)}
              </div>
              {editErr && <div style={{ color: C.absent, fontSize: 12, marginBottom: 8 }}>⚠️ {editErr}</div>}
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={saveEdit} style={{ ...T.outbtn(C.present), flex: 1, textAlign: "center" }}>✔ Save Changes</button>
                <button onClick={() => setEditId(null)} style={{ ...T.outbtn(C.muted), flex: 1, textAlign: "center" }}>✖ Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: C.accent, fontSize: 12, flexShrink: 0 }}>{s.rollNo}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                  {s.gender && <span style={{ color: genderColor(s.gender), fontWeight: 600 }}>{s.gender}</span>}
                  {s.gender && s.dob && " · "}
                  {s.dob && `DOB: ${s.dob}`}
                </div>
              </div>
              <button onClick={() => startEdit(s)} style={T.iconBtn(C.edit)}>✏️</button>
              <button onClick={() => deleteStudent(s.id, s.name)} style={T.iconBtn(C.absent)}>🗑</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── MARK ATTENDANCE ────────────────────────────────────────────────────────────
function MarkAttendance({ classId }) {
  const [date, setDate] = useState(today());
  const [hour, setHour] = useState("Hour 1");
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState({});
  const [saved, setSaved] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const hours = ["Hour 1", "Hour 2", "Hour 3", "Hour 4", "Hour 5", "Hour 6", "Hour 7", "Hour 8"];

  useEffect(() => {
    const all = load("alm_students", []).filter(s => s.classId === classId).sort((a, b) => a.rollNo.localeCompare(b.rollNo, undefined, { numeric: true }));
    setStudents(all);
    const rec = load("alm_attendance", []).find(r => r.classId === classId && r.date === date && r.hour === hour);
    if (rec) { setStatus(rec.status); setSaved(true); }
    else { const d = {}; all.forEach(s => { d[s.id] = "P"; }); setStatus(d); setSaved(false); }
  }, [classId, date, hour]);

  function markAll(v) { const d = {}; students.forEach(s => { d[s.id] = v; }); setStatus(d); setSaved(false); }
  function setOne(id, v) { setStatus(p => ({ ...p, [id]: v })); setSaved(false); }

  function saveAttendance() {
    const recs = load("alm_attendance", []).filter(r => !(r.classId === classId && r.date === date && r.hour === hour));
    recs.push({ id: uid(), classId, date, hour, status, savedAt: new Date().toISOString() });
    save("alm_attendance", recs); setSaved(true); setShowSummary(true);
  }

  const counts = { P: 0, A: 0, OD: 0 };
  students.forEach(s => { if (status[s.id]) counts[status[s.id]]++; });

  const META = {
    P: { color: C.present, bg: C.presentBg, label: "Present", short: "P" },
    A: { color: C.absent,  bg: C.absentBg,  label: "Absent",  short: "A" },
    OD:{ color: C.od,      bg: C.odBg,      label: "On Duty", short: "OD"},
  };

  if (showSummary) return <AttendanceSummary classId={classId} date={date} hour={hour} students={students} status={status} onBack={() => setShowSummary(false)} />;

  return (
    <div>
      <div style={T.card}>
        <div style={T.lbl}>📅 Date</div>
        <input style={T.inp} type="date" value={date} onChange={e => setDate(e.target.value)} />
        <div style={{ ...T.lbl, marginTop: 12 }}>🕐 Period / Hour</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 5 }}>
          {hours.map(h => <button key={h} onClick={() => setHour(h)} style={{ ...T.pill(hour === h), padding: "6px 11px" }}>{h}</button>)}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {Object.entries(META).map(([k, m]) => (
          <div key={k} style={{ flex: 1, background: m.bg, border: `1.5px solid ${m.color}30`, borderRadius: 14, padding: "12px 0", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: m.color }}>{counts[k]}</div>
            <div style={{ fontSize: 10, color: m.color, fontWeight: 700, letterSpacing: 0.5 }}>{m.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Quick mark all */}
      <div style={{ display: "flex", gap: 7, marginBottom: 12 }}>
        {Object.entries(META).map(([k, m]) => (
          <button key={k} onClick={() => markAll(k)} style={{ flex: 1, background: m.bg, color: m.color, border: `1.5px solid ${m.color}30`, borderRadius: 10, padding: "8px 0", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            All {m.label}
          </button>
        ))}
      </div>

      {students.length === 0 && (
        <div style={{ textAlign: "center", padding: "30px 0", color: C.muted }}>
          <div style={{ fontSize: 36 }}>📋</div>
          <div style={{ marginTop: 8, fontWeight: 600 }}>Add students first in the Students tab</div>
        </div>
      )}

      {students.map(s => {
        const v = status[s.id] || "P";
        const m = META[v];
        return (
          <div key={s.id} style={{ ...T.card, display: "flex", alignItems: "center", gap: 10, padding: "11px 13px" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: m.bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: m.color, fontSize: 11, flexShrink: 0, border: `1.5px solid ${m.color}30` }}>{s.rollNo}</div>
            <div style={{ flex: 1, fontWeight: 600, fontSize: 13 }}>{s.name}</div>
            <div style={{ display: "flex", gap: 5 }}>
              {Object.entries(META).map(([k, mm]) => (
                <button key={k} onClick={() => setOne(s.id, k)} style={{ background: v === k ? mm.color : "#F3F4F6", color: v === k ? "#fff" : C.muted, border: "none", borderRadius: 8, padding: "6px 9px", fontSize: 11, fontWeight: 800, cursor: "pointer", transition: "all 0.15s" }}>{k}</button>
              ))}
            </div>
          </div>
        );
      })}

      {students.length > 0 && (
        <button style={T.btn(saved ? "linear-gradient(135deg,#059669,#10B981)" : C.accentGrad, 14)} onClick={saveAttendance}>
          {saved ? "✅ Saved — View Summary" : "💾 Save Attendance"}
        </button>
      )}
    </div>
  );
}

// ── ATTENDANCE SUMMARY ─────────────────────────────────────────────────────────
function AttendanceSummary({ classId, date, hour, students, status, onBack }) {
  const present = students.filter(s => status[s.id] === "P");
  const absent  = students.filter(s => status[s.id] === "A");
  const od      = students.filter(s => status[s.id] === "OD");
  const cls = load("alm_classes", []).find(c => c.id === classId);

  function share() {
    let txt = `📋 ${cls?.name || ""} | ${date} | ${hour}\nTotal: ${students.length}  ✅ ${present.length}  ❌ ${absent.length}  🟡 ${od.length}\n`;
    if (absent.length)  { txt += `\n❌ ABSENT (${absent.length}):\n`;  absent.forEach(s  => { txt += `  [${s.rollNo}] ${s.name}\n`; }); }
    if (od.length)      { txt += `\n🟡 ON DUTY (${od.length}):\n`;     od.forEach(s      => { txt += `  [${s.rollNo}] ${s.name}\n`; }); }
    if (present.length) { txt += `\n✅ PRESENT (${present.length}):\n`; present.forEach(s => { txt += `  [${s.rollNo}] ${s.name}\n`; }); }
    txt += `\n— via SN Attendance Marker`;
    if (navigator.share) navigator.share({ text: txt });
    else { navigator.clipboard.writeText(txt); alert("✅ Copied to clipboard!"); }
  }

  const Sec = ({ title, color, bg, emoji, list }) => list.length === 0 ? null : (
    <div style={{ ...T.card, borderLeft: `4px solid ${color}`, background: bg }}>
      <div style={{ fontWeight: 800, color, marginBottom: 8, fontSize: 14 }}>{emoji} {title} <span style={{ fontWeight: 600, opacity: 0.8 }}>({list.length})</span></div>
      {list.map((s, i) => (
        <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < list.length - 1 ? `1px solid ${color}20` : "none" }}>
          <span style={T.badge(color, bg)}>{s.rollNo}</span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.accent, cursor: "pointer", fontSize: 14, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 4 }}>← Back to Marking</button>
      <div style={{ background: C.accentGrad, borderRadius: 18, padding: "18px 16px", marginBottom: 14, color: "#fff" }}>
        <div style={{ fontWeight: 900, fontSize: 16 }}>{cls?.name} · {date} · {hour}</div>
        <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
          {[["✅", present.length, "Present"], ["❌", absent.length, "Absent"], ["🟡", od.length, "On Duty"]].map(([e, n, l]) => (
            <div key={l}>
              <div style={{ fontWeight: 900, fontSize: 24 }}>{n}</div>
              <div style={{ fontSize: 11, opacity: 0.85, fontWeight: 600 }}>{l}</div>
            </div>
          ))}
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontWeight: 900, fontSize: 24 }}>{students.length}</div>
            <div style={{ fontSize: 11, opacity: 0.85, fontWeight: 600 }}>Total</div>
          </div>
        </div>
      </div>

      <Sec title="Absent" color={C.absent} bg={C.absentBg} emoji="❌" list={absent} />
      <Sec title="On Duty (OD)" color={C.od} bg={C.odBg} emoji="🟡" list={od} />
      <Sec title="Present" color={C.present} bg={C.presentBg} emoji="✅" list={present} />

      {/* Quick copy buttons */}
      <div style={{ background: "#F8FAFF", border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 10 }}>⚡ Quick Copy</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {absent.length > 0 && (
            <button onClick={() => {
              const txt = `❌ Absent (${absent.length}):\n` + absent.map(s => `[${s.rollNo}] ${s.name}`).join("\n");
              navigator.clipboard.writeText(txt); alert("✅ Absent list copied!");
            }} style={{ background: C.absentBg, color: C.absent, border: `1.5px solid ${C.absent}30`, borderRadius: 10, padding: "10px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "left" }}>
              📋 Copy Absent Names ({absent.length})
            </button>
          )}
          {od.length > 0 && (
            <button onClick={() => {
              const txt = `🟡 On Duty (${od.length}):\n` + od.map(s => `[${s.rollNo}] ${s.name}`).join("\n");
              navigator.clipboard.writeText(txt); alert("✅ OD list copied!");
            }} style={{ background: C.odBg, color: C.od, border: `1.5px solid ${C.od}30`, borderRadius: 10, padding: "10px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "left" }}>
              📋 Copy OD Names ({od.length})
            </button>
          )}
          {present.length > 0 && (
            <button onClick={() => {
              const txt = `✅ Present (${present.length}):\n` + present.map(s => `[${s.rollNo}] ${s.name}`).join("\n");
              navigator.clipboard.writeText(txt); alert("✅ Present list copied!");
            }} style={{ background: C.presentBg, color: C.present, border: `1.5px solid ${C.present}30`, borderRadius: 10, padding: "10px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "left" }}>
              📋 Copy Present Names ({present.length})
            </button>
          )}
          <button onClick={() => {
            const txt = absent.map(s => s.rollNo).join(", ");
            navigator.clipboard.writeText(txt); alert("✅ Absent roll numbers copied!");
          }} style={{ background: "#EEF2FF", color: C.accent, border: `1.5px solid ${C.accent}30`, borderRadius: 10, padding: "10px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "left" }}>
            🔢 Copy Absent Roll Numbers Only
          </button>
        </div>
      </div>

      <button style={T.btn()} onClick={share}>📤 Share Full Summary (WhatsApp / Copy)</button>
    </div>
  );
}

// ── ATTENDANCE HISTORY ─────────────────────────────────────────────────────────
function AttendanceHistory({ classId }) {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [editStatus, setEditStatus] = useState({});
  const [viewing, setViewing] = useState(null);

  function refresh() {
    setRecords(load("alm_attendance", []).filter(r => r.classId === classId).sort((a, b) => b.date.localeCompare(a.date) || b.hour.localeCompare(a.hour)));
    setStudents(load("alm_students", []).filter(s => s.classId === classId).sort((a, b) => a.rollNo.localeCompare(b.rollNo, undefined, { numeric: true })));
  }
  useEffect(() => { refresh(); }, [classId]);

  function saveEdit() {
    save("alm_attendance", load("alm_attendance", []).map(r => r.id === editing.id ? { ...r, status: editStatus, savedAt: new Date().toISOString() } : r));
    refresh(); setEditing(null);
  }

  function deleteRecord(r) {
    if (!window.confirm(`Delete attendance for ${r.date} — ${r.hour}?`)) return;
    save("alm_attendance", load("alm_attendance", []).filter(x => x.id !== r.id));
    refresh(); setEditing(null); setViewing(null);
  }

  const filtered = records.filter(r => {
    if (filter === "today") return r.date === today();
    if (filter === "week") return (new Date() - new Date(r.date)) / 86400000 <= 7;
    return true;
  });

  const cntV = (r, v) => Object.values(r.status || {}).filter(x => x === v).length;
  const META = {
    P: { color: C.present, bg: C.presentBg },
    A: { color: C.absent,  bg: C.absentBg  },
    OD:{ color: C.od,      bg: C.odBg      },
  };
  const colorFor = v => META[v]?.color || C.muted;

  if (viewing) return <AttendanceSummary classId={classId} date={viewing.date} hour={viewing.hour} students={students.filter(s => viewing.status[s.id])} status={viewing.status} onBack={() => setViewing(null)} />;

  if (editing) {
    const allStuIds = new Set(Object.keys(editStatus));
    const allForEdit = [...students.filter(s => allStuIds.has(s.id)), ...students.filter(s => !allStuIds.has(s.id))];
    const counts = { P: 0, A: 0, OD: 0 };
    allForEdit.forEach(s => { const v = editStatus[s.id]; if (v) counts[v]++; });

    return (
      <div>
        <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", color: C.accent, cursor: "pointer", fontSize: 14, fontWeight: 700, marginBottom: 10 }}>← Back to History</button>
        <div style={{ ...T.card, borderLeft: `4px solid ${C.edit}`, background: C.editBg }}>
          <div style={{ fontWeight: 800, color: C.edit, fontSize: 14 }}>✏️ Editing Record</div>
          <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>{editing.date} — {editing.hour}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {Object.entries(META).map(([k, m]) => (
              <div key={k} style={{ flex: 1, background: m.bg, border: `1px solid ${m.color}30`, borderRadius: 10, padding: "8px 0", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: m.color }}>{counts[k]}</div>
                <div style={{ fontSize: 10, color: m.color, fontWeight: 700 }}>{k === "P" ? "Present" : k === "A" ? "Absent" : "OD"}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 7, marginBottom: 10 }}>
          {Object.entries(META).map(([k, m]) => (
            <button key={k} onClick={() => { const d = {}; allForEdit.forEach(s => { d[s.id] = k; }); setEditStatus(d); }}
              style={{ flex: 1, background: m.bg, color: m.color, border: `1.5px solid ${m.color}30`, borderRadius: 10, padding: "7px 0", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              All {k === "P" ? "Present" : k === "A" ? "Absent" : "OD"}
            </button>
          ))}
        </div>

        {allForEdit.map(s => {
          const v = editStatus[s.id] || "P";
          const m = META[v];
          return (
            <div key={s.id} style={{ ...T.card, display: "flex", alignItems: "center", gap: 10, padding: "10px 12px" }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: m.bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: m.color, fontSize: 11, flexShrink: 0 }}>{s.rollNo}</div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{s.name}</div>
              <div style={{ display: "flex", gap: 5 }}>
                {Object.entries(META).map(([k, mm]) => (
                  <button key={k} onClick={() => setEditStatus(p => ({ ...p, [s.id]: k }))}
                    style={{ background: v === k ? mm.color : "#F3F4F6", color: v === k ? "#fff" : C.muted, border: "none", borderRadius: 8, padding: "5px 8px", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>{k}</button>
                ))}
              </div>
            </div>
          );
        })}

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button onClick={saveEdit} style={{ ...T.btn("linear-gradient(135deg,#059669,#10B981)", 0), flex: 2 }}>✔ Save Changes</button>
          <button onClick={() => deleteRecord(editing)} style={{ ...T.btn("linear-gradient(135deg,#DC2626,#EF4444)", 0), flex: 1 }}>🗑</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>Attendance History</div>
      <div style={{ fontSize: 12, color: C.sub, marginBottom: 12 }}>{records.length} total record{records.length !== 1 ? "s" : ""}</div>
      <div style={{ display: "flex", gap: 7, marginBottom: 14 }}>
        {[["all", "All Time"], ["today", "Today"], ["week", "This Week"]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{ ...T.pill(filter === v), padding: "7px 12px" }}>{l}</button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "30px 0", color: C.muted }}>
          <div style={{ fontSize: 36 }}>📊</div>
          <div style={{ marginTop: 8, fontWeight: 600 }}>No records found</div>
        </div>
      )}

      {filtered.map(r => (
        <div key={r.id} style={T.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{r.date}</div>
              <div style={{ fontSize: 12, color: C.sub, fontWeight: 600 }}>{r.hour} · Saved {new Date(r.savedAt).toLocaleTimeString()}</div>
            </div>
            <span style={T.badge(C.present, C.presentBg)}>{cntV(r, "P")} P</span>
            <span style={T.badge(C.absent, C.absentBg)}>{cntV(r, "A")} A</span>
            {cntV(r, "OD") > 0 && <span style={T.badge(C.od, C.odBg)}>{cntV(r, "OD")} OD</span>}
          </div>
          <div style={{ display: "flex", gap: 7, marginTop: 10 }}>
            <button onClick={() => setViewing(r)} style={{ ...T.outbtn(C.accent), flex: 1, textAlign: "center" }}>👁 View</button>
            <button onClick={() => { setEditing(r); setEditStatus({ ...r.status }); }} style={{ ...T.outbtn(C.edit), flex: 1, textAlign: "center" }}>✏️ Edit</button>
            <button onClick={() => deleteRecord(r)} style={{ ...T.outbtn(C.absent), flex: 1, textAlign: "center" }}>🗑 Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── APP ROOT ───────────────────────────────────────────────────────────────────
// ── PWA META INJECTOR ──────────────────────────────────────────────────────────
function injectPWAMeta() {
  // Inject manifest dynamically
  const manifest = {
    name: "SN Attendance Marker",
    short_name: "SN Attend",
    description: "Smart attendance marking for class reps",
    start_url: "/",
    display: "standalone",
    background_color: "#F0F4FF",
    theme_color: "#4F46E5",
    orientation: "portrait",
    icons: [
      { src: "data:image/svg+xml," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'><rect width='192' height='192' rx='40' fill='#4F46E5'/><text x='50%' y='58%' dominant-baseline='middle' text-anchor='middle' font-family='Inter,sans-serif' font-weight='900' font-size='88' fill='white'>SN</text></svg>`), sizes: "192x192", type: "image/svg+xml" },
      { src: "data:image/svg+xml," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><rect width='512' height='512' rx='100' fill='#4F46E5'/><text x='50%' y='58%' dominant-baseline='middle' text-anchor='middle' font-family='Inter,sans-serif' font-weight='900' font-size='230' fill='white'>SN</text></svg>`), sizes: "512x512", type: "image/svg+xml" },
    ],
  };
  const blob = new Blob([JSON.stringify(manifest)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  let link = document.querySelector("link[rel='manifest']");
  if (!link) { link = document.createElement("link"); link.rel = "manifest"; document.head.appendChild(link); }
  link.href = url;

  // Theme color
  let meta = document.querySelector("meta[name='theme-color']");
  if (!meta) { meta = document.createElement("meta"); meta.name = "theme-color"; document.head.appendChild(meta); }
  meta.content = "#4F46E5";

  // Apple PWA tags
  const appleCapable = document.createElement("meta");
  appleCapable.name = "apple-mobile-web-app-capable"; appleCapable.content = "yes";
  document.head.appendChild(appleCapable);
  const appleStatus = document.createElement("meta");
  appleStatus.name = "apple-mobile-web-app-status-bar-style"; appleStatus.content = "default";
  document.head.appendChild(appleStatus);
  const appleTitle = document.createElement("meta");
  appleTitle.name = "apple-mobile-web-app-title"; appleTitle.content = "SN Attend";
  document.head.appendChild(appleTitle);

  // Title
  document.title = "SN Attendance Marker";
}

export default function App() {
  const [user, setUser] = useState(null);
  const [showBanner, setShowBanner] = useState(true);
  const isInstalled = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;

  useEffect(() => { injectPWAMeta(); }, []);

  if (!user) return (
    <>
      <LoginScreen onLogin={setUser} />
      {!isInstalled && showBanner && <InstallBanner onDismiss={() => setShowBanner(false)} />}
    </>
  );
  if (user.role === "founder") return <FounderDashboard user={user} onLogout={() => setUser(null)} />;
  const myClass = load("alm_classes", []).find(c => c.id === user.classId);
  return <ClassDashboard user={user} classObj={myClass} onLogout={() => setUser(null)} />;
}
