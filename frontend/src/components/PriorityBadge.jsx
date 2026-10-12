/**
 * PriorityBadge — displays task priority (Low / Medium / High)
 */
export default function PriorityBadge({ priority }) {
  const icons = { Low: '↓', Medium: '→', High: '↑' };
  const cls = `badge badge-${priority ? priority.toLowerCase() : 'medium'}`;
  return (
    <span className={cls} aria-label={`Priority: ${priority}`}>
      <span aria-hidden="true">{icons[priority] || '→'}</span>
      {priority}
    </span>
  );
}
