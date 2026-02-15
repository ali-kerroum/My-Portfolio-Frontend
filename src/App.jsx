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

  // Track page view on load and ensure scroll starts at top
  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(window.location.pathname).catch(() => {});
  }, []);

  // Track section views as user scrolls
  useEffect(() => {
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
