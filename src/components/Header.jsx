import { useEffect, useState } from 'react';

const navItems = [
  { label: 'Home', id: 'hero' },
  { label: 'About', id: 'about' },
  { label: 'Experience', id: 'experience' },
  { label: 'Services', id: 'services' },
  { label: 'Projects', id: 'projects' },
  { label: 'Contact', id: 'contact' },
];

const resetHashView = () => {
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
};

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio_theme') || 'dark');

  // Apply theme class to app-shell
  useEffect(() => {
    const shell = document.querySelector('.app-shell');
    if (!shell) return;
    if (theme === 'light') {
      shell.classList.add('theme-light');
      document.body.style.background = '#f5f1eb';
      document.body.style.backgroundImage = 'none';
      document.body.style.colorScheme = 'light';
    } else {
      shell.classList.remove('theme-light');
      document.body.style.background = '';
      document.body.style.backgroundImage = '';
      document.body.style.colorScheme = '';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('portfolio_theme', next);
      return next;
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Update active section based on scroll position
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    const onResize = () => {
      if (window.innerWidth > 900) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('keydown', onEscape);
    window.addEventListener('resize', onResize);

    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', onEscape);
      window.removeEventListener('resize', onResize);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const scrollToSection = (id) => {
    if (window.location.hash.startsWith('#gallery-')) {
      resetHashView();
      window.setTimeout(() => scrollToSection(id), 40);
      return;
    }

    const element = document.getElementById(id);
    if (!element) return;

    const top = element.getBoundingClientRect().top + window.scrollY - 84;
    window.scrollTo({ top, behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__container">
        <button 
          type="button" 
          className="header__logo" 
          onClick={() => scrollToSection('hero')}
        >
          <span className="header__logo-mark">AK</span>
          <span className="header__logo-text">Ali Kerroum</span>
        </button>

        <button
          type="button"
          className={`header__menu-toggle ${menuOpen ? 'header__menu-toggle--active' : ''}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
        >
          <span className="header__menu-bar" />
          <span className="header__menu-bar" />
          <span className="header__menu-bar" />
        </button>

        <nav id="site-navigation" className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
          <div className="header__nav-content">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`header__nav-link ${activeSection === item.id ? 'header__nav-link--active' : ''}`}
                onClick={() => scrollToSection(item.id)}
              >
                <span className="header__nav-label">{item.label}</span>
                {activeSection === item.id && (
                  <span className="header__nav-indicator" />
                )}
              </button>
            ))}
          </div>
        </nav>

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          )}
        </button>

        {menuOpen && (
          <button
            type="button"
            className="header__backdrop"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </div>
    </header>
  );
}