import { useState, useEffect } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { getUser, logout } from '../../services/api';
import {
  IconDashboard, IconRocket, IconBriefcase, IconSettings,
  IconTarget, IconLink, IconMenu, IconX, IconExternalLink,
  IconUser, IconLogout, IconZap, IconInbox,
} from './Icons';
import './Admin.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('admin_theme') || 'dark');

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('admin_theme', next);
      return next;
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    getUser()
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore
    }
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  if (!user) {
    return <div className="admin-loading">Loading...</div>;
  }

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: <IconDashboard />, end: true },
    { to: '/admin/hero', label: 'Hero Section', icon: <IconZap /> },
    { to: '/admin/projects', label: 'Projects', icon: <IconRocket /> },
    { to: '/admin/experiences', label: 'Experiences', icon: <IconBriefcase /> },
    { to: '/admin/services', label: 'Services', icon: <IconSettings /> },
    { to: '/admin/skills', label: 'Skills', icon: <IconTarget /> },
    { to: '/admin/contact-links', label: 'Contact Links', icon: <IconLink /> },
    { to: '/admin/messages', label: 'Messages', icon: <IconInbox /> },
    { to: '/admin/sections', label: 'Sections', icon: <IconSettings /> },
  ];

  return (
    <div className={`admin-layout${theme === 'light' ? ' theme-light' : ''}`}>
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__header">
          <h2 className="admin-sidebar__logo">
            <span className="admin-sidebar__logo-dot">
              <IconZap />
            </span>
            Admin Panel
          </h2>
          <button
            type="button"
            className="admin-sidebar__close"
            onClick={() => setSidebarOpen(false)}
          >
            <IconX />
          </button>
        </div>

        <div className="admin-sidebar__section-label">Content</div>
        <nav className="admin-sidebar__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-sidebar__icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <span className="admin-sidebar__avatar">
              <IconUser />
            </span>
            <span>{user.name}</span>
          </div>
          <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={handleLogout}>
            <IconLogout />
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-topbar__toggle"
            onClick={() => setSidebarOpen(true)}
          >
            <IconMenu />
          </button>
          <button type="button" className="admin-theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
            )}
          </button>
          <a href="/" target="_blank" rel="noreferrer" className="admin-topbar__view-site">
            <IconExternalLink />
            View Site
          </a>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
