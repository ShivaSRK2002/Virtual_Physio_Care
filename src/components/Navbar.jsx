import { NavLink } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/images/logo.jpg";
import "./Navbar.css";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">
            <img src={logo} alt="" />
          </span>
          <span className="brand-name">Virtual Physio Care</span>
        </NavLink>

        <button
          className="nav-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/contact#booking" className="btn btn-primary nav-cta" onClick={() => setOpen(false)}>
            Book a Session
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
