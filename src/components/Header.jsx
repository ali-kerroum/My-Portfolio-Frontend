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