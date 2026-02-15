import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, getExperiences, getServices, getSkills, getPageViewStats, getUnreadMessageCount, getContactMessages } from '../../services/api';
import { IconRocket, IconBriefcase, IconSettings, IconTarget } from './Icons';

/* ── tiny SVG sparkline (area) ────────────────────────── */
function Sparkline({ data, width = 200, height = 48, color = '#639bff' }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data, 1);
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => [i * step, height - (v / max) * height * 0.85 - 2]);
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${width},${height} L0,${height} Z`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="dash2-sparkline" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace('#', '')})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── donut ring ───────────────────────────────────────── */
function DonutRing({ segments, size = 100 }) {
  const r = 38, c = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  let offset = 0;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="dash2-donut">
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--a-border)" strokeWidth="6" />
      {segments.map((seg) => {
        const dash = (seg.value / total) * c;
        const o = offset;
        offset += dash;
        return (
          <circle key={seg.label} cx="50" cy="50" r={r} fill="none"
            stroke={seg.color} strokeWidth="6" strokeDasharray={`${dash} ${c - dash}`}
            strokeDashoffset={-o} strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dasharray 0.6s ease' }} />
        );
      })}
    </svg>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, experiences: 0, services: 0, skills: 0 });
  const [visitors, setVisitors] = useState({
    total: 0, today: 0, yesterday: 0, this_week: 0, this_month: 0,
    unique_visitors: 0, growth_percent: 0, daily: [], monthly: [],
    top_pages: [], browsers: [],
    devices: { mobile: 0, desktop: 0 }, peak_hours: [], recent_views: [],
    session_insights: { avg_duration: 0, avg_pages: 0, bounce_rate: 0, total_sessions: 0, longest_session: 0 },
    os_breakdown: [], engagement_funnel: [],
    weekly_comparison: { this_week_views: 0, last_week_views: 0, views_change: 0, this_week_visitors: 0, last_week_visitors: 0, visitors_change: 0 },
    monthly_trend: [],
  });

  const [unreadMessages, setUnreadMessages] = useState(0);
  const [recentMessages, setRecentMessages] = useState([]);
  const [chartMode, setChartMode] = useState('week');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([getProjects(), getExperiences(), getServices(), getSkills()]).then(
      ([projectsRes, experiences, services, skillsRes]) => {
        setStats({
          projects: projectsRes.data.length, experiences: experiences.data.length,
          services: services.data.length, skills: skillsRes.data.length,
        });

      }
    );
    getPageViewStats().then((res) => setVisitors(res.data)).catch(() => {});
    getUnreadMessageCount().then((res) => setUnreadMessages(res.data.count)).catch(() => {});
    getContactMessages().then((res) => setRecentMessages((res.data || []).slice(0, 5))).catch(() => {});
    setTimeout(() => setLoaded(true), 50);
  }, []);

  const contentCards = [
    { label: 'Projects', count: stats.projects, icon: <IconRocket />, to: '/admin/projects', color: '#639bff', gradient: 'linear-gradient(135deg, #639bff 0%, #4285f4 100%)' },
    { label: 'Experiences', count: stats.experiences, icon: <IconBriefcase />, to: '/admin/experiences', color: '#4caf50', gradient: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)' },
    { label: 'Services', count: stats.services, icon: <IconSettings />, to: '/admin/services', color: '#bc8cff', gradient: 'linear-gradient(135deg, #bc8cff 0%, #9c6fff 100%)' },
    { label: 'Skills', count: stats.skills, icon: <IconTarget />, to: '/admin/skills', color: '#ffb74d', gradient: 'linear-gradient(135deg, #ffb74d 0%, #ff9800 100%)' },
  ];

  const chartData = chartMode === 'week' ? visitors.daily : visitors.monthly;
  const maxChart = Math.max(...(chartData || []).map((d) => d.count), 1);
  const totalDevices = (visitors.devices?.mobile || 0) + (visitors.devices?.desktop || 0);
  const maxHour = Math.max(...(visitors.peak_hours || []).map((h) => h.count), 1);
  const totalBrowsers = (visitors.browsers || []).reduce((s, b) => s + b.count, 0);
  const browserColors = { Chrome: '#4285f4', Firefox: '#ff7139', Safari: '#006cff', Edge: '#0078d4', Opera: '#ff1b2d', Other: '#64748b' };
  const osColors = { Windows: '#0078d4', macOS: '#555555', iOS: '#007aff', Android: '#3ddc84', Linux: '#ffb74d', ChromeOS: '#4285f4', Other: '#64748b' };
  const totalOs = (visitors.os_breakdown || []).reduce((s, o) => s + o.count, 0);

  const deviceSegments = useMemo(() => [
    { label: 'Desktop', value: visitors.devices?.desktop || 0, color: '#639bff' },
    { label: 'Mobile', value: visitors.devices?.mobile || 0, color: '#bc8cff' },
  ], [visitors.devices]);

  const timeAgo = (dateStr) => {
    const d = Date.now() - new Date(dateStr).getTime(); const m = Math.floor(d / 60000);
    if (m < 1) return 'just now'; if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const growthIcon = visitors.growth_percent > 0 ? '↑' : visitors.growth_percent < 0 ? '↓' : '';
  const growthClass = visitors.growth_percent > 0 ? 'dash2-trend--up' : visitors.growth_percent < 0 ? 'dash2-trend--down' : '';

  return (
    <div className={`dash2${loaded ? ' dash2--loaded' : ''}`}>
      {/* ── Header ────── */}
      <header className="dash2-header">
        <div>
          <h1 className="dash2-header__title">Dashboard</h1>
          <p className="dash2-header__sub">Real-time portfolio analytics</p>
        </div>
        <div className="dash2-header__live">
          <span className="dash2-header__pulse" />
          Live
        </div>
      </header>

      {/* ── KPI Row ────── */}
      <section className="dash2-kpis">
        {[
          { val: visitors.total, label: 'Total Views', color: '#639bff', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>, sparkData: (visitors.daily || []).map(d => d.count) },
          { val: visitors.today, label: 'Today', color: '#4caf50', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, trend: visitors.growth_percent },
          { val: visitors.this_month, label: 'This Month', color: '#bc8cff', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
          { val: visitors.unique_visitors, label: 'Unique Visitors', color: '#ffb74d', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
        ].map((kpi, idx) => (
          <div key={kpi.label} className="dash2-kpi" style={{ '--kc': kpi.color, '--delay': `${idx * 60}ms` }}>
            <div className="dash2-kpi__glow" />
            <div className="dash2-kpi__top">
              <div className="dash2-kpi__icon">{kpi.icon}</div>
              {kpi.trend != null && kpi.trend !== 0 && (
                <span className={`dash2-trend ${growthClass}`}>
                  {growthIcon} {Math.abs(kpi.trend)}%
                </span>
              )}
            </div>
            <span className="dash2-kpi__val">{kpi.val.toLocaleString()}</span>
            <span className="dash2-kpi__lbl">{kpi.label}</span>
            {kpi.sparkData && <Sparkline data={kpi.sparkData} color={kpi.color} />}
          </div>
        ))}
      </section>

      {/* ── Bento: Chart + Pages ────── */}
      <section className="dash2-bento">
        <div className="dash2-glass dash2-glass--chart">
          <div className="dash2-glass__head">
            <h3>Traffic Overview</h3>
            <div className="dash2-pill-toggle">
              <button className={chartMode === 'week' ? 'active' : ''} onClick={() => setChartMode('week')}>7D</button>
              <button className={chartMode === 'month' ? 'active' : ''} onClick={() => setChartMode('month')}>30D</button>
            </div>
          </div>
          {chartData && chartData.length > 0 && (
            <div className="dash2-bars">
              {chartData.map((day, i) => (
                <div key={day.date} className="dash2-bars__col" title={`${day.date}: ${day.count}`}>
                  <span className="dash2-bars__tip">{day.count}</span>
                  <div className="dash2-bars__bar" style={{ '--h': `${Math.max((day.count / maxChart) * 100, 3)}%` }} />
                  {(chartMode === 'week' || i % 5 === 0) && <span className="dash2-bars__lbl">{day.date.split(' ')[1]}</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dash2-glass">
          <div className="dash2-glass__head"><h3>Top Sections</h3></div>
          <div className="dash2-ranking">
            {(visitors.top_pages || []).length === 0 && <p className="dash2-empty">No data yet</p>}
            {(visitors.top_pages || []).map((p, i) => {
              const pageLabels = { '/': 'Home (initial load)', '/#hero': 'Hero', '/#about': 'About', '/#experience': 'Experience', '/#services': 'Services', '/#projects': 'Projects', '/#contact': 'Contact' };
              const label = pageLabels[p.page] || p.page || 'Home';
              return (
                <div key={p.page} className="dash2-ranking__row">
                  <span className="dash2-ranking__num" style={{ '--rc': ['#639bff','#bc8cff','#ffb74d','#4caf50','#64748b'][i] }}>{i + 1}</span>
                  <span className="dash2-ranking__text">{label}</span>
                  <span className="dash2-ranking__val">{p.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Bento: Browsers + Devices + Hours ────── */}
      <section className="dash2-trio">
        <div className="dash2-glass">
          <div className="dash2-glass__head"><h3>Browsers <span className="dash2-alltime">All Time</span></h3></div>
          <div className="dash2-browser-list">
            {(visitors.browsers || []).length === 0 && <p className="dash2-empty">No data yet</p>}
            {(visitors.browsers || []).map((b) => {
              const pct = totalBrowsers > 0 ? Math.round((b.count / totalBrowsers) * 100) : 0;
              const c = browserColors[b.name] || '#64748b';
              return (
                <div key={b.name} className="dash2-brow">
                  <div className="dash2-brow__head">
                    <span className="dash2-brow__dot" style={{ background: c }} />
                    <span className="dash2-brow__name">{b.name}</span>
                    <span className="dash2-brow__pct">{pct}%</span>
                  </div>
                  <div className="dash2-brow__track">
                    <div className="dash2-brow__fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${c}, ${c}88)` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="dash2-glass dash2-glass--center">
          <div className="dash2-glass__head"><h3>Devices <span className="dash2-alltime">All Time</span></h3></div>
          <div className="dash2-devices">
            <DonutRing segments={deviceSegments} size={96} />
            <div className="dash2-devices__legend">
              {deviceSegments.map((s) => (
                <div key={s.label} className="dash2-devices__row">
                  <span className="dash2-devices__dot" style={{ background: s.color }} />
                  <span className="dash2-devices__name">{s.label}</span>
                  <span className="dash2-devices__val">{totalDevices > 0 ? Math.round((s.value / totalDevices) * 100) : 0}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dash2-glass">
          <div className="dash2-glass__head"><h3>Peak Hours <span className="dash2-alltime">All Time</span></h3></div>
          <div className="dash2-heatmap">
            {(visitors.peak_hours || []).map((h) => (
              <div key={h.hour} className="dash2-heatmap__cell"
                style={{ '--intensity': maxHour > 0 ? Math.max(h.count / maxHour, 0.06) : 0.06 }}
                title={`${h.hour}:00 — ${h.count} views`} />
            ))}
          </div>
          <div className="dash2-heatmap__labels">
            <span>12am</span><span>6am</span><span>12pm</span><span>6pm</span><span>11pm</span>
          </div>
        </div>
      </section>

      {/* ── Content Cards ────── */}
      <section className="dash2-section-label">Content</section>
      <section className="dash2-content-grid">
        {contentCards.map((card, idx) => (
          <Link key={card.label} to={card.to} className="dash2-content-card" style={{ '--cc': card.color, '--cg': card.gradient, '--delay': `${idx * 50}ms` }}>
            <div className="dash2-content-card__icon">{card.icon}</div>
            <span className="dash2-content-card__count">{card.count}</span>
            <span className="dash2-content-card__label">{card.label}</span>
          </Link>
        ))}
      </section>

      {/* ── Weekly Comparison + Monthly Trend ────── */}
      <section className="dash2-bento">
        <div className="dash2-glass">
          <div className="dash2-glass__head"><h3>Weekly Comparison</h3></div>
          {(() => {
            const wc = visitors.weekly_comparison || {};
            const arrow = (v) => v > 0 ? '↑' : v < 0 ? '↓' : '';
            const cls = (v) => v > 0 ? 'dash2-trend--up' : v < 0 ? 'dash2-trend--down' : '';
            return (
              <div className="dash2-week-compare">
                <div className="dash2-week-compare__row">
                  <div className="dash2-week-compare__metric">
                    <span className="dash2-week-compare__label">Views</span>
                    <div className="dash2-week-compare__vals">
                      <div className="dash2-week-compare__period">
                        <span className="dash2-week-compare__sub">This week</span>
                        <span className="dash2-week-compare__num">{(wc.this_week_views || 0).toLocaleString()}</span>
                      </div>
                      <span className="dash2-week-compare__vs">vs</span>
                      <div className="dash2-week-compare__period">
                        <span className="dash2-week-compare__sub">Last week</span>
                        <span className="dash2-week-compare__num dash2-week-compare__num--muted">{(wc.last_week_views || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`dash2-trend ${cls(wc.views_change)}`}>{arrow(wc.views_change)} {Math.abs(wc.views_change || 0)}%</span>
                </div>
                <div className="dash2-week-compare__row">
                  <div className="dash2-week-compare__metric">
                    <span className="dash2-week-compare__label">Unique Visitors</span>
                    <div className="dash2-week-compare__vals">
                      <div className="dash2-week-compare__period">
                        <span className="dash2-week-compare__sub">This week</span>
                        <span className="dash2-week-compare__num">{(wc.this_week_visitors || 0).toLocaleString()}</span>
                      </div>
                      <span className="dash2-week-compare__vs">vs</span>
                      <div className="dash2-week-compare__period">
                        <span className="dash2-week-compare__sub">Last week</span>
                        <span className="dash2-week-compare__num dash2-week-compare__num--muted">{(wc.last_week_visitors || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`dash2-trend ${cls(wc.visitors_change)}`}>{arrow(wc.visitors_change)} {Math.abs(wc.visitors_change || 0)}%</span>
                </div>
              </div>
            );
          })()}
        </div>

        <div className="dash2-glass dash2-glass--chart">
          <div className="dash2-glass__head"><h3>Monthly Trend</h3></div>
          {(() => {
            const mt = visitors.monthly_trend || [];
            const maxMt = Math.max(...mt.map(m => m.count), 1);
            return mt.length > 0 ? (
              <div className="dash2-bars">
                {mt.map((m) => (
                  <div key={m.month} className="dash2-bars__col" title={`${m.month}: ${m.count}`}>
                    <span className="dash2-bars__tip">{m.count}</span>
                    <div className="dash2-bars__bar" style={{ '--h': `${Math.max((m.count / maxMt) * 100, 3)}%` }} />
                    <span className="dash2-bars__lbl">{m.short}</span>
                  </div>
                ))}
              </div>
            ) : <p className="dash2-empty">No data yet</p>;
          })()}
        </div>
      </section>

      {/* ── OS Breakdown + Engagement Funnel ────── */}
      <section className="dash2-bento">
        <div className="dash2-glass">
          <div className="dash2-glass__head"><h3>Operating Systems <span className="dash2-alltime">All Time</span></h3></div>
          <div className="dash2-browser-list">
            {(visitors.os_breakdown || []).length === 0 && <p className="dash2-empty">No data yet</p>}
            {(visitors.os_breakdown || []).map((o) => {
              const pct = totalOs > 0 ? Math.round((o.count / totalOs) * 100) : 0;
              const c = osColors[o.name] || '#64748b';
              return (
                <div key={o.name} className="dash2-brow">
                  <div className="dash2-brow__head">
                    <span className="dash2-brow__dot" style={{ background: c }} />
                    <span className="dash2-brow__name">{o.name}</span>
                    <span className="dash2-brow__pct">{pct}%</span>
                  </div>
                  <div className="dash2-brow__track">
                    <div className="dash2-brow__fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${c}, ${c}88)` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="dash2-glass dash2-glass--chart">
          <div className="dash2-glass__head"><h3>Engagement Funnel</h3></div>
          <div className="dash2-funnel">
            {(() => {
              const funnelLabels = { '/': 'Landing', '/#hero': 'Hero', '/#about': 'About', '/#experience': 'Experience', '/#services': 'Services', '/#projects': 'Projects', '/#contact': 'Contact' };
              const funnelColors = ['#639bff', '#4caf50', '#bc8cff', '#ffb74d', '#ff6384', '#4285f4', '#ff9800'];
              const fd = visitors.engagement_funnel || [];
              const maxVisitors = Math.max(...fd.map(f => f.visitors), 1);
              return fd.length === 0 ? <p className="dash2-empty">No data yet</p> : fd.map((f, i) => (
                <div key={f.section} className="dash2-funnel__row">
                  <span className="dash2-funnel__label">{funnelLabels[f.section] || f.section}</span>
                  <div className="dash2-funnel__track">
                    <div className="dash2-funnel__fill" style={{ width: `${Math.max((f.visitors / maxVisitors) * 100, 3)}%`, background: funnelColors[i % funnelColors.length] }} />
                  </div>
                  <span className="dash2-funnel__val">{f.percent}%</span>
                  <span className="dash2-funnel__count">{f.visitors}</span>
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* ── Session Insights + Activity Feed ────── */}
      <section className="dash2-bento">
        <div className="dash2-glass">
          <div className="dash2-glass__head"><h3>Session Insights</h3></div>
          {(() => {
            const si = visitors.session_insights || {};
            const fmtDuration = (s) => {
              if (!s || s === 0) return '0s';
              const m = Math.floor(s / 60);
              const sec = s % 60;
              if (m === 0) return `${sec}s`;
              return sec > 0 ? `${m}m ${sec}s` : `${m}m`;
            };
            return (
              <div className="dash2-sessions">
                <div className="dash2-sessions__card">
                  <span className="dash2-sessions__icon" style={{ color: '#639bff' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </span>
                  <span className="dash2-sessions__val">{fmtDuration(si.avg_duration)}</span>
                  <span className="dash2-sessions__lbl">Avg Duration</span>
                </div>
                <div className="dash2-sessions__card">
                  <span className="dash2-sessions__icon" style={{ color: '#4caf50' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </span>
                  <span className="dash2-sessions__val">{si.avg_pages || 0}</span>
                  <span className="dash2-sessions__lbl">Pages / Session</span>
                </div>
                <div className="dash2-sessions__card">
                  <span className="dash2-sessions__icon" style={{ color: '#ff6384' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                  </span>
                  <span className="dash2-sessions__val">{si.bounce_rate || 0}%</span>
                  <span className="dash2-sessions__lbl">Bounce Rate</span>
                </div>
                <div className="dash2-sessions__card">
                  <span className="dash2-sessions__icon" style={{ color: '#bc8cff' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  </span>
                  <span className="dash2-sessions__val">{si.total_sessions || 0}</span>
                  <span className="dash2-sessions__lbl">Total Sessions</span>
                </div>
              </div>
            );
          })()}
        </div>

        <div className="dash2-glass dash2-glass--chart">
          <div className="dash2-glass__head"><h3>Recent Activity</h3></div>
          <div className="dash2-activity">
            {(visitors.recent_views || []).length === 0 && <p className="dash2-empty">No visits yet</p>}
            {(visitors.recent_views || []).map((v, i) => {
              const pageLabels = { '/': 'Home', '/#hero': 'Hero', '/#about': 'About', '/#experience': 'Experience', '/#services': 'Services', '/#projects': 'Projects', '/#contact': 'Contact' };
              const label = pageLabels[v.page] || v.page || 'Home';
              return (
                <div key={i} className="dash2-activity__row">
                  <span className="dash2-activity__dot" />
                  <span className="dash2-activity__page">{label}</span>
                  <span className="dash2-activity__time">{timeAgo(v.created_at)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Messages + Quick Actions ────── */}
      <section className="dash2-bento">
        <div className="dash2-glass dash2-glass--chart">
          <div className="dash2-glass__head">
            <h3>Messages {unreadMessages > 0 && <span className="dash2-badge">{unreadMessages}</span>}</h3>
            <Link to="/admin/messages" className="dash2-link">View all →</Link>
          </div>
          <div className="dash2-msg-list">
            {recentMessages.length === 0 && <p className="dash2-empty">No messages yet</p>}
            {recentMessages.map((msg) => (
              <div key={msg.id} className={`dash2-msg${!msg.read ? ' dash2-msg--new' : ''}`}>
                <div className="dash2-msg__avatar" style={{ '--ac': `hsl(${msg.name.charCodeAt(0) * 15 % 360}, 50%, 40%)` }}>
                  {msg.name.charAt(0).toUpperCase()}
                </div>
                <div className="dash2-msg__body">
                  <div className="dash2-msg__head">
                    <span className="dash2-msg__name">{msg.name}</span>
                    <span className="dash2-msg__time">{timeAgo(msg.created_at)}</span>
                  </div>
                  <p className="dash2-msg__text">{msg.message?.substring(0, 90)}{msg.message?.length > 90 ? '…' : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dash2-glass">
          <div className="dash2-glass__head"><h3>Quick Actions</h3></div>
          <div className="dash2-qa">
            {[
              { to: '/admin/projects', label: 'New Project', icon: 'M12 5v14M5 12h14' },
              { to: '/admin/experiences', label: 'New Experience', icon: 'M12 5v14M5 12h14' },
              { to: '/admin/services', label: 'New Service', icon: 'M12 5v14M5 12h14' },
              { to: '/admin/messages', label: 'Messages', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6' },
              { to: '/admin/sections', label: 'Sections', icon: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-2.82 1.18V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1.08H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001.08-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001.08 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1.08H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1.08z' },
            ].map((a) => (
              <Link key={a.label} to={a.to} className="dash2-qa__btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={a.icon} /></svg>
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
