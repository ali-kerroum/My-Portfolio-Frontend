import { useState, useEffect, useCallback, useRef } from 'react';
import { IconPlus, IconEdit, IconTrash, IconArrowLeft, IconInbox, IconX } from './Icons';

/**
 * Generic CRUD manager component for admin pages.
 *
 * Props:
 * - entityName: string (e.g. "Project")
 * - fetchAll: () => Promise       — API call to list items
 * - createItem: (data) => Promise — API call to create
 * - updateItem: (id, data) => Promise
 * - deleteItem: (id) => Promise
 * - fields: array of { name, label, type, required, options, placeholder }
 *     type: "text" | "textarea" | "select" | "color" | "array" | "json" | "tags"
 * - renderCard: (item) => JSX     — how to display each item in the list
 */
export default function CrudManager({
  entityName,
  fetchAll,
  createItem,
  updateItem,
  deleteItem,
  fields,
  renderCard,
  onUploadFile,
  onReorder,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = list view, {} = create, {id} = edit
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [uploading, setUploading] = useState({});
  const [iconPickerMode, setIconPickerMode] = useState(null);

  // Drag reorder state
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (index) => {
    dragItem.current = index;
    setDragIndex(index);
  };

  const handleDragEnter = (index) => {
    dragOverItem.current = index;
    setDragOverIndex(index);
  };

  const handleDragEnd = async () => {
    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    const reordered = [...items];
    const [moved] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOverItem.current, 0, moved);
    setItems(reordered);
    setDragIndex(null);
    setDragOverIndex(null);
    dragItem.current = null;
    dragOverItem.current = null;

    if (onReorder) {
      try {
        await onReorder(reordered.map((item) => item.id));
      } catch {
        setError('Failed to save order');
        await load();
      }
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAll();
      setItems(res.data);
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [fetchAll]);

  useEffect(() => {
    load();
  }, [load]);

  const getDefaultValues = () => {
    const defaults = {};
    fields.forEach((f) => {
      if (f.type === 'array' || f.type === 'tags' || f.type === 'file_uploads') defaults[f.name] = [];
      else if (f.type === 'json') defaults[f.name] = {};
      else if (f.type === 'sections') defaults[f.name] = [];
      else if (f.type === 'image_upload') defaults[f.name] = '';
      else defaults[f.name] = f.defaultValue ?? '';
    });
    return defaults;
  };

  const startCreate = () => {
    setFormData(getDefaultValues());
    setEditing({});
    setError('');
    setIconPickerMode(null);
  };

  const startEdit = (item) => {
    const data = {};
    fields.forEach((f) => {
      if (f.type === 'array' || f.type === 'tags' || f.type === 'file_uploads') {
        data[f.name] = item[f.name] ?? [];
      } else if (f.type === 'sections') {
        data[f.name] = item[f.name] ?? [];
      } else {
        data[f.name] = item[f.name] ?? f.defaultValue ?? '';
      }
    });
    setFormData(data);
    setEditing(item);
    setError('');
    setIconPickerMode(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing.id) {
        await updateItem(editing.id, formData);
      } else {
        await createItem(formData);
      }
      setEditing(null);
      await load();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors;
      setError(typeof msg === 'object' ? JSON.stringify(msg) : msg || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      setDeleteConfirm(null);
      await load();
    } catch {
      setError('Failed to delete');
    }
  };

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Array field helpers
  const addArrayItem = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: [...(prev[name] || []), ''],
    }));
  };

  const removeArrayItem = (name, index) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].filter((_, i) => i !== index),
    }));
  };

  const updateArrayItem = (name, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].map((item, i) => (i === index ? value : item)),
    }));
  };

  // Section field helpers
  const addSection = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: [...(prev[name] || []), { name: '', type: 'text', content: '' }],
    }));
  };

  const removeSection = (name, index) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].filter((_, i) => i !== index),
    }));
  };

  const updateSection = (name, index, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].map((sec, i) => {
        if (i !== index) return sec;
        if (key === 'type') {
          // switching type → reset content to matching default
          return { ...sec, type: value, content: value === 'list' ? [] : '' };
        }
        return { ...sec, [key]: value };
      }),
    }));
  };

  const addSectionListItem = (name, sectionIndex) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].map((sec, i) =>
        i === sectionIndex ? { ...sec, content: [...(sec.content || []), ''] } : sec
      ),
    }));
  };

  const removeSectionListItem = (name, sectionIndex, itemIndex) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].map((sec, i) =>
        i === sectionIndex
          ? { ...sec, content: sec.content.filter((_, j) => j !== itemIndex) }
          : sec
      ),
    }));
  };

  const updateSectionListItem = (name, sectionIndex, itemIndex, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].map((sec, i) =>
        i === sectionIndex
          ? { ...sec, content: sec.content.map((item, j) => (j === itemIndex ? value : item)) }
          : sec
      ),
    }));
  };

  const renderField = (field) => {
    const value = formData[field.name] ?? '';

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => updateField(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            required={field.required}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => updateField(field.name, e.target.value)}
            required={field.required}
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'color':
        return (
          <div className="admin-color-field">
            <input
              type="color"
              value={value || '#5ea0ff'}
              onChange={(e) => updateField(field.name, e.target.value)}
            />
            <input
              type="text"
              value={value}
              onChange={(e) => updateField(field.name, e.target.value)}
              placeholder="#5ea0ff"
            />
          </div>
        );

      case 'array':
        return (
          <div className="admin-array-field">
            {(formData[field.name] || []).map((item, i) => (
              <div key={i} className="admin-array-field__row">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateArrayItem(field.name, i, e.target.value)}
                  placeholder={`Item ${i + 1}`}
                />
                <button
                  type="button"
                  className="admin-btn admin-btn--danger admin-btn--icon"
                  onClick={() => removeArrayItem(field.name, i)}
                >
                  <IconX />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="admin-btn admin-btn--secondary admin-btn--sm"
              onClick={() => addArrayItem(field.name)}
            >
              <IconPlus /> Add Item
            </button>
          </div>
        );

      case 'tags':
        return (
          <div className="admin-array-field">
            {(formData[field.name] || []).map((item, i) => (
              <div key={i} className="admin-array-field__row">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateArrayItem(field.name, i, e.target.value)}
                  placeholder={`Tag ${i + 1}`}
                />
                <button
                  type="button"
                  className="admin-btn admin-btn--danger admin-btn--icon"
                  onClick={() => removeArrayItem(field.name, i)}
                >
                  <IconX />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="admin-btn admin-btn--secondary admin-btn--sm"
              onClick={() => addArrayItem(field.name)}
            >
              <IconPlus /> Add Tag
            </button>
          </div>
        );

      case 'json':
        return (
          <textarea
            value={typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
            onChange={(e) => {
              try {
                updateField(field.name, JSON.parse(e.target.value));
              } catch {
                // keep raw value during editing
              }
            }}
            placeholder='{"key": "value"}'
            rows={3}
          />
        );

      case 'sections':
        return (
          <div className="admin-sections-field">
            {(formData[field.name] || []).map((section, si) => (
              <div key={si} className="admin-section-block">
                <div className="admin-section-block__header">
                  <span className="admin-section-block__number">{si + 1}</span>
                  <input
                    type="text"
                    className="admin-section-block__name"
                    value={section.name}
                    onChange={(e) => updateSection(field.name, si, 'name', e.target.value)}
                    placeholder="Section name"
                  />
                  <div className="admin-section-block__type-toggle">
                    <button
                      type="button"
                      className={`admin-section-block__type-btn ${section.type === 'text' ? 'admin-section-block__type-btn--active' : ''}`}
                      onClick={() => updateSection(field.name, si, 'type', 'text')}
                    >
                      Text
                    </button>
                    <button
                      type="button"
                      className={`admin-section-block__type-btn ${section.type === 'list' ? 'admin-section-block__type-btn--active' : ''}`}
                      onClick={() => updateSection(field.name, si, 'type', 'list')}
                    >
                      List
                    </button>
                  </div>
                  <button
                    type="button"
                    className="admin-btn admin-btn--danger admin-btn--icon"
                    onClick={() => removeSection(field.name, si)}
                    title="Remove section"
                  >
                    <IconX />
                  </button>
                </div>

                <div className="admin-section-block__body">
                  {section.type === 'text' ? (
                    <textarea
                      value={section.content || ''}
                      onChange={(e) => updateSection(field.name, si, 'content', e.target.value)}
                      placeholder="Write section content..."
                      rows={3}
                    />
                  ) : (
                    <div className="admin-array-field">
                      {(section.content || []).map((item, li) => (
                        <div key={li} className="admin-array-field__row">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => updateSectionListItem(field.name, si, li, e.target.value)}
                            placeholder={`Item ${li + 1}`}
                          />
                          <button
                            type="button"
                            className="admin-btn admin-btn--danger admin-btn--icon"
                            onClick={() => removeSectionListItem(field.name, si, li)}
                          >
                            <IconX />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="admin-btn admin-btn--secondary admin-btn--sm"
                        onClick={() => addSectionListItem(field.name, si)}
                      >
                        <IconPlus /> Add Item
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              className="admin-btn admin-btn--secondary admin-btn--sm"
              onClick={() => addSection(field.name)}
            >
              <IconPlus /> Add Section
            </button>
          </div>
        );

      case 'icon_picker': {
        const presetIcons = field.icons || [
          { id: 'briefcase', label: 'Briefcase', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>' },
          { id: 'code', label: 'Code', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>' },
          { id: 'laptop', label: 'Laptop', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>' },
          { id: 'palette', label: 'Design', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/><circle cx="6.5" cy="12.5" r="0.5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.7 1.5-1.5 0-.4-.1-.7-.4-1-.3-.3-.4-.7-.4-1.1 0-.8.7-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-5.5-4.5-9.9-10-10z"/></svg>' },
          { id: 'database', label: 'Database', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>' },
          { id: 'globe', label: 'Web', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>' },
          { id: 'server', label: 'Server', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>' },
          { id: 'terminal', label: 'Terminal', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>' },
          { id: 'cpu', label: 'CPU', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>' },
          { id: 'rocket', label: 'Rocket', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 3 0 3 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-3 0-3"/></svg>' },
          { id: 'graduation', label: 'Education', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/></svg>' },
          { id: 'lightbulb', label: 'Idea', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 019 14"/></svg>' },
          { id: 'chart', label: 'Analytics', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' },
          { id: 'shield', label: 'Security', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
          { id: 'smartphone', label: 'Mobile', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>' },
          { id: 'cloud', label: 'Cloud', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>' },
          { id: 'git', label: 'Git', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><line x1="6" y1="9" x2="6" y2="21"/><path d="M18 9a9 9 0 01-9 9"/></svg>' },
          { id: 'wrench', label: 'Tools', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>' },
        ];
        const isPreset = presetIcons.some(i => i.svg === value);
        const autoMode = value && value.startsWith('<svg') && !isPreset ? 'svg' : (value && !value.startsWith('<svg') && value.length > 0) ? 'emoji' : 'preset';
        const currentMode = iconPickerMode || autoMode;
        return (
          <div className="admin-icon-picker">
            <div className="admin-icon-picker__tabs">
              <button
                type="button"
                className={`admin-icon-picker__tab${currentMode === 'preset' ? ' admin-icon-picker__tab--active' : ''}`}
                onClick={() => setIconPickerMode('preset')}
              >
                Icon Library
              </button>
              <button
                type="button"
                className={`admin-icon-picker__tab${currentMode === 'emoji' ? ' admin-icon-picker__tab--active' : ''}`}
                onClick={() => setIconPickerMode('emoji')}
              >
                Emoji / Text
              </button>
              <button
                type="button"
                className={`admin-icon-picker__tab${currentMode === 'svg' ? ' admin-icon-picker__tab--active' : ''}`}
                onClick={() => setIconPickerMode('svg')}
              >
                Custom SVG
              </button>
            </div>
            {(currentMode === 'preset' || isPreset) ? (
              <div className="admin-icon-picker__grid">
                {presetIcons.map((icon) => (
                  <button
                    key={icon.id}
                    type="button"
                    className={`admin-icon-picker__item${value === icon.svg ? ' admin-icon-picker__item--selected' : ''}`}
                    onClick={() => updateField(field.name, icon.svg)}
                    title={icon.label}
                  >
                    <span className="admin-icon-picker__icon" dangerouslySetInnerHTML={{ __html: icon.svg }} />
                    <span className="admin-icon-picker__label">{icon.label}</span>
                  </button>
                ))}
              </div>
            ) : currentMode === 'emoji' ? (
              <div className="admin-icon-picker__emoji">
                <div className="admin-icon-picker__emoji-input">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateField(field.name, e.target.value)}
                    placeholder="Type or paste an emoji: 💻 🎨 🚀"
                    maxLength={10}
                  />
                  {value && (
                    <span className="admin-icon-picker__emoji-preview">{value}</span>
                  )}
                </div>
                <p className="admin-icon-picker__emoji-hint">
                  Type an emoji from your keyboard (Win + . on Windows, Ctrl + Cmd + Space on Mac)
                </p>
              </div>
            ) : (
              <div className="admin-icon-picker__custom">
                <textarea
                  value={value}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  placeholder='<svg viewBox="0 0 24 24" ...>...</svg>'
                  rows={4}
                  spellCheck={false}
                />
                {value && (
                  <div className="admin-icon-picker__preview">
                    <span className="admin-icon-picker__preview-label">Preview</span>
                    <span className="admin-icon-picker__preview-icon" dangerouslySetInnerHTML={{ __html: value }} />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }

      default:
        return (
          <input
            type={field.type || 'text'}
            value={value}
            onChange={(e) => updateField(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );

      case 'image_upload':
        return (
          <div className="admin-upload-single">
            {value && (
              <div className="admin-upload-single__preview">
                <img src={value} alt="Preview" />
                <button
                  type="button"
                  className="admin-upload-single__remove"
                  onClick={() => updateField(field.name, '')}
                  title="Remove"
                >
                  <IconX />
                </button>
              </div>
            )}
            <label className="admin-upload-dropzone">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file || !onUploadFile) return;
                  setUploading((p) => ({ ...p, [field.name]: true }));
                  try {
                    const res = await onUploadFile(file);
                    updateField(field.name, res.data.url);
                  } catch {
                    setError('Upload failed');
                  } finally {
                    setUploading((p) => ({ ...p, [field.name]: false }));
                    e.target.value = '';
                  }
                }}
                disabled={uploading[field.name]}
              />
              <div className="admin-upload-dropzone__content">
                {uploading[field.name] ? (
                  <span className="admin-upload-dropzone__uploading">Uploading...</span>
                ) : (
                  <>
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    <span>Click to upload image</span>
                  </>
                )}
              </div>
            </label>
            {value && (
              <input
                type="text"
                value={value}
                onChange={(e) => updateField(field.name, e.target.value)}
                placeholder="Or paste URL"
                className="admin-upload-single__url"
              />
            )}
          </div>
        );

      case 'file_uploads':
        return (
          <div className="admin-upload-multi">
            {(formData[field.name] || []).length > 0 && (
              <div className="admin-upload-multi__list">
                {formData[field.name].map((fileUrl, i) => (
                  <div key={i} className="admin-upload-multi__item">
                    {field.accept?.startsWith('video') ? (
                      <video src={fileUrl} className="admin-upload-multi__thumb admin-upload-multi__thumb--video" />
                    ) : (
                      <img src={fileUrl} alt="" className="admin-upload-multi__thumb" />
                    )}
                    <span className="admin-upload-multi__name" title={fileUrl}>
                      {fileUrl.split('/').pop()}
                    </span>
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger admin-btn--icon"
                      onClick={() => removeArrayItem(field.name, i)}
                    >
                      <IconX />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="admin-upload-dropzone">
              <input
                type="file"
                accept={field.accept || '*'}
                multiple
                hidden
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  if (!files.length || !onUploadFile) return;
                  setUploading((p) => ({ ...p, [field.name]: true }));
                  try {
                    const urls = [];
                    for (const file of files) {
                      const res = await onUploadFile(file);
                      urls.push(res.data.url);
                    }
                    setFormData((prev) => ({
                      ...prev,
                      [field.name]: [...(prev[field.name] || []), ...urls],
                    }));
                  } catch {
                    setError('Upload failed');
                  } finally {
                    setUploading((p) => ({ ...p, [field.name]: false }));
                    e.target.value = '';
                  }
                }}
                disabled={uploading[field.name]}
              />
              <div className="admin-upload-dropzone__content">
                {uploading[field.name] ? (
                  <span className="admin-upload-dropzone__uploading">Uploading...</span>
                ) : (
                  <>
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    <span>Click to upload {field.accept?.startsWith('video') ? 'videos' : 'images'}</span>
                    <span className="admin-upload-dropzone__hint">Multiple files allowed</span>
                  </>
                )}
              </div>
            </label>
          </div>
        );
    }
  };

  // Form view
  if (editing !== null) {
    return (
      <div>
        <div className="admin-page-header">
          <h1 className="admin-page-title">
            {editing.id ? `Edit ${entityName}` : `Create ${entityName}`}
          </h1>
          <button
            type="button"
            className="admin-btn admin-btn--secondary"
            onClick={() => setEditing(null)}
          >
            <IconArrowLeft /> Back
          </button>
        </div>

        {error && <div className="admin-alert admin-alert--error">{error}</div>}

        <form className="admin-form" onSubmit={handleSave}>
          {fields.map((field) => (
            <div key={field.name} className="admin-field">
              <label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="admin-field__required">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}

          <div className="admin-form__actions">
            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : editing.id ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--secondary"
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  // List view
  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{entityName}s</h1>
          <p className="admin-page-subtitle">
            {items.length} {entityName.toLowerCase()}(s) total
          </p>
        </div>
        <button type="button" className="admin-btn admin-btn--primary" onClick={startCreate}>
          <IconPlus /> New {entityName}
        </button>
      </div>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      {loading ? (
        <div className="admin-loading">Loading...</div>
      ) : items.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__icon"><IconInbox style={{ width: '3rem', height: '3rem' }} /></div>
          <p>No {entityName.toLowerCase()}s yet.</p>
          <button type="button" className="admin-btn admin-btn--primary" onClick={startCreate}>
            <IconPlus /> Create your first {entityName.toLowerCase()}
          </button>
        </div>
      ) : (
        <div className="admin-items-list">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`admin-item-card${dragIndex === index ? ' admin-item-card--dragging' : ''}${dragOverIndex === index ? ' admin-item-card--drag-over' : ''}`}
              draggable={!!onReorder}
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragOver={(e) => e.preventDefault()}
              onDragEnd={handleDragEnd}
            >
              {onReorder && (
                <div className="admin-item-card__handle" title="Drag to reorder">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                    <line x1="8" y1="6" x2="8" y2="6.01" />
                    <line x1="16" y1="6" x2="16" y2="6.01" />
                    <line x1="8" y1="12" x2="8" y2="12.01" />
                    <line x1="16" y1="12" x2="16" y2="12.01" />
                    <line x1="8" y1="18" x2="8" y2="18.01" />
                    <line x1="16" y1="18" x2="16" y2="18.01" />
                  </svg>
                </div>
              )}
              <div className="admin-item-card__content">
                {renderCard(item)}
              </div>
              <div className="admin-item-card__actions">
                <button
                  type="button"
                  className="admin-btn admin-btn--secondary admin-btn--sm"
                  onClick={() => startEdit(item)}
                >
                  <IconEdit /> Edit
                </button>
                {deleteConfirm === item.id ? (
                  <div className="admin-delete-confirm">
                    <span>Delete?</span>
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger admin-btn--sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn--secondary admin-btn--sm"
                      onClick={() => setDeleteConfirm(null)}
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="admin-btn admin-btn--danger admin-btn--sm"
                    onClick={() => setDeleteConfirm(item.id)}
                  >
                    <IconTrash /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
