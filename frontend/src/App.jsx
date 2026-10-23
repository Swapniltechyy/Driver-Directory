import React from 'react';
import DriverDirectoryPage from './pages/DriverDirectoryPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(
    () => localStorage.getItem('driver-directory-auth') === 'true'
  );
  const [isAdminAuthenticated, setIsAdminAuthenticated] = React.useState(
    () => localStorage.getItem('driver-directory-admin-auth') === 'true'
  );
  const isAdminRoute = window.location.pathname.replace(/\/$/, '') === '/admin';

  if (isAdminRoute && !isAdminAuthenticated) {
    return <AdminLoginPage onLogin={() => setIsAdminAuthenticated(true)} />;
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  if (isAdminRoute) {
    return <AdminPage onLogout={() => {
      localStorage.removeItem('driver-directory-admin-auth');
      localStorage.removeItem('driver-directory-admin-token');
      setIsAdminAuthenticated(false);
    }} />;
  }

  return (
    <DriverDirectoryPage onLogout={() => {
      localStorage.removeItem('driver-directory-auth');
      setIsAuthenticated(false);
    }} />
  );
}
