import { GOOGLE_FORM_LINK, getBookingFormUrl } from "../config";
import "./BookingForm.css";

export default function BookingForm({ type }) {
  const embedUrl = getBookingFormUrl(type);

  return (
    <div className="booking-form">
      <iframe title="Virtual Physio Care — Enquiry & Booking Form" src={embedUrl} loading="lazy">
        Loading…
      </iframe>
      <p className="booking-fallback">
        Form not loading?{" "}
        <a href={GOOGLE_FORM_LINK} target="_blank" rel="noreferrer">
          Open it in a new tab
        </a>
        .
      </p>
    </div>
  );
}
