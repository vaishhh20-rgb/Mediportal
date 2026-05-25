// app.jsx — OMNIMETRIX Express View. Top-level App + chrome (sidebar, topbar, KPI strip, filter bar).

const { useState, useMemo, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "regular",
  "accentIntensity": "balanced",
  "showAmbientGlow": true,
  "sidebarStyle": "floating",
  "kpiStyle": "iconLeft",
  "alarmAnimation": true
}/*EDITMODE-END*/;

/* ───────────────────────── Sidebar ───────────────────────── */

function Sidebar({ active, onChange, alertCount, sidebarStyle }) {
  const items = [
    { id: 'dashboard', icon: IconLayout, label: 'Dashboard' },
    { id: 'generators', icon: IconCpu, label: 'Generators' },
    { id: 'alerts', icon: IconBell, label: 'Alerts', badge: alertCount },
    { id: 'analytics', icon: IconChart, label: 'Analytics' },
    { id: 'maintenance', icon: IconWrench, label: 'Maintenance' },
    { id: 'settings', icon: IconSettings, label: 'Settings' },
  ];
  return (
    <aside className="sidebar" data-style={sidebarStyle}>
      <div className="brand" title="OMNIMETRIX">
        <IconBolt size={18} stroke={2.2} style={{ color: 'white' }} />
      </div>
      <div className="nav-items">
        {items.map((it) => {
          const Icn = it.icon;
          const isActive = active === it.id;
          return (
            <button
              key={it.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onChange(it.id)}
              aria-label={it.label}
              title={it.label}
            >
              <Icn size={19} stroke={isActive ? 2.1 : 1.75} />
              {it.badge > 0 && <span className="badge-dot" />}
            </button>
          );
        })}
      </div>
      <div className="spacer" />
      <button className="user" title="Matthew Firth">MF</button>
    </aside>
  );
}

/* ───────────────────────── Topbar ───────────────────────── */

function Topbar({ searchValue, setSearchValue }) {
  return (
    <header className="topbar">
      <div className="logo">
        <div className="logo-mark">
          <IconBolt size={17} stroke={2.4} style={{ color: '#0A0B0F' }} />
        </div>
        <div className="logo-text">
          <span className="name">OMNIMETRIX</span>
          <span className="sub">Global Monitoring · Control</span>
        </div>
      </div>
      <span className="pill pill-express">Express View</span>

      <div className="divider-v" />

      <div className="search">
        <span className="icon-left"><IconSearch size={15} /></span>
        <input
          placeholder="Search generators, alerts, properties…"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <span className="kbd">⌘K</span>
      </div>

      <div className="top-actions">
        <span className="sync-chip" title="All systems synced">
          <span className="dot" />
          Synced
        </span>
        <button className="assist-pill" title="Omni Assist — AI insights">
          <span className="assist-dot" />
          <IconSparkles size={13} />
          Omni Assist
        </button>
        <button className="icon-btn" aria-label="Notifications">
          <IconBell size={16} />
          <span className="notif-dot" />
        </button>
        <button className="profile-chip" aria-label="Profile">
          <div className="name-block">
            <span className="name">Matthew Firth</span>
            <span className="role">Owner · 4 sites</span>
          </div>
          <div className="avatar">MF</div>
        </button>
      </div>
    </header>
  );
}

/* ───────────────────────── KPI strip ───────────────────────── */

function KpiCard({ tone, icon, value, label, delta, alarmPulse }) {
  const Icn = icon;
  return (
    <div className={`kpi kpi--${tone} ${alarmPulse ? 'attention' : ''}`}>
      <div className="icon-tile"><Icn size={20} /></div>
      <div>
        <div className="num"><span className="accent tnum">{value}</span></div>
        <div className="lbl">{label}</div>
      </div>
      {delta && <span className="delta">{delta}</span>}
    </div>
  );
}

function KpiStrip({ stats, alarmAnimation }) {
  return (
    <div className="kpi-grid">
      <KpiCard tone="total" icon={IconBolt} value={stats.total} label="Total Units" delta="All Sites" />
      <KpiCard tone="running" icon={IconPlay} value={stats.running} label="Running" delta="Healthy" />
      <KpiCard tone="alarm" icon={IconAlert} value={stats.alarm} label="In Alarm" delta="Action needed" alarmPulse={stats.alarm > 0 && alarmAnimation} />
      <KpiCard tone="offline" icon={IconWifiOff} value={stats.offline} label="Offline" delta="No comms" />
    </div>
  );
}

/* ───────────────────────── Filter bar ───────────────────────── */

function FilterBar({ property, view, setView, search, setSearch }) {
  return (
    <div className="filterbar">
      <button className="select-btn" title="Property selector">
        <IconHome size={15} />
        <span className="lbl">Property</span>
        <span>{property}</span>
        <IconChevDown size={14} className="caret" />
      </button>

      <div className="search-inline">
        <span className="icon-left"><IconSearch size={14} /></span>
        <input placeholder="Search units…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="view-toggle" role="tablist">
        <button className={view === 'cards' ? 'active' : ''} onClick={() => setView('cards')}>
          <IconGrid size={13} /> Cards
        </button>
        <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>
          <IconList size={13} /> List
        </button>
      </div>

      <div style={{ flex: 1 }} />

      <button className="btn btn-ghost btn-sm">
        <IconFilter size={14} /> Filters
      </button>
      <button className="btn btn-primary btn-sm">
        <IconBell size={14} /> Configure Alerts
      </button>
    </div>
  );
}

/* ───────────────────────── List header ───────────────────────── */

function ListHeader() {
  return (
    <div className="gen-row header">
      <div>ID</div>
      <div>Generator</div>
      <div>Status</div>
      <div>Battery</div>
      <div>RPM</div>
      <div>Fuel</div>
      <div>Run Hours</div>
      <div></div>
    </div>
  );
}

/* ───────────────────────── App ───────────────────────── */

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [active, setActive] = useState('dashboard');
  const [view, setView] = useState('cards');
  const [search, setSearch] = useState('');
  const [topSearch, setTopSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return GENERATORS;
    return GENERATORS.filter((g) =>
      g.name.toLowerCase().includes(q) ||
      g.id.includes(q) ||
      g.spec.toLowerCase().includes(q)
    );
  }, [search]);

  const stats = useMemo(() => ({
    total: GENERATORS.length,
    running: GENERATORS.filter((g) => g.status === 'running').length,
    alarm: GENERATORS.filter((g) => g.status === 'alarm').length,
    offline: GENERATORS.filter((g) => g.status === 'offline').length,
  }), []);

  const handleAction = (action, g) => {
    console.log('action:', action, g.id);
  };

  const densityClass = `density-${t.density}`;
  const accentClass = `accent-${t.accentIntensity}`;
  const ambientClass = t.showAmbientGlow ? 'ambient-on' : 'ambient-off';

  // Apply intensity tweak as CSS vars on root
  useEffect(() => {
    const root = document.documentElement;
    if (t.accentIntensity === 'subtle') {
      root.style.setProperty('--brand-red-glow', 'rgba(229, 57, 53, 0.18)');
      root.style.setProperty('--ok-glow', 'rgba(52, 211, 153, 0.18)');
      root.style.setProperty('--alarm-glow', 'rgba(255, 90, 90, 0.20)');
    } else if (t.accentIntensity === 'vivid') {
      root.style.setProperty('--brand-red-glow', 'rgba(229, 57, 53, 0.50)');
      root.style.setProperty('--ok-glow', 'rgba(52, 211, 153, 0.45)');
      root.style.setProperty('--alarm-glow', 'rgba(255, 90, 90, 0.55)');
    } else {
      root.style.setProperty('--brand-red-glow', 'rgba(229, 57, 53, 0.32)');
      root.style.setProperty('--ok-glow', 'rgba(52, 211, 153, 0.28)');
      root.style.setProperty('--alarm-glow', 'rgba(255, 90, 90, 0.35)');
    }
  }, [t.accentIntensity]);

  return (
    <div className={`app ${densityClass} ${accentClass} ${ambientClass}`}>
      <Sidebar
        active={active}
        onChange={setActive}
        alertCount={stats.alarm}
        sidebarStyle={t.sidebarStyle}
      />

      <main className="main">
        <Topbar searchValue={topSearch} setSearchValue={setTopSearch} />

        <div className="page-head">
          <div>
            <h1>Site Overview</h1>
            <div className="sub">4 generators across Johnson Residence · Real-time monitoring</div>
          </div>
          <div className="right">
            <IconRefresh size={14} />
            <span>Last refresh 12 sec ago</span>
          </div>
        </div>

        <KpiStrip stats={stats} alarmAnimation={t.alarmAnimation} />

        <FilterBar
          property="Johnson Residence"
          view={view}
          setView={setView}
          search={search}
          setSearch={setSearch}
        />

        {view === 'cards' ? (
          <div className="gen-grid">
            {filtered.map((g) => (
              <GeneratorCard key={g.id} g={g} onAction={handleAction} />
            ))}
          </div>
        ) : (
          <div className="gen-list">
            <ListHeader />
            {filtered.map((g) => (
              <GeneratorRow key={g.id} g={g} onAction={handleAction} />
            ))}
          </div>
        )}

        <div className="footnote">
          Express View is optimized for small fleets.
          <a href="#full">Switch to Full OV2 Dashboard →</a>
        </div>
      </main>

      <TweaksPanel>
        <TweakSection label="Density" />
        <TweakRadio
          label="Card density"
          value={t.density}
          options={['compact', 'regular', 'comfy']}
          onChange={(v) => setTweak('density', v)}
        />
        <TweakSection label="Visual treatment" />
        <TweakRadio
          label="Accent intensity"
          value={t.accentIntensity}
          options={['subtle', 'balanced', 'vivid']}
          onChange={(v) => setTweak('accentIntensity', v)}
        />
        <TweakToggle
          label="Ambient card glow"
          value={t.showAmbientGlow}
          onChange={(v) => setTweak('showAmbientGlow', v)}
        />
        <TweakToggle
          label="Alarm KPI pulse"
          value={t.alarmAnimation}
          onChange={(v) => setTweak('alarmAnimation', v)}
        />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
