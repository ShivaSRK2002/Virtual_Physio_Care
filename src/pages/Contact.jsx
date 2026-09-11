import { useSearchParams } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import { CONTACT } from "../config";
import bookingCalendar from "../assets/illustrations/booking-calendar.svg";
import "./Contact.css";

const INTENT_COPY = {
  online: {
    label: "You're booking: Online Video Consultation (Worldwide)",
    hint: "Available from anywhere — we'll schedule around your local time zone.",
  },
  "home-visit": {
    label: "You're booking: In-Home Visit (Chennai)",
    hint: "Available across Chennai — let us know your area and preferred time.",
  },
};

export default function Contact() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const intent = INTENT_COPY[type];

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Contact & Booking</div>
          <h1>Book a Free Enquiry</h1>
          <p>
            Fill in the form below with your details and concern. Our team will get back to you
            within 24 hours to confirm your session.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2 contact-grid">
          <div className="contact-info">
            <h2>Reach Us Directly</h2>
            <div className="card contact-card">
              <h3>WhatsApp / Phone (India)</h3>
              <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer">
                {CONTACT.phoneIndia}
              </a>
            </div>
            <div className="card contact-card">
              <h3>Email</h3>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </div>
            <div className="card contact-card">
              <h3>Availability</h3>
              <p>{CONTACT.hoursIndia}</p>
              <p>International: {CONTACT.hoursInternational}</p>
            </div>
            <div className="card contact-card">
              <h3>Home Visits (Chennai)</h3>
              <p>
                In-home sessions available across Chennai — Anna Nagar, T Nagar, Adyar, Mylapore,
                Nungambakkam, Kilpauk, Velachery, Porur, Tambaram, and OMR / Sholinganallur.
              </p>
            </div>
            <img
              className="contact-illustration"
              src={bookingCalendar}
              alt="Calendar illustration for booking a physiotherapy session"
            />
          </div>

          <div id="booking">
            {intent && (
              <div className="booking-intent-banner">
                <strong>{intent.label}</strong>
                <span>{intent.hint}</span>
              </div>
            )}
            <BookingForm type={type} />
          </div>
        </div>
      </section>
    </>
  );
}
