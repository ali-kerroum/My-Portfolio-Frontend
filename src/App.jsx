import { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Services from './components/Services';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import './App.css';

const getGalleryProjectId = () => {
  const { hash } = window.location;
  if (!hash.startsWith('#gallery-')) {
    return null;
  }

  const id = Number(hash.replace('#gallery-', ''));
  return Number.isNaN(id) ? null : id;
};

function App() {
  const [galleryProjectId, setGalleryProjectId] = useState(getGalleryProjectId);

  useEffect(() => {
    const onHashChange = () => setGalleryProjectId(getGalleryProjectId());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
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
            <Hero />
            <About />
            <Experience />
            <Services />
            <Projects />
            <Contact />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
