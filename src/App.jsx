import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Services from './components/Services';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import ManageProjects from './components/admin/ManageProjects';
import ManageExperiences from './components/admin/ManageExperiences';
import ManageServices from './components/admin/ManageServices';
import ManageSkills from './components/admin/ManageSkills';
import ManageContactLinks from './components/admin/ManageContactLinks';
import ManageMessages from './components/admin/ManageMessages';
import ManageSections from './components/admin/ManageSections';
import ManageHero from './components/admin/ManageHero';
import { trackPageView, getVisibleSections } from './services/api';
import './App.css';

const getGalleryProjectId = () => {
  const { hash } = window.location;
  if (!hash.startsWith('#gallery-')) {
    return null;
  }

  const id = Number(hash.replace('#gallery-', ''));
  return Number.isNaN(id) ? null : id;
};

function Portfolio() {
  const [galleryProjectId, setGalleryProjectId] = useState(getGalleryProjectId);
  const defaultSections = ['hero', 'about', 'experience', 'services', 'projects', 'contact'];
  const [visibleSections, setVisibleSections] = useState(defaultSections);

  useEffect(() => {
    const onHashChange = () => setGalleryProjectId(getGalleryProjectId());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Don't track page views when logged in as admin
  const isAdmin = !!localStorage.getItem('admin_token');

  // Track page view on load and ensure scroll starts at top
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isAdmin) {
      trackPageView(window.location.pathname).catch(() => {});
    }
  }, []);

  // Track section views as user scrolls
  useEffect(() => {
    if (isAdmin) return;
    const tracked = new Set();
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sectionId && !tracked.has(sectionId)) {
            tracked.add(sectionId);
            trackPageView(`/#${sectionId}`).catch(() => {});
          }
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('section[id]').forEach((el) => {
      sectionObserver.observe(el);
    });

    return () => sectionObserver.disconnect();
  }, [visibleSections]);

  // Fetch visible sections (update from backend if available)
  useEffect(() => {
    getVisibleSections()
      .then((res) => setVisibleSections(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const animateOnScroll = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    };

    const observer = new IntersectionObserver(animateOnScroll, observerOptions);

    // Observe all sections and major elements (excluding hero which is already visible)
    const elementsToAnimate = document.querySelectorAll(
      '.service-item, .project-item, .experience-card, .about-main-left > .panel, .about-main-right, .contact-wrapper > *, .footer-main > *, .gallery-item'
    );

    elementsToAnimate.forEach((el) => {
      el.classList.add('animate-on-scroll');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [galleryProjectId]);

  return (
    <div className="app-shell">
      <Header />
      <a
        href="https://wa.me/212648910902"
        target="_blank"
        rel="noreferrer"
        className="whatsapp-float"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 32 32" fill="currentColor" width="28" height="28">
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.052 31.2l6.012-1.93A15.89 15.89 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.35 22.616c-.392 1.106-1.942 2.024-3.186 2.292-.852.18-1.964.324-5.71-1.228-4.796-1.986-7.882-6.85-8.12-7.168-.228-.318-1.912-2.548-1.912-4.862 0-2.312 1.21-3.45 1.64-3.922.392-.43.92-.59 1.206-.59.15 0 .3.008.428.014.392.018.588.038.846.654.322.77 1.106 2.7 1.202 2.898.098.198.19.462.06.738-.12.28-.218.454-.416.698-.198.244-.408.434-.606.7-.178.234-.378.484-.16.916.218.43.968 1.598 2.08 2.59 1.432 1.276 2.638 1.672 3.014 1.858.376.186.596.158.816-.096.228-.254.966-1.124 1.224-1.51.254-.386.512-.318.862-.19.354.126 2.236 1.054 2.618 1.246.382.192.636.29.73.448.096.158.096.916-.296 2.022z"/>
        </svg>
      </a>
      <main>
        {galleryProjectId ? (
          <Gallery projectId={galleryProjectId} />
        ) : (
          <>
            {visibleSections?.includes('hero') && <Hero />}
            {visibleSections?.includes('about') && <About />}
            {visibleSections?.includes('experience') && <Experience />}
            {visibleSections?.includes('services') && <Services />}
            {visibleSections?.includes('projects') && <Projects />}
            {visibleSections?.includes('contact') && <Contact />}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="projects" element={<ManageProjects />} />
        <Route path="experiences" element={<ManageExperiences />} />
        <Route path="services" element={<ManageServices />} />
        <Route path="skills" element={<ManageSkills />} />
        <Route path="contact-links" element={<ManageContactLinks />} />
        <Route path="messages" element={<ManageMessages />} />
        <Route path="sections" element={<ManageSections />} />
        <Route path="hero" element={<ManageHero />} />
      </Route>

      {/* Portfolio (public) */}
      <Route path="*" element={<Portfolio />} />
    </Routes>
  );
}

export default App;
