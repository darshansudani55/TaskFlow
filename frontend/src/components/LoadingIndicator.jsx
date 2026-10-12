/**
 * LoadingIndicator — centered spinner shown during API requests
 */
export default function LoadingIndicator({ message = 'Loading...' }) {
  return (
    <div className="loading-wrapper" role="status" aria-label={message}>
      <div className="spinner" aria-hidden="true" />
      <p className="loading-text">{message}</p>
    </div>
  );
}
