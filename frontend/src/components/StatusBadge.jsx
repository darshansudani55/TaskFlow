/**
 * StatusBadge — displays task status (Pending / Completed)
 */
export default function StatusBadge({ status }) {
  const cls = status === 'Completed' ? 'badge badge-completed' : 'badge badge-pending';
  const icon = status === 'Completed' ? '✓' : '○';
  return (
    <span className={cls} aria-label={`Status: ${status}`}>
      <span aria-hidden="true">{icon}</span>
      {status}
    </span>
  );
}
