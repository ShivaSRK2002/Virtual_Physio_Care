import { useState } from "react";
import { Globe2, Home as HomeIcon, CheckCircle2 } from "lucide-react";
import { GOOGLE_FORM_LINK } from "../config";
import "./EnquiryForm.css";

const TYPE_OPTIONS = [
  { value: "online", label: "Online Video Consultation", icon: Globe2 },
  { value: "home-visit", label: "In-Home Visit (Chennai)", icon: HomeIcon },
];

const initialState = {
  name: "",
  email: "",
  phone: "",
  location: "",
  message: "",
  preferredDate: "",
  preferredTime: "",
  company: "", // honeypot
};

export default function EnquiryForm({ defaultType }) {
  const [type, setType] = useState(
    defaultType === "online" || defaultType === "home-visit" ? defaultType : "online"
  );
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const locationLabel = type === "home-visit" ? "Area in Chennai" : "Country / City";
  const locationPlaceholder =
    type === "home-visit" ? "e.g. Anna Nagar, Chennai" : "e.g. Toronto, Canada";

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const resp = await fetch("/api/submit-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type }),
      });
      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      setForm(initialState);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="enquiry-form enquiry-success">
        <CheckCircle2 size={40} strokeWidth={2} />
        <h3>Thanks — we've got your enquiry!</h3>
        <p>We'll get back to you within 24 hours to confirm your session.</p>
        <button className="btn btn-secondary" onClick={() => setStatus("idle")}>
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form className="enquiry-form" onSubmit={handleSubmit}>
      <div className="enquiry-type-row">
        {TYPE_OPTIONS.map((opt) => (
          <button
            type="button"
            key={opt.value}
            className={`enquiry-type-btn ${type === opt.value ? "active" : ""}`}
            onClick={() => setType(opt.value)}
          >
            <opt.icon size={18} strokeWidth={2} />
            {opt.label}
          </button>
        ))}
      </div>

      <div className="form-row">
        <label htmlFor="name">Full Name *</label>
        <input
          id="name"
          type="text"
          required
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          autoComplete="name"
        />
      </div>

      <div className="form-row-group">
        <div className="form-row">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="form-row">
          <label htmlFor="phone">Phone / WhatsApp *</label>
          <input
            id="phone"
            type="tel"
            required
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            autoComplete="tel"
          />
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="location">{locationLabel}</label>
        <input
          id="location"
          type="text"
          placeholder={locationPlaceholder}
          value={form.location}
          onChange={(e) => updateField("location", e.target.value)}
        />
      </div>

      <div className="form-row">
        <label htmlFor="message">Your Concern / Reason for Enquiry *</label>
        <textarea
          id="message"
          required
          rows={4}
          value={form.message}
          onChange={(e) => updateField("message", e.target.value)}
        />
      </div>

      <div className="form-row">
        <label htmlFor="preferredDate">Preferred Date &amp; Time</label>
        <input
          id="preferredDate"
          type="text"
          placeholder="e.g. Weekday evenings, or Mon 10 Mar, 6 PM IST"
          value={form.preferredDate}
          onChange={(e) => updateField("preferredDate", e.target.value)}
        />
      </div>

      {/* Honeypot field — hidden from real visitors, bots often fill every field */}
      <div className="enquiry-honeypot" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.company}
          onChange={(e) => updateField("company", e.target.value)}
        />
      </div>

      {status === "error" && (
        <p className="enquiry-error">
          {errorMessage}{" "}
          <a href={GOOGLE_FORM_LINK} target="_blank" rel="noreferrer">
            You can also submit your enquiry using our backup form
          </a>
          .
        </p>
      )}

      <button type="submit" className="btn btn-primary btn-lg" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send Free Enquiry"}
      </button>
    </form>
  );
}
