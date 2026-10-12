import { useState, useEffect, useCallback, createContext, useContext } from 'react';

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────
const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

// ─────────────────────────────────────────────
// Container
// ─────────────────────────────────────────────
function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Single Toast
// ─────────────────────────────────────────────
const ICONS = { success: '✅', error: '❌', info: 'ℹ️' };

function Toast({ toast, onRemove }) {
  return (
    <div
      className={`toast toast-${toast.type}${toast.exiting ? ' exit' : ''}`}
      role="alert"
      aria-live="assertive"
    >
      <span className="toast-icon" aria-hidden="true">{ICONS[toast.type]}</span>
      <span>{toast.message}</span>
      <button
        className="toast-close"
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
}
