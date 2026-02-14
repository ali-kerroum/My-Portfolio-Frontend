import { useState, useEffect, useCallback } from 'react';
import { getContactMessages, markMessageRead, deleteContactMessage } from '../../services/api';
import { IconTrash, IconInbox } from './Icons';

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all'); // all | unread | read

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getContactMessages();
      setMessages(res.data);
    } catch {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSelect = async (msg) => {
    setSelected(msg);
    if (!msg.read) {
      try {
        await markMessageRead(msg.id);
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
        );
      } catch {
        // ignore
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteContactMessage(id);
      setDeleteConfirm(null);
      if (selected?.id === id) setSelected(null);
      await load();
    } catch {
      setError('Failed to delete');
    }
  };

  const handleBack = () => setSelected(null);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatFullDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = ['#639bff', '#f472b6', '#34d399', '#fbbf24', '#a78bfa', '#fb923c', '#22d3ee'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const getTimeAgo = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return formatDate(dateStr);
  };

  const unreadCount = messages.filter((m) => !m.read).length;
  const readCount = messages.filter((m) => m.read).length;

  const filtered = messages.filter((m) => {
    if (filter === 'unread') return !m.read;
    if (filter === 'read') return m.read;
    return true;
  });

  return (
    <div className="msg">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Messages</h1>
          <p className="admin-page-subtitle">
            {messages.length} conversation{messages.length !== 1 ? 's' : ''}
            {unreadCount > 0 && (
              <span className="msg-badge msg-badge--unread">{unreadCount} new</span>
            )}
          </p>
        </div>
      </div>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      {loading ? (
        <div className="admin-loading">Loading...</div>
      ) : messages.length === 0 ? (
        <div className="msg-empty">
          <div className="msg-empty__graphic">
            <div className="msg-empty__circle">
              <IconInbox />
            </div>
          </div>
          <h3 className="msg-empty__title">No messages yet</h3>
          <p className="msg-empty__text">
            Messages from your portfolio contact form will appear here.
          </p>
        </div>
      ) : (
        <div className={`msg-container${selected ? ' msg-container--detail-open' : ''}`}>
          {/* List panel */}
          <div className="msg-panel-list">
            {/* Filter bar */}
            <div className="msg-filters">
              <button
                type="button"
                className={`msg-filter${filter === 'all' ? ' msg-filter--active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All <span className="msg-filter__count">{messages.length}</span>
              </button>
              <button
                type="button"
                className={`msg-filter${filter === 'unread' ? ' msg-filter--active' : ''}`}
                onClick={() => setFilter('unread')}
              >
                Unread <span className="msg-filter__count">{unreadCount}</span>
              </button>
              <button
                type="button"
                className={`msg-filter${filter === 'read' ? ' msg-filter--active' : ''}`}
                onClick={() => setFilter('read')}
              >
                Read <span className="msg-filter__count">{readCount}</span>
              </button>
            </div>

            {/* Message list */}
            <div className="msg-list">
              {filtered.length === 0 ? (
                <div className="msg-list-empty">No {filter} messages</div>
              ) : (
                filtered.map((msg) => (
                  <div
                    key={msg.id}
                    className={`msg-item${!msg.read ? ' msg-item--unread' : ''}${selected?.id === msg.id ? ' msg-item--active' : ''}`}
                    onClick={() => handleSelect(msg)}
                  >
                    <div
                      className="msg-item__avatar"
                      style={{ background: getAvatarColor(msg.name) }}
                    >
                      {getInitials(msg.name)}
                    </div>
                    <div className="msg-item__body">
                      <div className="msg-item__top">
                        <span className="msg-item__name">{msg.name}</span>
                        <span className="msg-item__time">{getTimeAgo(msg.created_at)}</span>
                      </div>
                      <p className="msg-item__email">{msg.email}</p>
                      <p className="msg-item__preview">{msg.message}</p>
                    </div>
                    {!msg.read && <span className="msg-item__indicator" />}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Detail panel */}
          <div className={`msg-panel-detail${selected ? ' msg-panel-detail--visible' : ''}`}>
            {selected ? (
              <>
                {/* Detail top bar */}
                <div className="msg-detail-bar">
                  <button
                    type="button"
                    className="msg-detail-back"
                    onClick={handleBack}
                    title="Back to list"
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                  <div className="msg-detail-bar__actions">
                    {deleteConfirm === selected.id ? (
                      <div className="msg-detail-bar__confirm">
                        <span>Delete this message?</span>
                        <button
                          type="button"
                          className="admin-btn admin-btn--danger admin-btn--sm"
                          onClick={() => handleDelete(selected.id)}
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn--secondary admin-btn--sm"
                          onClick={() => setDeleteConfirm(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="msg-action-btn msg-action-btn--danger"
                        onClick={() => setDeleteConfirm(selected.id)}
                        title="Delete"
                      >
                        <IconTrash />
                      </button>
                    )}
                  </div>
                </div>

                {/* Sender profile */}
                <div className="msg-detail-sender">
                  <div
                    className="msg-detail-sender__avatar"
                    style={{ background: getAvatarColor(selected.name) }}
                  >
                    {getInitials(selected.name)}
                  </div>
                  <div className="msg-detail-sender__info">
                    <h2 className="msg-detail-sender__name">{selected.name}</h2>
                    <a
                      href={`mailto:${selected.email}`}
                      className="msg-detail-sender__email"
                    >
                      {selected.email}
                    </a>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="msg-detail-meta">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>{formatFullDate(selected.created_at)}</span>
                </div>

                {/* Message body */}
                <div className="msg-detail-body">
                  {selected.message}
                </div>

                {/* Reply action */}
                <div className="msg-detail-footer">
                  <a
                    href={`mailto:${selected.email}?subject=Re: Portfolio Contact&body=%0A%0A---%0AOriginal message from ${selected.name}:%0A${encodeURIComponent(selected.message)}`}
                    className="msg-reply-btn"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 00-4-4H4"/></svg>
                    Reply via Email
                  </a>
                </div>
              </>
            ) : (
              <div className="msg-detail-placeholder">
                <div className="msg-detail-placeholder__icon">
                  <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <p>Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
