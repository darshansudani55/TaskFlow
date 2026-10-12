/**
 * ConfirmationDialog — modal confirmation before destructive operations
 */
export default function ConfirmationDialog({
  isOpen,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="dialog-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-message"
    >
      <div className="dialog">
        <div className="dialog-icon" aria-hidden="true">🗑️</div>
        <h2 className="dialog-title" id="dialog-title">{title}</h2>
        {message && (
          <p className="dialog-message" id="dialog-message">{message}</p>
        )}
        <div className="dialog-actions">
          <button
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isLoading}
            id="dialog-cancel-btn"
          >
            {cancelLabel}
          </button>
          <button
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isLoading}
            id="dialog-confirm-btn"
          >
            {isLoading ? (
              <>
                <span className="spinner spinner-sm" aria-hidden="true" />
                Deleting…
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
