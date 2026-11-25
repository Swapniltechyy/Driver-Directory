import React, { useState } from 'react';

const DEMO_CREDENTIALS = {
  username: 'user@driverhub.com',
  password: 'Driver@123'
};

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username.trim() === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
      localStorage.setItem('driver-directory-auth', 'true');
      onLogin();
      return;
    }
    setError('Invalid login details. Please use the demo credentials below.');
  };

  return (
    <main className="login-page">
      <div className="login-hero-side">
        <div className="login-hero-content">
          <div className="login-hero-badge">
            <i className="fa-solid fa-route"></i>
            <span>Travel &amp; Tourism</span>
          </div>
          <h2 className="login-hero-title">Driver Directory</h2>
          <p className="login-hero-tagline">
            Your verified transport network, all in one place.
          </p>

          <div className="login-hero-features">
            <div className="login-hero-feature-item">
              <i className="fa-solid fa-circle-check"></i>
              <span>Verified local drivers, owners and fleet vendors</span>
            </div>
            <div className="login-hero-feature-item">
              <i className="fa-solid fa-circle-check"></i>
              <span>Direct WhatsApp &amp; phone contacts with one click</span>
            </div>
            <div className="login-hero-feature-item">
              <i className="fa-solid fa-circle-check"></i>
              <span>Real-time ratings, vehicle categories &amp; stand locations</span>
            </div>
          </div>
        </div>

        <div className="login-hero-art" aria-hidden="true">
          <svg viewBox="0 0 700 240" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">
            <ellipse cx="460" cy="190" rx="220" ry="80" fill="rgba(255,255,255,0.08)"/>
            <path d="M40 240 L160 110 L280 240 Z" fill="#93a9ba" opacity="0.5"/>
            <path d="M180 240 L340 70 L480 240 Z" fill="#b0c5d4" opacity="0.6"/>
            <path d="M260 240 L440 30 L550 140 L680 240 Z" fill="#CBD5E1" opacity="0.85"/>
            <path d="M440 30 L470 70 L495 56 L550 140 L440 30 Z" fill="#FFFFFF"/>
            <path d="M480 240 L570 50 L690 240 Z" fill="#E2E8F0" opacity="0.9"/>
            <path d="M570 50 L594 82 L612 72 L690 240 L570 50 Z" fill="#FFFFFF"/>
            <path d="M80 240 L90 205 L100 240 Z" fill="#0F766E" opacity="0.75"/>
            <path d="M100 240 L112 195 L124 240 Z" fill="#0F766E" opacity="0.85"/>
            <path d="M220 240 L232 200 L244 240 Z" fill="#0F766E" opacity="0.8"/>
            <path d="M244 240 L258 190 L272 240 Z" fill="#0F766E" opacity="0.9"/>
            <path d="M620 240 L632 202 L644 240 Z" fill="#0F766E" opacity="0.85"/>
            <path d="M644 240 L658 188 L672 240 Z" fill="#0F766E" opacity="0.9"/>
            <path d="M0 240 C180 240, 260 195, 380 150 C480 115, 500 75, 520 50" stroke="#94A3B8" strokeWidth="40" strokeLinecap="round" fill="none"/>
            <path d="M0 240 C180 240, 260 195, 380 150 C480 115, 500 75, 520 50" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="12 12" strokeLinecap="round" fill="none"/>
            <g transform="translate(520, 36)">
              <circle cx="0" cy="0" r="18" fill="#0F172A"/>
              <circle cx="0" cy="0" r="7" fill="#FFFFFF"/>
            </g>
          </svg>
        </div>
      </div>

      <div className="login-form-side">
        <section className="login-panel" aria-labelledby="login-title">
          <div className="login-brand-mark"><i className="fa-solid fa-route"></i></div>
          <p className="login-eyebrow">Travel &amp; Tourism</p>
          <h1 id="login-title">Driver Directory</h1>
          <p className="login-subtitle">Your verified transport network, all in one place.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Email or username</label>
            <div className="login-input-wrap">
              <i className="fa-solid fa-user"></i>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                required
              />
            </div>

            <label htmlFor="password">Password</label>
            <div className="login-input-wrap">
              <i className="fa-solid fa-lock"></i>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            {error && <p className="login-error" role="alert">{error}</p>}

            <button type="submit" className="login-submit">
              <span>Sign in</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </form>

          <div className="demo-credentials">
            <span className="demo-label">Demo access</span>
            <code>{DEMO_CREDENTIALS.username}</code>
            <code>{DEMO_CREDENTIALS.password}</code>
          </div>
        </section>
      </div>
    </main>
  );
}
