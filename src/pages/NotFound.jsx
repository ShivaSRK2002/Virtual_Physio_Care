import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="page-hero" style={{ minHeight: "50vh" }}>
      <div className="container">
        <div className="eyebrow">404</div>
        <h1>Page Not Found</h1>
        <p>
          The page you're looking for doesn't exist — it may have moved, or the link may be
          out of date.
        </p>
        <div className="hero-banner-actions" style={{ marginTop: 24 }}>
          <Link to="/" className="btn btn-primary btn-lg">
            Back to Home
          </Link>
          <Link to="/contact#booking" className="btn btn-secondary btn-lg">
            Book a Free Enquiry
          </Link>
        </div>
      </div>
    </section>
  );
}
