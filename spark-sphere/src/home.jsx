import { useState, useEffect } from "react";

const NAV_LINKS = ["Services", "How It Works", "Tutors", "Pricing", "Contact"];

const SUBJECTS = [
  { icon: "∑", label: "Mathematics", color: "#E8F4F0", accent: "#2D7A5F" },
  { icon: "⚗", label: "Sciences", color: "#F4EEE8", accent: "#7A4F2D" },
  { icon: "✍", label: "Writing", color: "#EEE8F4", accent: "#5D2D7A" },
  { icon: "⌨", label: "Coding", color: "#E8EEF4", accent: "#2D4F7A" },
  { icon: "🌐", label: "Languages", color: "#F4F4E8", accent: "#6A7A2D" },
  { icon: "📚", label: "Test Prep", color: "#F4E8EE", accent: "#7A2D4F" },
];

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    role: "Parent of 9th grader",
    text: "My daughter went from a C to an A in Algebra in just 8 weeks. The tutor made concepts click in ways school never did.",
    initials: "SM",
    bg: "#2D7A5F",
  },
  {
    name: "James K.",
    role: "College sophomore",
    text: "I was drowning in Organic Chemistry. My tutor broke everything down so patiently. Passed my final with a B+!",
    initials: "JK",
    bg: "#7A4F2D",
  },
  {
    name: "Priya R.",
    role: "SAT student",
    text: "Raised my SAT score by 200 points after just 6 sessions. The personalized approach made all the difference.",
    initials: "PR",
    bg: "#5D2D7A",
  },
];

const STEPS = [
  { num: "01", title: "Tell us your goals", desc: "Share your subject, level, and what success looks like to you." },
  { num: "02", title: "Meet your tutor", desc: "We handpick a tutor matched to your learning style and schedule." },
  { num: "03", title: "Start learning", desc: "Book sessions at your pace — online or in-person, always 1-on-1." },
  { num: "04", title: "Watch progress", desc: "Track milestones and adjust the plan as you grow." },
];

export default function TutoringHomepage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: "#FAFAF7", color: "#1A1A16" }}
      className="min-h-screen overflow-x-hidden"
    >
      {/* Inject keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'Playfair Display', Georgia, serif; }
        .hero-text { font-family: 'Playfair Display', Georgia, serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        .anim-0 { animation: fadeUp 0.7s ease both; animation-delay: 0.1s; }
        .anim-1 { animation: fadeUp 0.7s ease both; animation-delay: 0.25s; }
        .anim-2 { animation: fadeUp 0.7s ease both; animation-delay: 0.4s; }
        .anim-3 { animation: fadeUp 0.7s ease both; animation-delay: 0.55s; }
        .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.10); }
        .btn-primary { transition: background 0.2s ease, transform 0.15s ease; }
        .btn-primary:hover { transform: translateY(-2px); }
        .testimonial-fade { animation: fadeIn 0.5s ease; }
      `}</style>

      {/* NAV */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          background: scrolled ? "rgba(250,250,247,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid #E8E8E2" : "none",
          transition: "all 0.3s ease",
          padding: "0 5%",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <div className="hero-text" style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: "#1A1A16" }}>
            Bright<span style={{ color: "#2D7A5F" }}>Path</span>
          </div>
          <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {NAV_LINKS.map((l) => (
              <a key={l} href="#" style={{ fontSize: 14, fontWeight: 400, color: "#555550", textDecoration: "none", letterSpacing: "0.01em", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#2D7A5F"}
                onMouseLeave={e => e.target.style.color = "#555550"}
              >{l}</a>
            ))}
            <button className="btn-primary" style={{ background: "#1A1A16", color: "#FAFAF7", border: "none", borderRadius: 6, padding: "10px 22px", fontSize: 14, fontWeight: 500, cursor: "pointer", letterSpacing: "0.02em" }}>
              Book a Session
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px 5% 80px", position: "relative", overflow: "hidden" }}>
        {/* Decorative blob */}
        <div style={{
          position: "absolute", top: "10%", right: "-5%", width: 520, height: 520,
          background: "radial-gradient(circle, #D4EDE5 0%, transparent 70%)",
          borderRadius: "50%", zIndex: 0, pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "5%", left: "-8%", width: 380, height: 380,
          background: "radial-gradient(circle, #EDE5D4 0%, transparent 70%)",
          borderRadius: "50%", zIndex: 0, pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            {/* Left */}
            <div style={{ opacity: visible ? 1 : 0 }}>
              <div className="anim-0" style={{ display: "inline-block", background: "#E8F4F0", color: "#2D7A5F", borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 500, marginBottom: 28, letterSpacing: "0.04em" }}>
                ✦ Personalized 1-on-1 Tutoring
              </div>
              <h1 className="hero-text anim-1" style={{ fontSize: "clamp(44px, 5.5vw, 72px)", lineHeight: 1.1, fontWeight: 700, marginBottom: 28, letterSpacing: "-0.03em" }}>
                Learning that<br />
                <em style={{ color: "#2D7A5F", fontStyle: "italic" }}>actually</em> sticks.
              </h1>
              <p className="anim-2" style={{ fontSize: 18, lineHeight: 1.7, color: "#555550", marginBottom: 44, maxWidth: 460, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
                Expert tutors matched to your unique learning style. Build real understanding — not just grades — across every subject.
              </p>
              <div className="anim-3" style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                <button className="btn-primary" style={{ background: "#2D7A5F", color: "#fff", border: "none", borderRadius: 8, padding: "16px 32px", fontSize: 16, fontWeight: 500, cursor: "pointer" }}>
                  Find My Tutor →
                </button>
                <button style={{ background: "transparent", color: "#1A1A16", border: "2px solid #D8D8D2", borderRadius: 8, padding: "14px 28px", fontSize: 16, fontWeight: 400, cursor: "pointer", transition: "border-color 0.2s" }}>
                  See How It Works
                </button>
              </div>
              {/* Stats */}
              <div style={{ display: "flex", gap: 40, marginTop: 56, paddingTop: 32, borderTop: "1px solid #E8E8E2" }}>
                {[["1,200+", "Students helped"], ["4.9★", "Average rating"], ["95%", "See grade improvement"]].map(([val, label]) => (
                  <div key={label}>
                    <div className="hero-text" style={{ fontSize: 28, fontWeight: 700, color: "#1A1A16" }}>{val}</div>
                    <div style={{ fontSize: 13, color: "#888882", fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating card grid */}
            <div style={{ position: "relative", height: 500 }}>
              {/* Main card */}
              <div style={{ position: "absolute", top: 20, left: 30, right: 0, background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 20px 60px rgba(0,0,0,0.10)", border: "1px solid #ECECEC" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#2D7A5F", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontFamily: "Georgia" }}>∑</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>Algebra II — Session 4</div>
                    <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>with Ms. Chen · Today, 4:00 PM</div>
                  </div>
                </div>
                <div style={{ background: "#F5F5F2", borderRadius: 12, padding: "16px 20px", marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>Today's focus</div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>Quadratic Equations & Graphing Parabolas</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Homework review", "Practice problems", "Q&A"].map(tag => (
                    <span key={tag} style={{ background: "#E8F4F0", color: "#2D7A5F", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 500 }}>{tag}</span>
                  ))}
                </div>
              </div>
              {/* Small badge */}
              <div style={{ position: "absolute", bottom: 60, left: 0, background: "#1A1A16", color: "#fff", borderRadius: 16, padding: "16px 24px", boxShadow: "0 8px 32px rgba(0,0,0,0.20)" }}>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "Georgia" }}>+200pts</div>
                <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>SAT score increase</div>
              </div>
              {/* Tutor avatars */}
              <div style={{ position: "absolute", bottom: 50, right: 20, background: "#fff", borderRadius: 14, padding: "14px 20px", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", border: "1px solid #ECECEC" }}>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>Available now</div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {["#2D7A5F", "#7A4F2D", "#5D2D7A", "#2D4F7A"].map((bg, i) => (
                    <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: bg, border: "2px solid #fff", marginLeft: i ? -8 : 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 600 }}>
                      {["AC","BM","SL","RT"][i]}
                    </div>
                  ))}
                  <span style={{ marginLeft: 12, fontSize: 13, fontWeight: 500, color: "#333" }}>12 tutors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUBJECTS */}
      <section style={{ padding: "80px 5%", background: "#F2F2EE" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 className="hero-text" style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 700, marginBottom: 16, letterSpacing: "-0.02em" }}>Every subject, every level.</h2>
            <p style={{ fontSize: 17, color: "#666", fontWeight: 300 }}>From 3rd grade to grad school — we've got you covered.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {SUBJECTS.map(({ icon, label, color, accent }) => (
              <div key={label} className="card-hover" style={{ background: color, borderRadius: 16, padding: "32px 28px", cursor: "pointer", border: `1px solid ${color}` }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{icon}</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: accent }}>{label}</div>
                <div style={{ fontSize: 13, color: "#888", marginTop: 8, fontWeight: 300 }}>Explore tutors →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "100px 5%", background: "#FAFAF7" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", color: "#2D7A5F", textTransform: "uppercase", marginBottom: 20 }}>How It Works</div>
              <h2 className="hero-text" style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, marginBottom: 20, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                From "confused" to<br /><em style={{ color: "#2D7A5F" }}>confident</em> — fast.
              </h2>
              <p style={{ fontSize: 16, color: "#666", lineHeight: 1.7, fontWeight: 300 }}>
                Our structured onboarding ensures every student is paired with exactly the right tutor, with a learning plan built around their specific needs.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {STEPS.map(({ num, title, desc }) => (
                <div key={num} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                  <div className="hero-text" style={{ fontSize: 36, fontWeight: 700, color: "#E0E0DA", lineHeight: 1, flexShrink: 0, minWidth: 48 }}>{num}</div>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{title}</div>
                    <div style={{ fontSize: 14, color: "#777", fontWeight: 300, lineHeight: 1.6 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 5%", background: "#1A1A16", color: "#FAFAF7" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", color: "#2D7A5F", textTransform: "uppercase", marginBottom: 24 }}>Student Stories</div>
          <h2 className="hero-text" style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, marginBottom: 60, letterSpacing: "-0.02em" }}>
            Real results, real students.
          </h2>
          <div key={activeTestimonial} className="testimonial-fade" style={{ marginBottom: 48 }}>
            <div className="hero-text" style={{ fontSize: "clamp(20px, 2.5vw, 28px)", lineHeight: 1.5, fontStyle: "italic", color: "#E8E8E2", marginBottom: 36, fontWeight: 400 }}>
              "{TESTIMONIALS[activeTestimonial].text}"
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: TESTIMONIALS[activeTestimonial].bg, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600, fontSize: 14 }}>
                {TESTIMONIALS[activeTestimonial].initials}
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{TESTIMONIALS[activeTestimonial].name}</div>
                <div style={{ fontSize: 13, color: "#777", marginTop: 2 }}>{TESTIMONIALS[activeTestimonial].role}</div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)} style={{ width: i === activeTestimonial ? 28 : 8, height: 8, borderRadius: 4, background: i === activeTestimonial ? "#2D7A5F" : "#444", border: "none", cursor: "pointer", transition: "all 0.3s" }} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: "80px 5%", background: "#2D7A5F" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 className="hero-text" style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 700, color: "#fff", marginBottom: 20, letterSpacing: "-0.03em" }}>
            Your breakthrough<br />is one session away.
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", marginBottom: 40, fontWeight: 300 }}>
            First session is free. No commitment required.
          </p>
          <button className="btn-primary" style={{ background: "#fff", color: "#2D7A5F", border: "none", borderRadius: 8, padding: "18px 40px", fontSize: 17, fontWeight: 600, cursor: "pointer", letterSpacing: "0.01em" }}>
            Book Your Free Session
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "48px 5%", background: "#111110", color: "#666" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div className="hero-text" style={{ fontSize: 20, fontWeight: 700, color: "#FAFAF7" }}>
            Bright<span style={{ color: "#2D7A5F" }}>Path</span>
          </div>
          <div style={{ display: "flex", gap: 32 }}>
            {["About", "Privacy", "Terms", "Contact"].map(l => (
              <a key={l} href="#" style={{ fontSize: 13, color: "#666", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#fff"}
                onMouseLeave={e => e.target.style.color = "#666"}>{l}</a>
            ))}
          </div>
          <div style={{ fontSize: 13 }}>© 2026 BrightPath. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}