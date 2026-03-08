import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import LandingPage  from "./home.jsx";
import AuthPage     from "./authpage.jsx";
import Dashboard    from "./dashboard.jsx";
import CalendarPage from "./calendarpage.jsx";

/* ── Design tokens (matches all pages) ─────────────────── */
const T = {
  bg0:"#0f0b07", bg1:"#19110a", bg2:"#231708", bg3:"#2e1f0e",
  t1:"#f2dfc4", t2:"#9d7d5a", t3:"#5a3f28",
  gold:"#e09840",
  goldGlow:"rgba(224,152,64,0.18)", goldRing:"rgba(224,152,64,0.28)",
  green:"#3ec98a",
  border:"rgba(224,152,64,0.08)", borderMd:"rgba(224,152,64,0.16)",
};

/* ── SVG Nav Icons ──────────────────────────────────────── */
function Ico({ d, size=18, color="currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d}/>
    </svg>
  );
}
const DashIcon  = (p) => <Ico {...p} d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>;
const CalIcon   = (p) => <Ico {...p} d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/>;
const BookIcon  = (p) => <Ico {...p} d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z"/>;
const BotIcon   = (p) => <Ico {...p} d="M12 2a4 4 0 014 4v1h1a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2h1V6a4 4 0 014-4zM9 9v1m6-1v1M9 15h6"/>;
const MicIcon   = (p) => <Ico {...p} d="M12 2a3 3 0 013 3v6a3 3 0 01-6 0V5a3 3 0 013-3zM19 10a7 7 0 01-14 0M12 19v3M8 22h8"/>;
const MailIcon  = (p) => <Ico {...p} d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM22 6l-10 7L2 6"/>;
const ChatIcon  = (p) => <Ico {...p} d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>;

const NAV_ITEMS = [
  { path:"/dashboard",    label:"Dashboard",     Icon:DashIcon  },
  { path:"/calendar",     label:"Schedule",      Icon:CalIcon   },
  { path:"/resources",    label:"Resources",     Icon:BookIcon  },
  { path:"/ai-tutor",     label:"AI Tutor",      Icon:BotIcon   },
  { path:"/pronunciation",label:"Pronunciation", Icon:MicIcon   },
  { path:"/pen-pals",     label:"Pen Pals",      Icon:MailIcon  },
  { path:"/community",    label:"Community",     Icon:ChatIcon  },
];

/* ── Coming Soon placeholder ────────────────────────────── */
function ComingSoon({ label }) {
  return (
    <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center",
      background:T.bg0, fontFamily:"'Sora',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <p style={{ fontSize:40, marginBottom:16 }}>🚧</p>
        <h2 style={{ fontSize:22, fontWeight:800, color:T.t1, marginBottom:8 }}>{label}</h2>
        <p style={{ fontSize:14, color:T.t2 }}>This page is coming soon!</p>
      </div>
    </div>
  );
}

/* ── Sidebar (shown on all /app routes) ─────────────────── */
function Sidebar() {
  const location = useLocation();
  const navigate  = useNavigate();
  const active    = location.pathname;
  const displayName  = "Mishka Mittal";
  const initials     = "MM";
  const displayLevel = "Journeyman";
  const displayLang  = "ES";

  return (
    <div style={{
      width:224, flexShrink:0, background:`linear-gradient(180deg,${T.bg0} 0%,#130e08 100%)`,
      borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column",
      position:"fixed", top:0, left:0, bottom:0, zIndex:50,
      boxShadow:`1px 0 0 ${T.border}, 4px 0 20px rgba(0,0,0,0.25)`,
      fontFamily:"'Sora',sans-serif",
    }}>
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"20px 16px 14px",
        borderBottom:`1px solid ${T.border}`, flexShrink:0, cursor:"pointer" }}
        onClick={() => navigate("/")}>
        <div style={{ width:34, height:34, borderRadius:11, background:T.goldGlow,
          border:`1px solid ${T.goldRing}`, display:"flex", alignItems:"center",
          justifyContent:"center", flexShrink:0 }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke={T.gold} strokeWidth="1.5"/>
            <path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" stroke={T.gold} strokeWidth="1.5"/>
          </svg>
        </div>
        <div>
          <p style={{ fontSize:13, fontWeight:800, color:T.t1, letterSpacing:"-0.02em" }}>SpeakSphere</p>
          <p style={{ fontSize:9.5, color:T.t3, fontWeight:600, letterSpacing:"0.06em" }}>LANGUAGE HUB</p>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex:1, overflowY:"auto", padding:"10px 10px" }}>
        {NAV_ITEMS.map(({ path, label, Icon }) => {
          const isActive = active === path || active.startsWith(path + "/");
          return (
            <button key={path}
              onClick={() => navigate(path)}
              className="nav-btn"
              style={{
                display:"flex", alignItems:"center", gap:9, padding:"9px 12px",
                borderRadius:10, border:"none",
                borderLeft: isActive ? `2px solid ${T.gold}` : "2px solid transparent",
                background: isActive ? T.goldGlow : "none",
                cursor:"pointer", transition:"all .18s", width:"100%", textAlign:"left",
                marginBottom:2,
              }}>
              <Icon size={16} color={isActive ? T.gold : T.t2}/>
              <span style={{ fontSize:13, fontWeight: isActive ? 700 : 500,
                color: isActive ? T.t1 : T.t2 }}>{label}</span>
              {isActive && (
                <div style={{ marginLeft:"auto", width:5, height:5, borderRadius:"50%",
                  background:T.gold, flexShrink:0 }}/>
              )}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 13px",
        margin:"6px 10px 12px", borderRadius:14, background:T.bg2,
        border:`1px solid ${T.border}`, flexShrink:0, cursor:"pointer" }}
        onClick={() => navigate("/dashboard")}>
        <div style={{ width:34, height:34, borderRadius:10, background:`linear-gradient(135deg,${T.gold},#c07828)`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:12, fontWeight:800, color:"#fff", flexShrink:0 }}>{initials}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:12, fontWeight:700, color:T.t1,
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{displayName}</p>
          <p style={{ fontSize:10, color:T.t3 }}>{displayLevel}{displayLang ? ` · ${displayLang}` : ""}</p>
        </div>
        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={T.t3} strokeWidth="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        .nav-btn:hover { background:${T.bg2} !important; border-left-color:${T.gold}44 !important; }
        .nav-btn:hover span { color:${T.t1} !important; }
      `}</style>
    </div>
  );
}

/* ── App shell with sidebar ─────────────────────────────── */
// Dashboard has its own built-in sidebar, so it renders full-screen.
// All other app pages get the shared sidebar.
function AppShell() {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard" || location.pathname.startsWith("/dashboard/");

  if (isDashboard) {
    return (
      <Routes>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="*"          element={<Navigate to="/dashboard" replace/>}/>
      </Routes>
    );
  }

  return (
    <div style={{ display:"flex", height:"100vh", background:T.bg0 }}>
      <Sidebar/>
      <div style={{ marginLeft:224, flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
        <Routes>
          <Route path="/calendar"      element={<CalendarPage/>}/>
          <Route path="/resources"     element={<ComingSoon label="Resources"/>}/>
          <Route path="/ai-tutor"      element={<ComingSoon label="AI Tutor"/>}/>
          <Route path="/pronunciation" element={<ComingSoon label="Pronunciation Studio"/>}/>
          <Route path="/pen-pals"      element={<ComingSoon label="Pen Pals"/>}/>
          <Route path="/community"     element={<ComingSoon label="Community"/>}/>
          <Route path="*"              element={<Navigate to="/dashboard" replace/>}/>
        </Routes>
      </div>
    </div>
  );
}

/* ── Root router ────────────────────────────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - no sidebar */}
        <Route path="/"       element={<LandingPage/>}/>
        <Route path="/login"  element={<AuthPage/>}/>
        <Route path="/signup" element={<AuthPage/>}/>

        {/* App routes - with sidebar */}
        <Route path="/*" element={<AppShell/>}/>
      </Routes>
    </BrowserRouter>
  );
}