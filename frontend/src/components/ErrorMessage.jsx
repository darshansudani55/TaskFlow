/**
 * ErrorMessage — shown when an API call fails
 */
export default function ErrorMessage({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="error-message" role="alert" aria-live="assertive">
      <span className="error-message-icon" aria-hidden="true">⚠️</span>
      <div className="error-message-content">
        <p className="error-message-title">{title}</p>
        {message && <p className="error-message-text">{message}</p>}
        {onRetry && (
          <button
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '0.75rem' }}
            onClick={onRetry}
            id="error-retry-btn"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
