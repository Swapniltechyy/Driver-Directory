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
    </main>
  );
}
