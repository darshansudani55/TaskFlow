export default function StatisticsCard({ label, value, icon, colorClass, sub }) {
  return (
    <div className={`stat-card stat-card-${colorClass}`} role="region" aria-label={label}>
      <div className="stat-card-content">
        <p className="stat-card-label">{label}</p>
        <p className="stat-card-value">{value}</p>
        {sub && <p className="stat-card-sub">{sub}</p>}
      </div>
      <div className={`stat-card-icon stat-card-icon-${colorClass}`} aria-hidden="true">
        {icon}
      </div>
    </div>
  );
}
