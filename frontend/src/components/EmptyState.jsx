/**
 * EmptyState — shown when a list has no items
 */
export default function EmptyState({ icon = '📋', title, description, action }) {
  return (
    <div className="empty-state" role="status" aria-label={title}>
      <div className="empty-state-icon" aria-hidden="true">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {action}
    </div>
  );
}
