import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <img src="/favicon.svg" alt="" width="28" height="28" />
          ServiceHub
        </Link>
        <nav className="nav-links" aria-label="Main">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/services" end>Services</NavLink>
          <NavLink to="/categories">Categories</NavLink>
        </nav>
        <Link to="/services/new" className="btn btn-accent">Add service</Link>
      </div>
    </header>
  );
}
