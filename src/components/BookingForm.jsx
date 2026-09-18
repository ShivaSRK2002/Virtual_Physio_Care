import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import "./BookingForm.css";

const SERVICE_TYPE_LABELS = {
  online: "Online Video Consultation",
  "home-visit": "In-Home Visit (Chennai)",
};

const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];

const SERVICE_OPTIONS = [
  "Online Video Consultation",
  "In-Home Visit (Chennai)",
  "Weight Loss & Strength Training Fitness",
];

const FIELD_NAMES = ["fullName", "email", "phone", "country", "age", "gender", "serviceType", "message"];

const REQUIRED_MESSAGES = {
  fullName: "Please enter your full name.",
  email: "Please enter your email address.",
  phone: "Please enter your phone or WhatsApp number.",
  country: "Please enter your country.",
  age: "Please enter your age.",
  gender: "Please select your gender.",
  serviceType: "Please select a service type.",
};

const MAX_MESSAGE_LENGTH = 500;

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

function digitsOnly(value) {
  return String(value || "").replaceAll(/\D/g, "");
}

function isLikelyEmail(value) {
  const email = String(value || "").trim();
  if (!email || email.includes(" ")) {
    return false;
  }

  const atIndex = email.indexOf("@");
  const lastAtIndex = email.lastIndexOf("@");
  if (atIndex <= 0 || atIndex !== lastAtIndex) {
    return false;
  }

  const domain = email.slice(atIndex + 1);
  const dotIndex = domain.indexOf(".");
  return dotIndex > 0 && dotIndex < domain.length - 1;
}

async function postBookingForm(formData) {
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
    const error = new Error(message || "Unable to submit your request right now.");
    if (result.fieldErrors && typeof result.fieldErrors === "object") {
      error.fieldErrors = result.fieldErrors;
    }
    throw error;
  }

  return result;
}

const FIELD_VALIDATORS = {
  fullName: (value) => (value.length >= 2 ? "" : "Full name should be at least 2 characters."),
  email: (value) => (isLikelyEmail(value) ? "" : "Please enter a valid email address."),
  phone: (value) => {
    const digits = digitsOnly(value);
    return digits.length >= 8 && digits.length <= 15 ? "" : "Phone number should contain 8 to 15 digits.";
  },
  country: (value) => (value.length >= 2 ? "" : "Country name is too short."),
  age: (value) => {
    const age = Number(value);
    return Number.isInteger(age) && age >= 1 && age <= 120
      ? ""
      : "Please enter a valid age between 1 and 120.";
  },
  gender: (value) => (GENDER_OPTIONS.includes(value) ? "" : "Please select a valid gender option."),
  serviceType: (value) =>
    SERVICE_OPTIONS.includes(value) ? "" : "Please select a valid service type.",
  message: (value) =>
    value.length <= MAX_MESSAGE_LENGTH ? "" : `Message should be within ${MAX_MESSAGE_LENGTH} characters.`,
};

function getErrorId(name) {
  return `${name}-error`;
}

function validateField(name, value) {
  const trimmed = String(value || "").trim();

  if (name !== "message" && !trimmed) {
    return REQUIRED_MESSAGES[name] || "This field is required.";
  }

  const validator = FIELD_VALIDATORS[name];
  return validator ? validator(trimmed) : "";
}

function validateForm(formData) {
  const errors = {};

  for (const fieldName of FIELD_NAMES) {
    const error = validateField(fieldName, formData[fieldName]);
    if (error) {
      errors[fieldName] = error;
    }
  }

  return errors;
}

function FieldError({ name, error }) {
  if (!error) {
    return null;
  }

  return (
    <span id={getErrorId(name)} className="booking-field-error">
      {error}
    </span>
  );
}

function BookingGridFields({ formData, fieldErrors, onChange, onBlur }) {
  return (
    <div className="booking-form-grid">
      <label className="booking-field">
        <span>Full Name</span>
        <input
          type="text"
          name="fullName"
          autoComplete="name"
          value={formData.fullName}
          onChange={onChange}
          onBlur={onBlur}
          className={fieldErrors.fullName ? "is-invalid" : ""}
          aria-invalid={Boolean(fieldErrors.fullName)}
          aria-describedby={fieldErrors.fullName ? getErrorId("fullName") : undefined}
          required
        />
        <FieldError name="fullName" error={fieldErrors.fullName} />
      </label>

      <label className="booking-field">
        <span>Email</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={onChange}
          onBlur={onBlur}
          className={fieldErrors.email ? "is-invalid" : ""}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? getErrorId("email") : undefined}
          required
        />
        <FieldError name="email" error={fieldErrors.email} />
      </label>

      <label className="booking-field">
        <span>Phone / WhatsApp</span>
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          value={formData.phone}
          onChange={onChange}
          onBlur={onBlur}
          className={fieldErrors.phone ? "is-invalid" : ""}
          aria-invalid={Boolean(fieldErrors.phone)}
          aria-describedby={fieldErrors.phone ? getErrorId("phone") : undefined}
          required
        />
        <FieldError name="phone" error={fieldErrors.phone} />
      </label>

      <label className="booking-field">
        <span>Country</span>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={onChange}
          onBlur={onBlur}
          className={fieldErrors.country ? "is-invalid" : ""}
          aria-invalid={Boolean(fieldErrors.country)}
          aria-describedby={fieldErrors.country ? getErrorId("country") : undefined}
          required
        />
        <FieldError name="country" error={fieldErrors.country} />
      </label>

      <label className="booking-field">
        <span>Age</span>
        <input
          type="number"
          name="age"
          min="1"
          max="120"
          value={formData.age}
          onChange={onChange}
          onBlur={onBlur}
          className={fieldErrors.age ? "is-invalid" : ""}
          aria-invalid={Boolean(fieldErrors.age)}
          aria-describedby={fieldErrors.age ? getErrorId("age") : undefined}
          required
        />
        <FieldError name="age" error={fieldErrors.age} />
      </label>

      <label className="booking-field">
        <span>Gender</span>
        <select
          name="gender"
          value={formData.gender}
          onChange={onChange}
          onBlur={onBlur}
          className={fieldErrors.gender ? "is-invalid" : ""}
          aria-invalid={Boolean(fieldErrors.gender)}
          aria-describedby={fieldErrors.gender ? getErrorId("gender") : undefined}
          required
        >
          <option value="">Select gender</option>
          {GENDER_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <FieldError name="gender" error={fieldErrors.gender} />
      </label>

      <label className="booking-field booking-field-full">
        <span>Service Type</span>
        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={onChange}
          onBlur={onBlur}
          className={fieldErrors.serviceType ? "is-invalid" : ""}
          aria-invalid={Boolean(fieldErrors.serviceType)}
          aria-describedby={fieldErrors.serviceType ? getErrorId("serviceType") : undefined}
          required
        >
          <option value="">Select a service</option>
          {SERVICE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <FieldError name="serviceType" error={fieldErrors.serviceType} />
      </label>
    </div>
  );
}

function BookingMessageField({ formData, fieldErrors, onChange, onBlur }) {
  return (
    <label className="booking-field booking-field-full">
      <span>Message (Optional)</span>
      <textarea
        name="message"
        rows={4}
        value={formData.message}
        onChange={onChange}
        onBlur={onBlur}
        className={fieldErrors.message ? "is-invalid" : ""}
        aria-invalid={Boolean(fieldErrors.message)}
        aria-describedby={fieldErrors.message ? getErrorId("message") : undefined}
        maxLength={MAX_MESSAGE_LENGTH}
        placeholder="Share any details that may help us prepare for your session."
      />
      <div className="booking-field-meta">
        <FieldError name="message" error={fieldErrors.message} />
        <span className="booking-char-count">
          {formData.message.length}/{MAX_MESSAGE_LENGTH}
        </span>
      </div>
    </label>
  );
}

export default function BookingForm({ type }) {
  const inferredServiceType = useMemo(() => SERVICE_TYPE_LABELS[type] || "", [type]);
  const [formData, setFormData] = useState(() => ({
    ...INITIAL_FORM,
    serviceType: inferredServiceType,
  }));
  const [fieldErrors, setFieldErrors] = useState({});
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
    setFieldErrors((prev) => ({
      ...prev,
      serviceType: "",
    }));
  }, [inferredServiceType]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  }

  function handleBlur(event) {
    const { name, value } = event.target;
    setFieldErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");

    const errors = validateForm(formData);
    if (Object.values(errors).some(Boolean)) {
      setFieldErrors(errors);
      const firstMessage = Object.values(errors).find(Boolean) || "Please review your details.";
      const message = `Please review the highlighted fields. ${firstMessage}`;
      setSubmitError(message);
      toast.error(message);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await postBookingForm(formData);
      toast.success(
        "Thank you. Your booking request has been submitted successfully. A confirmation email has been sent."
      );
      setFormData({
        ...INITIAL_FORM,
        serviceType: inferredServiceType,
      });
      setFieldErrors({});
    } catch (error) {
      if (error.fieldErrors && typeof error.fieldErrors === "object") {
        setFieldErrors(error.fieldErrors);
      }
      const message = error.message || "We could not submit your request right now. Please try again.";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate>
      <BookingGridFields
        formData={formData}
        fieldErrors={fieldErrors}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <BookingMessageField
        formData={formData}
        fieldErrors={fieldErrors}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {submitError && (
        <p className="booking-status booking-error" role="alert" aria-live="assertive">
          {submitError}
        </p>
      )}

      <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting Request..." : "Submit Booking Request"}
      </button>

      <p className="booking-fallback">
        By submitting this form, you consent to being contacted via phone, WhatsApp, or email regarding your
        enquiry.
      </p>
    </form>
  );
}
