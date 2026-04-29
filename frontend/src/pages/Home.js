import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// const navigate = useNavigate();

// ─── Inject Google Fonts + keyframe animations ────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --cream:       #F5F0E8;
      --cream-dark:  #EDE6D6;
      --sage:        #7AAD8A;
      --sage-light:  #A8C5B0;
      --sage-dark:   #5A8A6A;
      --terracotta:  #C4846A;
      --warm-brown:  #8B6F5E;
      --charcoal:    #2C2825;
      --muted:       #9A9089;
      --white:       #FDFAF4;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--cream);
      color: var(--charcoal);
      font-family: 'DM Sans', sans-serif;
      overflow-x: hidden;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; } to { opacity: 1; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33%       { transform: translateY(-12px) rotate(1deg); }
      66%       { transform: translateY(-6px) rotate(-1deg); }
    }
    @keyframes drift {
      0%, 100% { transform: translateX(0) translateY(0); }
      50%       { transform: translateX(8px) translateY(-10px); }
    }
    @keyframes pulse-ring {
      0%   { transform: scale(1); opacity: 0.4; }
      100% { transform: scale(1.6); opacity: 0; }
    }
    @keyframes leaf-sway {
      0%, 100% { transform: rotate(-3deg); }
      50%       { transform: rotate(3deg); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes draw {
      from { stroke-dashoffset: 400; }
      to   { stroke-dashoffset: 0; }
    }

    .nav-link {
      color: var(--warm-brown);
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 500;
      letter-spacing: 0.03em;
      transition: color 0.2s;
      cursor: pointer;
    }
    .nav-link:hover { color: var(--sage-dark); }

    .btn-primary {
      background: var(--sage);
      color: #fff;
      border: none;
      padding: 13px 32px;
      border-radius: 50px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.92rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.22s, transform 0.18s, box-shadow 0.22s;
      letter-spacing: 0.02em;
    }
    .btn-primary:hover {
      background: var(--sage-dark);
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(90,138,106,0.32);
    }

    .btn-outline {
      background: transparent;
      color: var(--sage-dark);
      border: 1.5px solid var(--sage);
      padding: 12px 30px;
      border-radius: 50px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.92rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.22s;
      letter-spacing: 0.02em;
    }
    .btn-outline:hover {
      background: var(--sage);
      color: #fff;
      transform: translateY(-2px);
    }

    .feature-card {
      background: var(--white);
      border: 1px solid var(--cream-dark);
      border-radius: 20px;
      padding: 36px 30px;
      transition: transform 0.25s, box-shadow 0.25s;
      position: relative;
      overflow: hidden;
    }
    .feature-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--sage-light), var(--sage));
      opacity: 0;
      transition: opacity 0.25s;
    }
    .feature-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 50px rgba(44,40,37,0.09);
    }
    .feature-card:hover::before { opacity: 1; }

    .testimonial-card {
      background: var(--white);
      border: 1px solid var(--cream-dark);
      border-radius: 16px;
      padding: 28px 26px;
      transition: transform 0.22s;
    }
    .testimonial-card:hover { transform: translateY(-4px); }

    .stat-item {
      text-align: center;
      padding: 24px 16px;
    }

    .input-field {
      width: 100%;
      padding: 13px 18px;
      border: 1.5px solid var(--cream-dark);
      border-radius: 12px;
      background: var(--white);
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem;
      color: var(--charcoal);
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .input-field:focus {
      border-color: var(--sage);
      box-shadow: 0 0 0 3px rgba(122,173,138,0.15);
    }

    .scroll-reveal {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.65s ease, transform 0.65s ease;
    }
    .scroll-reveal.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* Floating orbs background */
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      pointer-events: none;
    }
  `}</style>
);

// ─── Decorative SVG Leaf ──────────────────────────────────────────────────
const LeafSVG = ({ size = 40, color = '#A8C5B0', style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none"
    style={{ animation: 'leaf-sway 4s ease-in-out infinite', ...style }}>
    <path d="M30 55 C30 55 5 40 5 20 C5 10 15 5 30 8 C45 5 55 10 55 20 C55 40 30 55 30 55Z"
      fill={color} opacity="0.7" />
    <path d="M30 55 L30 15" stroke={color} strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
  </svg>
);

// ─── Floating particle dots ───────────────────────────────────────────────
const FloatingDots = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    {[
      { top: '12%', left: '8%',  size: 6,  delay: '0s',   color: '#A8C5B0', dur: '6s' },
      { top: '25%', left: '88%', size: 8,  delay: '1s',   color: '#C4846A', dur: '7s' },
      { top: '65%', left: '5%',  size: 5,  delay: '2s',   color: '#7AAD8A', dur: '5s' },
      { top: '80%', left: '92%', size: 7,  delay: '0.5s', color: '#A8C5B0', dur: '8s' },
      { top: '45%', left: '93%', size: 4,  delay: '3s',   color: '#C4846A', dur: '6s' },
      { top: '10%', left: '55%', size: 5,  delay: '1.5s', color: '#7AAD8A', dur: '7s' },
    ].map((d, i) => (
      <div key={i} style={{
        position: 'absolute', top: d.top, left: d.left,
        width: d.size, height: d.size, borderRadius: '50%',
        background: d.color, opacity: 0.5,
        animation: `drift ${d.dur} ease-in-out infinite`,
        animationDelay: d.delay,
      }} />
    ))}
  </div>
);

// ─── Scroll reveal hook ───────────────────────────────────────────────────
const useScrollReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.scroll-reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
};

// ─── Navbar ───────────────────────────────────────────────────────────────
const Navbar = ({ onLogin, onSignup, scrolled,isMobile }) => {
            const navigate = useNavigate();
            return(

  <nav style={{
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: scrolled ? 'rgba(245,240,232,0.92)' : 'transparent',
    backdropFilter: scrolled ? 'blur(12px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(237,230,214,0.8)' : '1px solid transparent',
    transition: 'all 0.35s ease',
    padding: '0 5%',
  }}>
    <div style={{
      maxWidth: '1160px', margin: '0 auto',
      display: 'flex', alignItems: 'center', height: '68px', gap: '32px',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flex: 1 }}>
        <div style={{
          width: '34px', height: '34px', borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--sage-light), var(--sage))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px',
        }}>🌿</div>
        <span style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.35rem', fontWeight: '600',
          color: 'var(--charcoal)', letterSpacing: '0.01em',
        }}>Mindmingle</span>
      </div>

      {/* Links */}
    {/* Links */}
{!isMobile && (
  <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
    <span className="nav-link" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
      Features
    </span>
    <span className="nav-link" onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}>
      How it works
    </span>
    <span className="nav-link" onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })}>
      Stories
    </span>
  </div>
)}

      {/* Auth */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button className="btn-outline" style={{ padding: '9px 22px', fontSize: '0.85rem' }} onClick={()=>navigate("/login")}>
          Log in
        </button>
        <button 
    className="btn-primary" 
    style={{ padding: '9px 22px', fontSize: '0.85rem' }}
    onClick={() => navigate("/register")}
  >
    Register
  </button>
      </div>
    </div>
  </nav>

);
};
// ─── Hero ─────────────────────────────────────────────────────────────────
const Hero = ({ onSignup,isMobile }) => (
  <section 
  style={
    {
    gridTemplateColumns:isMobile?'1fr':'1fr 1fr',
    gap: isMobile?'40px':'60px',
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    position: 'relative', overflow: isMobile? 'visible':'hidden',
    background: 'linear-gradient(160deg, #F5F0E8 0%, #EDE6D6 40%, #E8F0EC 100%)',
    padding: '100px 5% 60px',
  }
  }>
    {/* Background orbs */}
    <div className="orb" style={{ width: '500px', height: '500px', top: '-120px', right: '-100px', background: 'rgba(168,197,176,0.25)' }} />
    <div className="orb" style={{ width: '350px', height: '350px', bottom: '-80px', left: '-80px', background: 'rgba(196,132,106,0.15)' }} />
    <div className="orb" style={{ width: '260px', height: '260px', top: '30%', left: '38%', background: 'rgba(122,173,138,0.12)' }} />

    <FloatingDots />

    {/* Decorative leaves */}
    <LeafSVG size={55} color="#A8C5B0" style={{ position: 'absolute', top: '18%', right: '12%', animation: 'leaf-sway 5s ease-in-out infinite', animationDelay: '0.5s' }} />
    <LeafSVG size={38} color="#C4846A" style={{ position: 'absolute', bottom: '22%', right: '22%', opacity: 0.6, animation: 'leaf-sway 6s ease-in-out infinite', animationDelay: '1s' }} />
    <LeafSVG size={30} color="#7AAD8A" style={{ position: 'absolute', top: '60%', left: '6%', opacity: 0.5, animation: 'leaf-sway 4.5s ease-in-out infinite' }} />

    <div style={{ maxWidth: '1160px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>

      {/* Left text */}
      <div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(168,197,176,0.25)', border: '1px solid rgba(122,173,138,0.3)',
          borderRadius: '50px', padding: '6px 16px', marginBottom: '28px',
          animation: 'fadeIn 0.8s ease both',
        }}>
          <span style={{ fontSize: '0.75rem' }}>✨</span>
          <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--sage-dark)', letterSpacing: '0.04em' }}>
            YOUR MINDFUL SANCTUARY
          </span>
        </div>

        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
          fontWeight: '300',
          lineHeight: '1.12',
          color: 'var(--charcoal)',
          marginBottom: '24px',
          animation: 'fadeUp 0.9s ease 0.1s both',
        }}>
          Find your calm,<br />
          <em style={{ color: 'var(--sage-dark)', fontStyle: 'italic' }}>every single day</em>
        </h1>

        <p style={{
          fontSize: '1.08rem',
          lineHeight: '1.75',
          color: 'var(--muted)',
          maxWidth: '480px',
          marginBottom: '36px',
          fontWeight: '300',
          animation: 'fadeUp 0.9s ease 0.25s both',
        }}>
          Mindmingle guide you toward lasting peace of mind through personalized
          mindfulness sessions, gentle reminders, mood tracking, and
          a warm community — all in one beautiful space.
        </p>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', animation: 'fadeUp 0.9s ease 0.38s both' }}>
          <button className="btn-primary" style={{ fontSize: '1rem', padding: '15px 36px' }} onClick={onSignup}>
            Begin your journey →
          </button>
          <button className="btn-outline" style={{ fontSize: '1rem', padding: '15px 28px' }}
            onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}>
            See how it works
          </button>
        </div>

        {/* Social proof */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '14px', marginTop: '40px',
          animation: 'fadeUp 0.9s ease 0.5s both',
        }}>
          <div style={{ display: 'flex' }}>
            {['#A8C5B0','#7AAD8A','#5A8A6A','#C4846A','#8B6F5E'].map((c, i) => (
              <div key={i} style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: c, border: '2px solid var(--cream)',
                marginLeft: i === 0 ? 0 : '-8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', color: '#fff', fontWeight: '600',
              }}>
                {['A','B','C','D','E'][i]}
              </div>
            ))}
          </div>
          <div>
            <div style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
              {[1,2,3,4,5].map(i => <span key={i} style={{ color: '#D4A843', fontSize: '13px' }}>★</span>)}
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
              Loved by <strong style={{ color: 'var(--charcoal)' }}>12,000+</strong> mindful souls
            </span>
          </div>
        </div>
      </div>

      {/* Right — floating UI card preview */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', animation: 'fadeIn 1s ease 0.3s both',width:'100%',marginTop:isMobile?'40px':'0' }}>

        {/* Pulse ring */}
        {/* <div style={{
          position: 'relative',display:'flex',justifyContent:'center',marginTop:isMobile?'40px':'0',
          transform: 'translate(-50%,-50%)',
          width: '320px', height: '320px', borderRadius: '50%',
          border: '1px solid rgba(122,173,138,0.3)',
          animation: 'fadeIn 1s ease 0.3s both',
        }} /> */}

        {/* Main dashboard card */}
        <div style={{
          background: 'var(--white)', borderRadius: '24px',
          boxShadow: '0 24px 60px rgba(44,40,37,0.14)',
          padding: '28px', width: isMobile?'260px':'320px',
          animation: 'float 7s ease-in-out infinite',
          position: 'relative', zIndex: 2,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <p style={{ }}>Good morning 🌅</p>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: '600' }}>How are you feeling?</p>
            </div>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #A8C5B0, #7AAD8A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
            }}>🧘</div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {[['😌','Calm'],['😊','Happy'],['😔','Low'],['😤','Stressed']].map(([e, l], i) => (
              <div key={i} style={{
                flex: 1, textAlign: 'center', padding: '10px 4px',
                borderRadius: '12px', cursor: 'pointer',
                background: i === 0 ? 'rgba(122,173,138,0.15)' : 'var(--cream)',
                border: i === 0 ? '1.5px solid var(--sage)' : '1px solid transparent',
                transition: 'all 0.2s',
              }}>
                <div style={{ fontSize: '18px' }}>{e}</div>
                <div style={{ fontSize: '0.62rem', color: i === 0 ? 'var(--sage-dark)' : 'var(--muted)', marginTop: '3px', fontWeight: i === 0 ? '600' : '400' }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--cream)', borderRadius: '12px', padding: '14px 16px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--warm-brown)', fontWeight: '500' }}>Today's practice</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--sage-dark)', fontWeight: '700' }}>68%</span>
            </div>
            <div style={{ height: '6px', background: 'var(--cream-dark)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '68%', borderRadius: '3px', background: 'linear-gradient(90deg, var(--sage-light), var(--sage))' }} />
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'rgba(196,132,106,0.1)', borderRadius: '12px', padding: '12px 14px',
          }}>
            <span style={{ fontSize: '20px' }}>🔔</span>
            <div>
              <p style={{ fontSize: '0.72rem', color: 'var(--terracotta)', fontWeight: '600' }}>NEXT REMINDER</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--charcoal)', fontWeight: '500' }}>Evening wind-down at 6:00 PM</p>
            </div>
          </div>
        </div>

        {/* Floating mini cards */}
        <div style={{
          position: 'absolute', top: '6%', right: isMobile? '10px':'-14%',
          background: 'var(--white)', borderRadius: '16px',
          padding: '14px 16px', boxShadow: '0 8px 28px rgba(44,40,37,0.12)',
          animation: 'drift 6s ease-in-out infinite', animationDelay: '1s',
          zIndex: 3,
        }}>
          {/* <p style={{ fontSize: '0.68rem', color: 'var(--muted)', marginBottom: '4px' }}>Streak 🔥</p>
          <p style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--charcoal)', fontFamily: 'Cormorant Garamond, serif' }}>14 days</p> */}
        </div>

        <div style={{
          position: 'absolute', bottom: '10%', left:isMobile?'10px': '-16%',
          background: 'var(--white)', borderRadius: '16px',
          padding: '14px 16px', boxShadow: '0 8px 28px rgba(44,40,37,0.12)',
          animation: 'drift 7s ease-in-out infinite', animationDelay: '2s',
          zIndex: 3,
        }}>
          <p style={{ fontSize: '0.68rem', color: 'var(--muted)', marginBottom: '4px' }}>Sessions this week</p>
          <p style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--sage-dark)', fontFamily: 'Cormorant Garamond, serif' }}>5 / 7</p>
        </div>
      </div>
    </div>
  </section>
);

// ─── Stats bar ────────────────────────────────────────────────────────────
const Stats = ({isMobile}) => (
  <section style={{ background: 'var(--white)', borderTop: '1px solid var(--cream-dark)', borderBottom: '1px solid var(--cream-dark)', padding: '0 5%' }}>
    <div style={{ maxWidth: '1160px', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr':'repeat(4,1fr' }}>
      {[
        ['12K+', 'Active users'],
        ['98%',  'Feel more at peace'],
        ['4.9★', 'Average rating'],
        ['30+',  'Guided practices'],
      ].map(([num, lbl], i) => (
        <div key={i} className="stat-item scroll-reveal" style={{
          borderRight: i < 3 ? '1px solid var(--cream-dark)' : 'none',
          transitionDelay: `${i * 0.1}s`,
        }}>
          <div style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '2.4rem', fontWeight: '600',
            color: 'var(--sage-dark)', lineHeight: 1,
            marginBottom: '6px',
          }}>{num}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--muted)', fontWeight: '400' }}>{lbl}</div>
        </div>
      ))}
    </div>
  </section>
);

// ─── Features ─────────────────────────────────────────────────────────────
const Features = ({isMobile}) => {
  const features = [
    {
      icon: '🧘',
      title: 'Guided Mindfulness',
      desc: 'Breathe, meditate, and ground yourself with beautifully designed sessions tailored to your mood and energy level.',
      color: '#A8C5B0',
    },
    {
      icon: '🔔',
      title: 'Gentle Reminders',
      desc: 'Never miss a moment of self-care. Set personalized reminders with calming sounds at exactly the right time.',
      color: '#C4846A',
    },
    {
      icon: '📊',
      title: 'Mood Tracking',
      desc: 'Understand your emotional patterns over time with serene, visual charts that reveal your wellness journey.',
      color: '#7AAD8A',
    },
    {
      icon: '🌿',
      title: 'Daily Reflections',
      desc: 'A gentle journal prompt each morning and evening to help you stay grounded and grow through awareness.',
      color: '#D4A843',
    },
    {
      icon: '🤝',
      title: 'Community Circles',
      desc: 'Connect with fellow mindfulness seekers in warm, moderated circles. You\'re never alone on this journey.',
      color: '#9B8EC4',
    },
    {
      icon: '🌙',
      title: 'Sleep Rituals',
      desc: 'Wind down beautifully with curated sleep sounds, body scans, and nighttime routines built for deep rest.',
      color: '#5BBCB0',
    },
  ];

  return (
    <section id="features" style={{ padding: '100px 5%', background: 'var(--cream)' }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }} className="scroll-reveal">
          <span style={{
            display: 'inline-block', background: 'rgba(122,173,138,0.15)',
            color: 'var(--sage-dark)', borderRadius: '50px', padding: '5px 16px',
            fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: '16px',
          }}>Everything you need</span>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '300',
            color: 'var(--charcoal)', lineHeight: 1.2,
          }}>
            Tools for a <em style={{ color: 'var(--sage-dark)' }}>calmer, richer</em> life
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns:isMobile? '1fr':'repeat(3, 1fr)'}}>
          {features.map((f, i) => (
            <div key={i} className="feature-card scroll-reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '16px',
                background: `${f.color}22`, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', marginBottom: '20px',
              }}>{f.icon}</div>
              <h3 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.3rem', fontWeight: '600',
                color: 'var(--charcoal)', marginBottom: '10px',
              }}>{f.title}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── How it works ─────────────────────────────────────────────────────────
const HowItWorks = ({ onSignup,isMobile }) => (
  <section id="how" style={{ padding: '100px 5%', background: 'linear-gradient(160deg, #EDE6D6 0%, #E8F0EC 100%)' }}>
    <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '72px' }} className="scroll-reveal">
        <span style={{
          display: 'inline-block', background: 'rgba(196,132,106,0.15)',
          color: 'var(--terracotta)', borderRadius: '50px', padding: '5px 16px',
          fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.08em',
          textTransform: 'uppercase', marginBottom: '16px',
        }}>Simple to start</span>
        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '300',
          color: 'var(--charcoal)',
        }}>
          Peace is just <em style={{ color: 'var(--terracotta)' }}>three steps</em> away
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile?'1fr': 'repeat(3, 1fr)'}}>
        {/* Connector line */}
        {/* <div style={{
          position: 'absolute', top: '36px', left: '17%', right: '17%', height: '1px',
          background: 'linear-gradient(90deg, var(--sage-light), var(--terracotta))',
          opacity: 0.4, zIndex: 0,
        }} /> */}

        {[
          { n: '01', icon: '✍️', title: 'Create your account', desc: 'Sign up in under a minute. Tell us a little about yourself and your wellness goals.' },
          { n: '02', icon: '🎯', title: 'Set your intentions', desc: 'Choose your focus areas — stress relief, better sleep, focus, or emotional balance.' },
          { n: '03', icon: '🌱', title: 'Grow every day', desc: 'Follow your personalised plan, track progress, and watch your wellbeing blossom.' },
        ].map((s, i) => (
          <div key={i} className="scroll-reveal" style={{ textAlign: 'center', position: 'relative', zIndex: 1, transitionDelay: `${i * 0.15}s` }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'var(--white)', border: '1px solid var(--cream-dark)',
              boxShadow: '0 8px 24px rgba(44,40,37,0.09)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px', fontSize: '26px',
              position: 'relative',
            }}>
              {s.icon}
              <span style={{
                position: 'absolute', top: '-8px', right: '-8px',
                width: '24px', height: '24px', borderRadius: '50%',
                background: 'var(--sage)', color: '#fff',
                fontSize: '0.65rem', fontWeight: '700',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{s.n}</span>
            </div>
            <h3 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.35rem', fontWeight: '600',
              color: 'var(--charcoal)', marginBottom: '10px',
            }}>{s.title}</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '260px', margin: '0 auto' }}>{s.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '56px' }} className="scroll-reveal">
        <button className="btn-primary" style={{ fontSize: '1rem', padding: '15px 44px' }} onClick={onSignup}>
          Start for free — no card needed
        </button>
      </div>
    </div>
  </section>
);

// ─── Testimonials ─────────────────────────────────────────────────────────
const Testimonials = (isMobile) => {
  const testimonials = [
    { name: 'Priya M.', role: 'Yoga instructor', color: '#A8C5B0', text: 'Mindmingle changed my mornings completely. The gentle reminders feel like a warm nudge from a friend, not an alarm.', stars: 5 },
    { name: 'James K.', role: 'Software engineer', color: '#7AAD8A', text: 'I was skeptical at first, but the mood tracking opened my eyes to patterns I never noticed. My anxiety is down measurably.', stars: 5 },
    { name: 'Sofia R.', role: 'Student', color: '#C4846A', text: 'The sleep rituals section is pure magic. I fall asleep faster and wake up actually rested. Can\'t live without it now.', stars: 5 },
    { name: 'Arjun T.', role: 'Entrepreneur', color: '#D4A843', text: 'As someone with a chaotic schedule, the 5-minute mindfulness sessions are exactly what I needed. Fits perfectly into my day.', stars: 5 },
    { name: 'Mei L.', role: 'Healthcare worker', color: '#9B8EC4', text: 'The community circles gave me a safe space to talk about burnout. I found so much support from people who truly get it.', stars: 5 },
    { name: 'David O.', role: 'Teacher', color: '#5BBCB0', text: 'I\'ve tried many wellness apps but Mindmingle feels different — it\'s human, warm, and actually understands how I\'m feeling.', stars: 5 },
  ];

  return (
    <section id="testimonials" style={{ padding: '100px 5%', background: 'var(--cream)' }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }} className="scroll-reveal">
          <span style={{
            display: 'inline-block', background: 'rgba(168,197,176,0.2)',
            color: 'var(--sage-dark)', borderRadius: '50px', padding: '5px 16px',
            fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: '16px',
          }}>Real stories</span>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '300', color: 'var(--charcoal)',
          }}>
            Lives <em style={{ color: 'var(--sage-dark)' }}>gently transformed</em>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns:isMobile?'1fr': 'repeat(3, 1fr)' }}>
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card scroll-reveal" style={{ transitionDelay: `${i * 0.07}s` }}>
              <div style={{ display: 'flex', gap: '2px', marginBottom: '14px' }}>
                {Array(t.stars).fill(0).map((_, j) => <span key={j} style={{ color: '#D4A843', fontSize: '13px' }}>★</span>)}
              </div>
              <p style={{
                fontSize: '0.9rem', color: 'var(--charcoal)', lineHeight: 1.72,
                fontStyle: 'italic', marginBottom: '18px',
                fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem',
              }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: t.color, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: '700', fontSize: '0.85rem',
                }}>{t.name[0]}</div>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--charcoal)' }}>{t.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── CTA Banner ───────────────────────────────────────────────────────────
const CTABanner = ({ onSignup }) => (
  <section style={{
    padding: '90px 5%',
    background: 'linear-gradient(135deg, #5A8A6A 0%, #7AAD8A 50%, #A8C5B0 100%)',
    position: 'relative', overflow: 'hidden',
  }}>
    <div className="orb" style={{ width: '400px', height: '400px', top: '-120px', right: '-80px', background: 'rgba(255,255,255,0.08)' }} />
    <div className="orb" style={{ width: '300px', height: '300px', bottom: '-80px', left: '-60px', background: 'rgba(255,255,255,0.06)' }} />

    <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🌿</div>
      <h2 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: '300',
        color: '#fff', lineHeight: 1.2, marginBottom: '18px',
      }}>
        Your journey toward <br /><em>inner peace</em> starts today
      </h2>
      <p style={{
        fontSize: '1rem', color: 'rgba(255,255,255,0.82)',
        lineHeight: 1.7, marginBottom: '36px', fontWeight: '300',
      }}>
        Join thousands of people who have already transformed their wellbeing.<br />
        Free forever for core features.
      </p>
      <button
        className="btn-primary"
        style={{ background: '#fff', color: 'var(--sage-dark)', fontSize: '1rem', padding: '15px 44px', boxShadow: '0 8px 28px rgba(0,0,0,0.15)' }}
        onClick={onSignup}
      >
        Create free account →
      </button>
      <p style={{ marginTop: '14px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)' }}>
        No credit card · Cancel anytime · Free forever
      </p>
    </div>
  </section>
);

// ─── Footer ───────────────────────────────────────────────────────────────
const Footer = ({ onLogin, onSignup,isMobile }) => (
  <footer style={{ background: 'var(--charcoal)', color: 'rgba(255,255,255,0.6)', padding: '56px 5% 32px' }}>
    <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gridTemplateColumns: isMobile?'1fr': '2fr 1fr 1fr 1fr',justifyContent:'center',textAlign:'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '14px' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #A8C5B0, #7AAD8A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
            }}>🌿</div>
            <span style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem',
              fontWeight: '600', color: '#fff',
            }}>Mindmingle</span>
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.7, maxWidth: '240px' }}>
            Your daily companion for mindfulness, calm, and inner clarity.
          </p>
        </div>
        {[
        ].map((col, i) => (
          <div key={i}>
            <p style={{ color: '#fff', fontWeight: '600', fontSize: '0.85rem', marginBottom: '14px', letterSpacing: '0.04em' }}>{col.title}</p>
            {col.links.map(l => (
              <p key={l} style={{ marginBottom: '8px', cursor: 'pointer', fontSize: '0.83rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#A8C5B0'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
              >{l}</p>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <p style={{ fontSize: '0.78rem' }}>© 2025 Mindmingle. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ cursor: 'pointer', fontSize: '0.78rem' }} onClick={onLogin}>Log in</span>
          <span style={{ cursor: 'pointer', fontSize: '0.78rem', color: '#A8C5B0', fontWeight: '600' }} onClick={onSignup}>Sign up free</span>
        </div>
      </div>
    </div>
  </footer>
);

// ─── Main HomePage Component ──────────────────────────────────────────────
const HomePage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useScrollReveal();


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goLogin  = () => navigate('/login');
  const goSignup = () => navigate('/register');

  return (
    <>
      <GlobalStyles />
      <Navbar onLogin={goLogin} onSignup={goSignup} scrolled={scrolled} isMobile={isMobile} />
    <Hero onSignup={goSignup} isMobile={isMobile} />
<Stats isMobile={isMobile} />
<Features isMobile={isMobile} />
<HowItWorks onSignup={goSignup} isMobile={isMobile} />
<Testimonials isMobile={isMobile} />
<Footer onLogin={goLogin} onSignup={goSignup} isMobile={isMobile} />
    </>
  );
};

export default HomePage;

