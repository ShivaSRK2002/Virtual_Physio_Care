import { Link } from "react-router-dom";
import { CONTACT } from "../config";
import logo from "../assets/images/logo.jpg";
import SocialIcons from "./SocialIcons";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col">
          <div className="footer-logo">
            <img src={logo} alt="Virtual Physio Care logo" />
          </div>
          <p>
            Certified online physiotherapy for patients in India and abroad —
            accessible, affordable, and convenient care from wherever you are.
          </p>
          <SocialIcons />
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <Link to="/about">About Us</Link>
          <Link to="/services">Services</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/contact#booking">Contact / Book Now</Link>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer">
            WhatsApp: {CONTACT.phoneIndia}
          </a>
          <span>{CONTACT.hoursIndia}</span>
          <span>International: {CONTACT.hoursInternational}</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Virtual Physio Care. All rights reserved.</span>
        <Link to="/privacy-policy" className="footer-legal-link">
          Privacy Policy
        </Link>
        <span>Online physiotherapy — not a substitute for emergency medical care.</span>
      </div>
    </footer>
  );
}
