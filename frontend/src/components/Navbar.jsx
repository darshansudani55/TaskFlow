export default function Navbar({ onMenuToggle }) {
  return (
    <header className="navbar" role="banner">
      <div className="navbar-brand">
        <span aria-hidden="true">T</span>
        Task<span>Flow</span>
      </div>
      <button
        className="navbar-menu-btn"
        onClick={onMenuToggle}
        aria-label="Toggle navigation menu"
        aria-expanded="false"
        id="mobile-menu-btn"
      >
        ☰
      </button>
    </header>
  );
}
