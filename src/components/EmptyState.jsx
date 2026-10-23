function EmptyState({ onReset }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <i className="fa-solid fa-user-slash"></i>
      </div>
      <h2 className="empty-title">No matching drivers found</h2>
      <p className="empty-desc">
        Try adjusting your search terms, selecting a different city or area, or clearing active category filters.
      </p>
      {onReset && (
        <button
          type="button"
          className="btn-clear"
          style={{ marginTop: '16px', display: 'inline-flex' }}
          onClick={onReset}
        >
          <i className="fa-solid fa-rotate-left"></i>
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );
}

window.EmptyState = EmptyState;
