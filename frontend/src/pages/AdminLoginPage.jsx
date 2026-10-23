import React, { useState } from 'react';

const ADMIN_CREDENTIALS = {
  username: 'admin@driverhub.com',
  password: 'Admin@123'
};

export default function AdminLoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    if (username.trim() === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      try {
        const response = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        if (response.ok) {
          const result = await response.json();
          localStorage.setItem('driver-directory-admin-token', result.token);
        }
      } catch {
        // Local demo mode remains available when the backend is offline.
      }
      localStorage.setItem('driver-directory-admin-auth', 'true');
      onLogin();
      return;
    }
    setError('That admin ID or password is not correct.');
  };

  return (
    <main className="login-page admin-login-page">
      <section className="login-panel admin-login-panel" aria-labelledby="admin-login-title">
        <div className="login-brand-mark admin-brand-mark"><i className="fa-solid fa-shield-halved"></i></div>
        <p className="login-eyebrow">Restricted workspace</p>
        <h1 id="admin-login-title">Admin console</h1>
        <p className="login-subtitle">Sign in with your administrator credentials to manage directory data.</p>

        <form className="login-form" onSubmit={submit}>
          <label htmlFor="admin-username">Admin ID</label>
          <div className="login-input-wrap">
            <i className="fa-solid fa-user-shield"></i>
            <input id="admin-username" value={username} onChange={event => setUsername(event.target.value)} placeholder="Enter admin ID" autoComplete="username" required />
          </div>
          <label htmlFor="admin-password">Password</label>
          <div className="login-input-wrap">
            <i className="fa-solid fa-key"></i>
            <input id="admin-password" type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter admin password" autoComplete="current-password" required />
          </div>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" className="login-submit admin-login-submit"><span>Enter admin console</span><i className="fa-solid fa-arrow-right"></i></button>
        </form>

        <div className="demo-credentials">
          <span className="demo-label">Demo admin access</span>
          <code>{ADMIN_CREDENTIALS.username}</code>
          <code>{ADMIN_CREDENTIALS.password}</code>
        </div>
        <a className="back-to-directory" href="/"><i className="fa-solid fa-arrow-left"></i> Back to directory login</a>
      </section>
    </main>
  );
}
