import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ── Design tokens ── */
const DARK   = "#0d0702";
const CARD   = "#1b0f06";
const CARD2  = "#221208";
const GOLD   = "#d4a843";
const GOLDLT = "#f0cc55";
const CREAM  = "#f5ede0";
const MUTED  = "#c8aa80";
const DIM    = "#a08050";
const BORD   = "rgba(212,168,67,0.20)";
const A_ROSE = "#c07070";
const GRAIN  = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`;

function EyeIcon({ open, size = 16, color = "currentColor" }) {
  return open ? (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();

  const [currentPw, setCurrentPw]   = useState("");
  const [newPw, setNewPw]           = useState("");
  const [confirmPw, setConfirmPw]   = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwStatus, setPwStatus]     = useState(null); // null | "success" | "error"
  const [pwError, setPwError]       = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  function handlePasswordSave(e) {
    e.preventDefault();
    if (!currentPw) { setPwError("Please enter your current password."); setPwStatus("error"); return; }
    if (newPw.length < 8) { setPwError("New password must be at least 8 characters."); setPwStatus("error"); return; }
    if (newPw !== confirmPw) { setPwError("New passwords do not match."); setPwStatus("error"); return; }
    // Simulated success
    setPwStatus("success");
    setPwError("");
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setTimeout(() => setPwStatus(null), 3000);
  }

  function handleLogout() {
    navigate("/login");
  }

  const inputStyle = {
    width: "100%", background: DARK, border: `1px solid ${BORD}`,
    borderRadius: 6, padding: "11px 44px 11px 14px",
    fontFamily: "'Lora',serif", fontSize: 14, color: CREAM,
    outline: "none", boxSizing: "border-box",
    transition: "border-color .14s",
  };

  function PasswordField({ label, value, onChange, show, onToggle, id }) {
    return (
      <div style={{ marginBottom: 20 }}>
        <label htmlFor={id} style={{
          display: "block", fontFamily: "'Oswald',sans-serif", fontSize: 11,
          letterSpacing: "0.12em", textTransform: "uppercase", color: DIM, marginBottom: 8
        }}>{label}</label>
        <div style={{ position: "relative" }}>
          <input
            id={id} type={show ? "text" : "password"}
            value={value} onChange={e => onChange(e.target.value)}
            style={inputStyle}
            autoComplete="off"
          />
          <button type="button" onClick={onToggle} style={{
            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer", padding: 2, color: DIM,
            display: "flex", alignItems: "center",
          }}>
            <EyeIcon open={show} size={15} color={DIM} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column", background: DARK,
      backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "300px",
      height: "100%", overflowY: "auto",
      fontFamily: "'Lora',serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Lora:ital,wght@0,400;1,400&display=swap');
        .settings-input:focus { border-color: rgba(212,168,67,0.55) !important; }
        .settings-btn-ghost:hover { background: rgba(212,168,67,0.08) !important; }
        .settings-btn-logout:hover { background: rgba(192,112,112,0.12) !important; border-color: rgba(192,112,112,0.5) !important; }
        @media(max-width:640px){
          .settings-header { padding:20px 20px 16px !important; }
          .settings-content { padding:24px 20px !important; }
          .settings-card { padding:20px 18px !important; }
          .settings-h1 { font-size:28px !important; }
        }
      `}</style>

      {/* Header */}
      <div className="settings-header" style={{
        padding: "32px 48px 24px",
        borderBottom: `1px solid ${BORD}`,
        flexShrink: 0,
      }}>
        <p style={{
          fontFamily: "'Oswald',sans-serif", fontSize: 11, letterSpacing: "0.18em",
          textTransform: "uppercase", color: DIM, marginBottom: 8
        }}>SPEAKSPHERE · SETTINGS</p>
        <h1 className="settings-h1" style={{
          fontFamily: "'Oswald',sans-serif", fontSize: 38, fontWeight: 700,
          color: CREAM, letterSpacing: "0.05em", textTransform: "uppercase", lineHeight: 1
        }}>Account Settings</h1>
      </div>

      {/* Content */}
      <div className="settings-content" style={{ padding: "40px 48px", maxWidth: 640, width: "100%" }}>

        {/* Profile card */}
        <div className="settings-card" style={{
          background: CARD, border: `1px solid ${BORD}`, borderRadius: 10,
          padding: "24px 28px", marginBottom: 32,
          display: "flex", alignItems: "center", gap: 20,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 10, flexShrink: 0,
            background: `linear-gradient(135deg,${GOLD},#8a5a20)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 700, color:CREAM,
          }}>MM</div>
          <div>
            <p style={{
              fontFamily: "'Oswald',sans-serif", fontSize: 22, fontWeight: 600,
              color: CREAM, letterSpacing: "0.04em", lineHeight: 1.2
            }}>Mishka Mittal</p>
            <p style={{
              fontFamily: "'Lora',serif", fontSize: 13, color: MUTED,
              fontStyle: "italic", marginTop: 4
            }}>Journeyman · Spanish</p>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          fontFamily: "'Oswald',sans-serif", fontSize: 10, letterSpacing: "0.2em",
          color: DIM, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 12,
          marginBottom: 28
        }}>
          <span style={{ flex: 1, height: 1, background: BORD }} />
          Security
          <span style={{ flex: 1, height: 1, background: BORD }} />
        </div>

        {/* Change Password */}
        <div className="settings-card" style={{
          background: CARD, border: `1px solid ${BORD}`, borderRadius: 10,
          padding: "28px 28px 24px", marginBottom: 16,
        }}>
          <h2 style={{
            fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600,
            color: CREAM, letterSpacing: "0.06em", textTransform: "uppercase",
            marginBottom: 6
          }}>Change Password</h2>
          <p style={{ fontFamily: "'Lora',serif", fontSize: 13, color: MUTED, fontStyle: "italic", marginBottom: 28 }}>
            Choose a strong password at least 8 characters long.
          </p>

          <form onSubmit={handlePasswordSave}>
            <PasswordField
              id="current-pw" label="Current Password"
              value={currentPw} onChange={setCurrentPw}
              show={showCurrent} onToggle={() => setShowCurrent(v => !v)}
            />
            <PasswordField
              id="new-pw" label="New Password"
              value={newPw} onChange={setNewPw}
              show={showNew} onToggle={() => setShowNew(v => !v)}
            />
            <PasswordField
              id="confirm-pw" label="Confirm New Password"
              value={confirmPw} onChange={setConfirmPw}
              show={showConfirm} onToggle={() => setShowConfirm(v => !v)}
            />

            {pwStatus === "error" && (
              <p style={{
                fontFamily: "'Lora',serif", fontSize: 13, color: A_ROSE,
                marginBottom: 16, fontStyle: "italic"
              }}>{pwError}</p>
            )}
            {pwStatus === "success" && (
              <p style={{
                fontFamily: "'Lora',serif", fontSize: 13, color: "#7db87d",
                marginBottom: 16, fontStyle: "italic"
              }}>Password updated successfully.</p>
            )}

            <button type="submit" style={{
              fontFamily: "'Oswald',sans-serif", fontSize: 13, fontWeight: 600,
              letterSpacing: "0.12em", textTransform: "uppercase",
              background: GOLD, color:DARK, border: "none",
              borderRadius: 6, padding: "11px 28px", cursor: "pointer",
              transition: "background .14s",
            }}>Save Password</button>
          </form>
        </div>

        {/* Divider */}
        <div style={{
          fontFamily: "'Oswald',sans-serif", fontSize: 10, letterSpacing: "0.2em",
          color: DIM, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 12,
          margin: "32px 0 28px"
        }}>
          <span style={{ flex: 1, height: 1, background: BORD }} />
          Session
          <span style={{ flex: 1, height: 1, background: BORD }} />
        </div>

        {/* Log Out */}
        <div className="settings-card" style={{
          background: CARD, border: `1px solid ${BORD}`, borderRadius: 10,
          padding: "24px 28px",
        }}>
          <h2 style={{
            fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600,
            color: CREAM, letterSpacing: "0.06em", textTransform: "uppercase",
            marginBottom: 6
          }}>Log Out</h2>
          <p style={{
            fontFamily: "'Lora',serif", fontSize: 13, color: MUTED,
            fontStyle: "italic", marginBottom: 24
          }}>
            You will be returned to the login screen.
          </p>

          {!showLogoutConfirm ? (
            <button
              className="settings-btn-logout"
              onClick={() => setShowLogoutConfirm(true)}
              style={{
                fontFamily: "'Oswald',sans-serif", fontSize: 13, fontWeight: 600,
                letterSpacing: "0.12em", textTransform: "uppercase",
                background: "transparent", color: A_ROSE,
                border: `1px solid rgba(192,112,112,0.35)`,
                borderRadius: 6, padding: "11px 28px", cursor: "pointer",
                transition: "all .14s",
              }}>Log Out</button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <p style={{
                fontFamily: "'Lora',serif", fontSize: 13, color: MUTED,
                fontStyle: "italic"
              }}>Are you sure?</p>
              <button onClick={handleLogout} style={{
                fontFamily: "'Oswald',sans-serif", fontSize: 13, fontWeight: 600,
                letterSpacing: "0.10em", textTransform: "uppercase",
                background: A_ROSE, color: "#fff", border: "none",
                borderRadius: 6, padding: "9px 22px", cursor: "pointer",
              }}>Yes, log me out</button>
              <button
                className="settings-btn-ghost"
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  fontFamily: "'Oswald',sans-serif", fontSize: 13,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  background: "transparent", color: MUTED,
                  border: `1px solid ${BORD}`, borderRadius: 6,
                  padding: "9px 22px", cursor: "pointer", transition: "background .14s",
                }}>Cancel</button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
