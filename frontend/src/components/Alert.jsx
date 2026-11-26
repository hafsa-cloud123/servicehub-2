// type: "success" | "error" | "info"
export default function Alert({ type = 'info', children, onClose, onRetry }) {
  return (
    <div className={`alert alert-${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <span>{children}</span>
      <span className="alert-actions">
        {onRetry && (
          <button type="button" className="btn btn-small" onClick={onRetry}>Try again</button>
        )}
        {onClose && (
          <button type="button" className="alert-close" onClick={onClose} aria-label="Dismiss message">×</button>
        )}
      </span>
    </div>
  );
}
