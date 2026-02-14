import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_85wg25q';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_nykiyqm';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'wn03hVqAafszi-wxe';

const initialFormState = {
  name: '',
  email: '',
  message: '',
};

const links = [
  { 
    label: 'GitHub', 
    href: 'https://github.com/ali-kerroum',
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    )
  },
  { 
    label: 'LinkedIn', 
    href: 'https://www.linkedin.com/in/ali-kerroum-b203332ab',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  },
  // { 
  //   label: 'Email', 
  //   href: 'mailto:alikerrouom00@gmail.com',
  //   icon: (
  //     <svg viewBox="0 0 20 20" fill="currentColor">
  //       <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
  //       <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
  //     </svg>
  //   )
  // },
];

export default function Contact() {
  const [formData, setFormData] = useState(initialFormState);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (PUBLIC_KEY) {
      emailjs.init({ publicKey: PUBLIC_KEY });
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    setIsSubmitting(true);

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setStatus({ type: 'error', message: 'Email service is not configured. Please try again later.' });
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          reply_to: formData.email,
          to_name: 'Ali',
          subject: 'Portfolio contact message',
          message: formData.message,
        },
        { publicKey: PUBLIC_KEY }
      );
      console.log('EmailJS success:', result);

      setFormData(initialFormState);
      setStatus({ type: 'success', message: 'Your message was sent successfully.' });
    } catch (error) {
      console.error('EmailJS error:', error);
      const errorMsg = error?.text || error?.message || 'Unknown error';
      setStatus({ type: 'error', message: `Unable to send the message: ${errorMsg}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <div className="contact-wrapper">
          <div className="contact-info">
            <div className="section-heading">
              <p className="eyebrow">Contact</p>
              <h2>Discuss your next project</h2>
              <p className="section-subtitle">
                Share your requirements and timeline. I will get back to you quickly.
              </p>
            </div>

            <div className="contact-details">
              <div className="contact-detail-item">
                <div className="contact-detail-item__icon">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="contact-detail-item__content">
                  <h3 className="contact-detail-item__title">Location</h3>
                  <p className="contact-detail-item__text">Available for remote opportunities worldwide</p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-detail-item__icon">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                </div>
                <div className="contact-detail-item__content">
                  <h3 className="contact-detail-item__title">Email</h3>
                  <a href="mailto:alikerrouom00@gmail.com" className="contact-detail-item__link">
                    alikerrouom00@gmail.com
                  </a>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-detail-item__icon">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="contact-detail-item__content">
                  <h3 className="contact-detail-item__title">Response Time</h3>
                  <p className="contact-detail-item__text">Usually within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="contact-social">
              <h3 className="contact-social__title">Connect with me</h3>
              <div className="contact-social__links">
                {links.map((link) => (
                  <a 
                    key={link.label} 
                    href={link.href} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="contact-social-link"
                    title={link.label}
                  >
                    <span className="contact-social-link__icon">{link.icon}</span>
                    <span className="contact-social-link__label">{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form__header">
                <h3 className="contact-form__title">Send a Message</h3>
                <p className="contact-form__subtitle">Fill out the form below and I'll get back to you soon.</p>
              </div>

              <div className="contact-form__field">
                <label htmlFor="name" className="contact-form__label">
                  Name
                  <span className="contact-form__required">*</span>
                </label>
                <input 
                  id="name" 
                  name="name" 
                  type="text" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="contact-form__input"
                  placeholder="Your full name"
                  required 
                />
              </div>

              <div className="contact-form__field">
                <label htmlFor="email" className="contact-form__label">
                  Email
                  <span className="contact-form__required">*</span>
                </label>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="contact-form__input"
                  placeholder="your.email@example.com"
                  required 
                />
              </div>

              <div className="contact-form__field">
                <label htmlFor="message" className="contact-form__label">
                  Message
                  <span className="contact-form__required">*</span>
                </label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="6" 
                  value={formData.message} 
                  onChange={handleChange} 
                  className="contact-form__textarea"
                  placeholder="Tell me about your project or inquiry..."
                  required 
                />
              </div>

              <button type="submit" className="contact-form__submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <svg className="contact-form__submit-spinner" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
                      <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                    </svg>
                    Send Message
                  </>
                )}
              </button>

              {status.message && (
                <div className={`contact-form__status contact-form__status--${status.type}`}>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    {status.type === 'success' ? (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    ) : (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    )}
                  </svg>
                  {status.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
