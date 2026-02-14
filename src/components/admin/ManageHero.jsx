import { useState, useEffect } from 'react';
import { getHeroContent, updateHeroContent, uploadHeroImage } from '../../services/api';
import { IconPlus, IconTrash } from './Icons';

const iconOptions = [
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'dribbble', label: 'Dribbble' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'email', label: 'Email' },
  { value: 'website', label: 'Website' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'stackoverflow', label: 'Stack Overflow' },
  { value: 'medium', label: 'Medium' },
  { value: 'behance', label: 'Behance' },
  { value: 'kaggle', label: 'Kaggle' },
];

const defaultForm = {
  eyebrow: 'Data Science Student · Full-Stack Developer',
  title: 'Professional digital solutions',
  subtitle: 'From analysis to deployable applications.',
  description:
    'I am a Bachelor student in Data Science & Analytics with strong full-stack engineering experience. I design and build maintainable products that turn data into measurable outcomes.',
  highlights: [
    'Machine Learning & Data Analytics',
    'Database Design & SQL Optimization',
    'Full-Stack Development with React and Laravel',
  ],
  cta_primary_label: 'Review Projects',
  cta_primary_section: 'projects',
  cta_secondary_label: 'Contact',
  cta_secondary_section: 'contact',
  links: [
    { label: 'GitHub', href: 'https://github.com/ali-kerroum', icon: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ali-kerroum-b203332ab', icon: 'linkedin' },
  ],
  profile_image: '/images/profile_pic.jpg',
  image_position_x: 50,
  image_position_y: 54,
  image_zoom: 100,
  name: 'Ali Kerroum',
  bio: 'Focused on reliable engineering, data-driven thinking, and practical business value.',
  status_text: 'Open to internship opportunities',
  role_text: 'Seeking Data Science / Big Data internship positions',
  metrics: [
    { value: 'Applied', label: 'Data & Web Projects' },
    { value: '3+', label: 'Years in Tech & Development' },
    { value: '2', label: 'Core tracks: Data and Web' },
  ],
};

export default function ManageHero() {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getHeroContent()
      .then((res) => {
        if (res.data && typeof res.data === 'object' && Object.keys(res.data).length > 0) {
          setForm((prev) => ({
            ...prev,
            ...res.data,
            highlights: res.data.highlights?.length ? res.data.highlights : defaultForm.highlights,
            links: res.data.links?.length ? res.data.links : defaultForm.links,
            metrics: res.data.metrics?.length ? res.data.metrics : defaultForm.metrics,
          }));
        }
      })
      .catch(() => setError('Failed to load hero content'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  /* ---- Dynamic array helpers ---- */
  const addHighlight = () => {
    setForm((prev) => ({ ...prev, highlights: [...prev.highlights, ''] }));
  };
  const removeHighlight = (idx) => {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== idx),
    }));
  };
  const updateHighlight = (idx, val) => {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.map((h, i) => (i === idx ? val : h)),
    }));
    setSaved(false);
  };

  const addLink = () => {
    setForm((prev) => ({ ...prev, links: [...prev.links, { label: '', href: '', icon: 'website' }] }));
  };
  const removeLink = (idx) => {
    setForm((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== idx),
    }));
  };
  const updateLink = (idx, field, val) => {
    setForm((prev) => ({
      ...prev,
      links: prev.links.map((l, i) => (i === idx ? { ...l, [field]: val } : l)),
    }));
    setSaved(false);
  };

  const addMetric = () => {
    setForm((prev) => ({ ...prev, metrics: [...prev.metrics, { value: '', label: '' }] }));
  };
  const removeMetric = (idx) => {
    setForm((prev) => ({
      ...prev,
      metrics: prev.metrics.filter((_, i) => i !== idx),
    }));
  };
  const updateMetric = (idx, field, val) => {
    setForm((prev) => ({
      ...prev,
      metrics: prev.metrics.map((m, i) => (i === idx ? { ...m, [field]: val } : m)),
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      // Filter out empty entries
      const payload = {
        ...form,
        highlights: form.highlights.filter((h) => h.trim()),
        links: form.links.filter((l) => l.label.trim() || l.href.trim()),
        metrics: form.metrics.filter((m) => m.value.trim() || m.label.trim()),
      };
      await updateHeroContent(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save hero content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Hero Section</h1>
          <p className="admin-page-subtitle">Edit the main hero area of your portfolio</p>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn--primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}
      {saved && <div className="admin-alert admin-alert--success">Hero content saved!</div>}

      <div className="manage-hero-grid">
        {/* ---- Identity ---- */}
        <section className="manage-hero-section">
          <h3 className="manage-hero-section__title">Identity</h3>

          <div className="admin-field">
            <label>Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          <div className="admin-field">
            <label>Eyebrow Text</label>
            <input
              type="text"
              value={form.eyebrow}
              onChange={(e) => handleChange('eyebrow', e.target.value)}
              placeholder="e.g. Data Science Student · Full-Stack Developer"
            />
          </div>

          <div className="admin-field">
            <label>Profile Image</label>
            <div className="manage-hero-image-upload">
              {form.profile_image && (
                <div className="manage-hero-image-preview">
                  <img src={form.profile_image.startsWith('http') || form.profile_image.startsWith('/') ? form.profile_image : `/${form.profile_image}`} alt="Profile preview" />
                </div>
              )}
              <div className="manage-hero-image-actions">
                <label className="admin-btn admin-btn--sm admin-btn--ghost manage-hero-upload-btn">
                  <IconPlus /> Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const res = await uploadHeroImage(file);
                        handleChange('profile_image', res.data.url);
                      } catch {
                        setError('Failed to upload image');
                      }
                    }}
                  />
                </label>
                <input
                  type="text"
                  value={form.profile_image}
                  onChange={(e) => handleChange('profile_image', e.target.value)}
                  placeholder="/images/profile_pic.jpg"
                  className="manage-hero-image-url"
                />
              </div>
            </div>
          </div>

          <div className="admin-field">
            <label>Image Position</label>
            <div className="manage-hero-position-controls">
              <div className="manage-hero-position-preview">
                {form.profile_image && (
                  <img
                    src={form.profile_image.startsWith('http') || form.profile_image.startsWith('/') ? form.profile_image : `/${form.profile_image}`}
                    alt="Position preview"
                    style={{
                      objectPosition: `${form.image_position_x ?? 50}% ${form.image_position_y ?? 54}%`,
                      transform: `scale(${(form.image_zoom ?? 100) / 100})`,
                    }}
                  />
                )}
              </div>
              <div className="manage-hero-position-sliders">
                <div className="manage-hero-slider-row">
                  <span className="manage-hero-slider-label">Horizontal</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.image_position_x ?? 50}
                    onChange={(e) => handleChange('image_position_x', Number(e.target.value))}
                    className="manage-hero-slider"
                  />
                  <span className="manage-hero-slider-value">{form.image_position_x ?? 50}%</span>
                </div>
                <div className="manage-hero-slider-row">
                  <span className="manage-hero-slider-label">Vertical</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.image_position_y ?? 54}
                    onChange={(e) => handleChange('image_position_y', Number(e.target.value))}
                    className="manage-hero-slider"
                  />
                  <span className="manage-hero-slider-value">{form.image_position_y ?? 54}%</span>
                </div>
                <div className="manage-hero-slider-row">
                  <span className="manage-hero-slider-label">Zoom</span>
                  <input
                    type="range"
                    min="100"
                    max="200"
                    value={form.image_zoom ?? 100}
                    onChange={(e) => handleChange('image_zoom', Number(e.target.value))}
                    className="manage-hero-slider"
                  />
                  <span className="manage-hero-slider-value">{form.image_zoom ?? 100}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-field">
            <label>Bio</label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
            />
          </div>

          <div className="admin-field">
            <label>Status Text</label>
            <input
              type="text"
              value={form.status_text}
              onChange={(e) => handleChange('status_text', e.target.value)}
              placeholder="Open to internship opportunities"
            />
          </div>

          <div className="admin-field">
            <label>Role Text</label>
            <input
              type="text"
              value={form.role_text}
              onChange={(e) => handleChange('role_text', e.target.value)}
              placeholder="Seeking Data Science / Big Data internship positions"
            />
          </div>
        </section>

        {/* ---- Headline ---- */}
        <section className="manage-hero-section">
          <h3 className="manage-hero-section__title">Headline</h3>

          <div className="admin-field">
            <label>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>

          <div className="admin-field">
            <label>Subtitle</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
            />
          </div>

          <div className="admin-field">
            <label>Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>
        </section>

        {/* ---- Highlights ---- */}
        <section className="manage-hero-section">
          <div className="manage-hero-section__header">
            <h3 className="manage-hero-section__title">Highlights</h3>
            <button type="button" className="admin-btn admin-btn--sm admin-btn--ghost" onClick={addHighlight}>
              <IconPlus /> Add
            </button>
          </div>

          {form.highlights.map((h, idx) => (
            <div key={idx} className="manage-hero-array-row">
              <input
                type="text"
                value={h}
                onChange={(e) => updateHighlight(idx, e.target.value)}
                placeholder="e.g. Machine Learning & Data Analytics"
              />
              {form.highlights.length > 1 && (
                <button
                  type="button"
                  className="admin-btn admin-btn--sm admin-btn--danger"
                  onClick={() => removeHighlight(idx)}
                >
                  <IconTrash />
                </button>
              )}
            </div>
          ))}
        </section>

        {/* ---- CTA Buttons ---- */}
        <section className="manage-hero-section">
          <h3 className="manage-hero-section__title">Call-to-Action Buttons</h3>

          <div className="manage-hero-cta-group">
            <span className="manage-hero-cta-label">Primary</span>
            <div className="manage-hero-cta-fields">
              <div className="admin-field">
                <label>Label</label>
                <input
                  type="text"
                  value={form.cta_primary_label}
                  onChange={(e) => handleChange('cta_primary_label', e.target.value)}
                  placeholder="Review Projects"
                />
              </div>
              <div className="admin-field">
                <label>Section ID</label>
                <input
                  type="text"
                  value={form.cta_primary_section}
                  onChange={(e) => handleChange('cta_primary_section', e.target.value)}
                  placeholder="projects"
                />
              </div>
            </div>
          </div>

          <div className="manage-hero-cta-group">
            <span className="manage-hero-cta-label">Secondary</span>
            <div className="manage-hero-cta-fields">
              <div className="admin-field">
                <label>Label</label>
                <input
                  type="text"
                  value={form.cta_secondary_label}
                  onChange={(e) => handleChange('cta_secondary_label', e.target.value)}
                  placeholder="Contact"
                />
              </div>
              <div className="admin-field">
                <label>Section ID</label>
                <input
                  type="text"
                  value={form.cta_secondary_section}
                  onChange={(e) => handleChange('cta_secondary_section', e.target.value)}
                  placeholder="contact"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ---- Links ---- */}
        <section className="manage-hero-section">
          <div className="manage-hero-section__header">
            <h3 className="manage-hero-section__title">Social Links</h3>
            <button type="button" className="admin-btn admin-btn--sm admin-btn--ghost" onClick={addLink}>
              <IconPlus /> Add
            </button>
          </div>

          {form.links.map((link, idx) => (
            <div key={idx} className="manage-hero-array-row manage-hero-link-row">
              <select
                value={link.icon || 'website'}
                onChange={(e) => updateLink(idx, 'icon', e.target.value)}
              >
                {iconOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <input
                type="text"
                value={link.label}
                onChange={(e) => updateLink(idx, 'label', e.target.value)}
                placeholder="Label (e.g. GitHub)"
              />
              <input
                type="text"
                value={link.href}
                onChange={(e) => updateLink(idx, 'href', e.target.value)}
                placeholder="URL (e.g. https://github.com/...)"
              />
              {form.links.length > 1 && (
                <button
                  type="button"
                  className="admin-btn admin-btn--sm admin-btn--danger"
                  onClick={() => removeLink(idx)}
                >
                  <IconTrash />
                </button>
              )}
            </div>
          ))}
        </section>

        {/* ---- Metrics ---- */}
        <section className="manage-hero-section">
          <div className="manage-hero-section__header">
            <h3 className="manage-hero-section__title">Metrics</h3>
            <button type="button" className="admin-btn admin-btn--sm admin-btn--ghost" onClick={addMetric}>
              <IconPlus /> Add
            </button>
          </div>

          {form.metrics.map((metric, idx) => (
            <div key={idx} className="manage-hero-array-row manage-hero-array-row--pair">
              <input
                type="text"
                value={metric.value}
                onChange={(e) => updateMetric(idx, 'value', e.target.value)}
                placeholder="Value (e.g. 3+)"
              />
              <input
                type="text"
                value={metric.label}
                onChange={(e) => updateMetric(idx, 'label', e.target.value)}
                placeholder="Label (e.g. Years in Tech)"
              />
              {form.metrics.length > 1 && (
                <button
                  type="button"
                  className="admin-btn admin-btn--sm admin-btn--danger"
                  onClick={() => removeMetric(idx)}
                >
                  <IconTrash />
                </button>
              )}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
