import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import "./BookingForm.css";

const SERVICE_TYPE_LABELS = {
  online: "Online Video Consultation",
  "home-visit": "In-Home Visit (Chennai)",
};

const INITIAL_FORM = {
  fullName: "",
  email: "",
  phone: "",
  country: "India",
  age: "",
  gender: "",
  serviceType: "",
  message: "",
};

export default function BookingForm({ type }) {
  const inferredServiceType = useMemo(() => SERVICE_TYPE_LABELS[type] || "", [type]);
  const [formData, setFormData] = useState(() => ({
    ...INITIAL_FORM,
    serviceType: inferredServiceType,
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!inferredServiceType) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      serviceType: inferredServiceType,
    }));
  }, [inferredServiceType]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      let result = {};
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        result = await response.json().catch(() => ({}));
      } else {
        await response.text().catch(() => "");
      }

      if (!response.ok) {
        const statusFallback = `Request failed with status ${response.status}.`;
        const message = result.details ? `${result.error} (${result.details})` : result.error || statusFallback;
        throw new Error(message || "Unable to submit your request right now.");
      }

      toast.success("Booking submitted successfully. Confirmation email has been sent.");
      setFormData({
        ...INITIAL_FORM,
        serviceType: inferredServiceType,
      });
    } catch (error) {
      const message = error.message || "Something went wrong while submitting the form.";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate>
      <div className="booking-form-grid">
        <label>
          <span>Full Name</span>
          <input
            type="text"
            name="fullName"
            autoComplete="name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>Phone / WhatsApp</span>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>Country</span>
          <input type="text" name="country" value={formData.country} onChange={handleChange} required />
        </label>

        <label>
          <span>Age</span>
          <input type="number" name="age" min="1" max="120" value={formData.age} onChange={handleChange} required />
        </label>

        <label>
          <span>Gender</span>
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </label>

        <label>
          <span>Service Type</span>
          <select name="serviceType" value={formData.serviceType} onChange={handleChange} required>
            <option value="">Select a service</option>
            <option value="Online Video Consultation">Online Video Consultation</option>
            <option value="In-Home Visit (Chennai)">In-Home Visit (Chennai)</option>
            <option value="Weight Loss & Strength Training Fitness">Weight Loss & Strength Training Fitness</option>
          </select>
        </label>
      </div>

      <label>
        <span>Message (Optional)</span>
        <textarea
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us anything important for your enquiry."
        />
      </label>

      {submitError && <p className="booking-status booking-error">{submitError}</p>}

      <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Booking Request"}
      </button>

      <p className="booking-fallback">
        By submitting this form, you agree to be contacted via email or phone regarding your enquiry.
      </p>
    </form>
  );
}
