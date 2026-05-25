// generators.jsx — Generator data + GeneratorCard / GeneratorRow components.

const GENERATORS = [
  {
    id: '1001',
    name: 'Main Residence',
    spec: '20kW Generac',
    fuel: 'Propane',
    status: 'running',
    battery: 13.4,
    rpm: 1800,
    fuelLevel: 82,
    coolant: 187,
    oilPressure: 48,
    runHours: 1247,
    liveAgo: '1 min ago',
    liveState: 'live',
    alert: null,
  },
  {
    id: '1002',
    name: 'Pool House',
    spec: '12kW Kohler',
    fuel: 'Natural Gas',
    status: 'alarm',
    battery: 12.8,
    rpm: null,
    fuelLevel: 18,
    coolant: null,
    oilPressure: null,
    runHours: 412,
    liveAgo: '5 min ago',
    liveState: 'alarm',
    alert: {
      title: 'Low Fuel Level',
      detail: '18% remaining — pressure trending down',
      ago: 'Alert sent 34 min ago',
    },
  },
  {
    id: '1003',
    name: 'Garage / Workshop',
    spec: '10kW Generac',
    fuel: 'Propane',
    status: 'standby',
    battery: 13.1,
    rpm: null,
    fuelLevel: 61,
    coolant: null,
    oilPressure: null,
    runHours: 88,
    liveAgo: '3 min ago',
    liveState: 'live',
    alert: null,
  },
  {
    id: '1042',
    name: 'Rental Property',
    spec: '14kW Kohler',
    fuel: 'Natural Gas',
    status: 'offline',
    battery: 11.6,
    rpm: null,
    fuelLevel: null,
    coolant: null,
    oilPressure: null,
    runHours: null,
    liveAgo: 'Last seen 2h ago',
    liveState: 'offline',
    alert: null,
  },
];

const STATUS_LABEL = {
  running: 'Running',
  alarm: 'Alarm',
  standby: 'Standby',
  offline: 'Offline',
};

/* ─────────── helpers ─────────── */

function fmt(v, fallback = '—') {
  return v === null || v === undefined ? fallback : v;
}

// Battery health 11.5–14.4V is normal-ish; below 12 is warning, 12–14.4 ok, >14.4 charging
function batteryState(v, status) {
  if (v === null) return 'off';
  if (status === 'offline') return 'off';
  if (v < 12) return 'warn';
  if (v < 11) return 'alarm';
  return 'ok';
}
function fuelState(v) {
  if (v === null) return 'off';
  if (v < 20) return 'alarm';
  if (v < 40) return 'warn';
  return 'ok';
}

/* ─────────── Metric tile ─────────── */

function Metric({ label, icon, value, unit, state = 'ok', percent = null, muted = false }) {
  const stateClass = muted ? 'muted' : state;
  const Icn = icon;
  return (
    <div className={`metric is-${state}`}>
      <div className="lbl">
        {Icn && <Icn size={11} />}
        <span>{label}</span>
      </div>
      <div className={`v ${stateClass} tnum`}>
        {value}
        {unit && <span className="unit">{unit}</span>}
      </div>
      {percent !== null && (
        <div className="bar"><div className="fill" style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} /></div>
      )}
    </div>
  );
}

/* ─────────── Card ─────────── */

function GeneratorCard({ g, onAction }) {
  const isOff = g.status === 'offline';
  const isAlarm = g.status === 'alarm';
  const isStandby = g.status === 'standby';

  const battState = batteryState(g.battery, g.status);
  const fuelSt = fuelState(g.fuelLevel);

  return (
    <div className={`gen-card ${g.status}`}>
      <div className="edge" />
      <div className="ambient" />

      <div className="gen-head">
        <span className="id-badge">{g.id}</span>
        <div className="titles">
          <div className="name">{g.name}</div>
          <div className="spec">
            <span>{g.spec}</span>
            <span className="sep">·</span>
            <span>{g.fuel}</span>
          </div>
        </div>
        <span className={`status-pill ${g.status}`}>
          <span className="dot" />
          {STATUS_LABEL[g.status]}
        </span>
      </div>

      {g.alert && (
        <div className="alert-strip">
          <div className="icon-wrap">
            <IconAlert size={15} />
          </div>
          <div className="copy">
            <div className="head">{g.alert.title} — {g.alert.detail}</div>
            <div className="meta">{g.alert.ago}</div>
          </div>
        </div>
      )}

      <div className="metrics">
        <Metric
          label="Battery"
          icon={IconBattery}
          value={fmt(g.battery)}
          unit={g.battery !== null ? 'V' : null}
          state={battState}
          muted={isOff}
        />
        <Metric
          label="RPM"
          icon={IconActivity}
          value={g.rpm !== null ? g.rpm.toLocaleString() : (isStandby ? 'Standby' : (isOff ? '—' : 'Not Running'))}
          state={g.rpm ? 'ok' : 'off'}
          muted={g.rpm === null}
        />
        <Metric
          label="Fuel Level"
          icon={IconDroplet}
          value={g.fuelLevel !== null ? `${g.fuelLevel}` : '—'}
          unit={g.fuelLevel !== null ? '%' : null}
          state={fuelSt}
          percent={g.fuelLevel}
          muted={g.fuelLevel === null}
        />
        <Metric
          label="Coolant"
          icon={IconThermo}
          value={g.coolant !== null ? `${g.coolant}°` : (isStandby ? 'Standby' : '—')}
          unit={g.coolant !== null ? 'F' : null}
          state={g.coolant ? 'ok' : 'off'}
          muted={g.coolant === null}
        />
        <Metric
          label="Oil Pressure"
          icon={IconGauge}
          value={g.oilPressure !== null ? g.oilPressure : (isStandby ? 'Standby' : '—')}
          unit={g.oilPressure !== null ? 'PSI' : null}
          state={g.oilPressure ? 'ok' : 'off'}
          muted={g.oilPressure === null}
        />
        <Metric
          label="Run Hours"
          icon={IconClock}
          value={g.runHours !== null ? g.runHours.toLocaleString() : '—'}
          unit={g.runHours !== null ? 'h' : null}
          state="info"
          muted={g.runHours === null}
        />
      </div>

      <div className="gen-foot">
        <span className={`live-meta ${g.liveState}`}>
          <span className="live-dot" />
          <span>{g.liveState === 'live' ? 'Live data' : g.liveState === 'alarm' ? 'Alarm active' : 'No comms'}</span>
          <span className="sep">·</span>
          <span>{g.liveAgo}</span>
        </span>
        <div className="actions">
          {isOff ? (
            <>
              <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); onAction?.('history', g); }}>
                <IconHistory size={14} /> History
              </button>
              <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onAction?.('diagnose', g); }}>
                <IconStethoscope size={14} /> Diagnose
              </button>
            </>
          ) : isAlarm ? (
            <>
              <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); onAction?.('history', g); }}>
                <IconHistory size={14} /> History
              </button>
              <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onAction?.('view-alarm', g); }}>
                <IconAlert size={14} /> View Alarm
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); onAction?.('history', g); }}>
                <IconHistory size={14} /> History
              </button>
              <button className="btn btn-soft btn-sm" onClick={(e) => { e.stopPropagation(); onAction?.('commands', g); }}>
                <IconTerminal size={14} /> Commands
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────── List row ─────────── */

function GeneratorRow({ g, onAction }) {
  const isOff = g.status === 'offline';
  const battState = batteryState(g.battery, g.status);
  const fuelSt = fuelState(g.fuelLevel);
  return (
    <div className={`gen-row ${g.status}`} onClick={() => onAction?.('open', g)}>
      <div className="row-id">#{g.id}</div>
      <div className="row-name">
        <div className="nm">{g.name}</div>
        <div className="spec">{g.spec} · {g.fuel}</div>
      </div>
      <div>
        <span className={`status-pill ${g.status}`}>
          <span className="dot" />
          {STATUS_LABEL[g.status]}
        </span>
      </div>
      <div className={`row-metric tnum ${battState}`}>
        {g.battery !== null ? <>{g.battery}<span className="unit">V</span></> : '—'}
      </div>
      <div className={`row-metric tnum ${g.rpm ? 'ok' : 'muted'}`}>
        {g.rpm !== null ? g.rpm.toLocaleString() : '—'}
      </div>
      <div className={`row-metric tnum ${fuelSt}`}>
        {g.fuelLevel !== null ? <>{g.fuelLevel}<span className="unit">%</span></> : '—'}
      </div>
      <div className={`row-metric tnum ${isOff ? 'muted' : ''}`}>
        {g.runHours !== null ? <>{g.runHours.toLocaleString()}<span className="unit">h</span></> : '—'}
      </div>
      <div className="actions" style={{ display: 'flex', gap: 6 }}>
        <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); onAction?.('history', g); }}>
          <IconHistory size={14} />
        </button>
        <button className="btn btn-soft btn-sm" onClick={(e) => { e.stopPropagation(); onAction?.('open', g); }}>
          <IconChevRight size={14} />
        </button>
      </div>
    </div>
  );
}

Object.assign(window, {
  GENERATORS, STATUS_LABEL, GeneratorCard, GeneratorRow, Metric,
});
