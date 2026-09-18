import { google } from "googleapis";
import { Resend } from "resend";
import { CONTACT } from "../src/config.js";

const REQUIRED_FIELDS = ["fullName", "email", "phone", "country", "age", "gender", "serviceType"];
const GENDER_OPTIONS = new Set(["Male", "Female", "Other", "Prefer not to say"]);
const SERVICE_OPTIONS = new Set([
  "Online Video Consultation",
  "In-Home Visit (Chennai)",
  "Weight Loss & Strength Training Fitness",
]);
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

function getEnv(name) {
  const raw = process.env[name];
  if (!raw) {
    return "";
  }
  return String(raw).trim().replace(/^"|"$/g, "");
}

function normalizeText(value) {
  return String(value || "").trim();
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function parseBody(req) {
  if (!req.body) {
    return {};
  }
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  if (typeof req.body === "object") {
    return req.body;
  }
  return {};
}

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
  gender: (value) => (GENDER_OPTIONS.has(value) ? "" : "Please select a valid gender option."),
  serviceType: (value) =>
    SERVICE_OPTIONS.has(value) ? "" : "Please select a valid service type.",
  message: (value) =>
    value.length <= MAX_MESSAGE_LENGTH ? "" : `Message should be within ${MAX_MESSAGE_LENGTH} characters.`,
};

function validateSubmissionPayload(payload) {
  const values = {
    fullName: normalizeText(payload.fullName),
    email: normalizeText(payload.email),
    phone: normalizeText(payload.phone),
    country: normalizeText(payload.country),
    age: normalizeText(payload.age),
    gender: normalizeText(payload.gender),
    serviceType: normalizeText(payload.serviceType),
    message: normalizeText(payload.message),
  };

  const errors = {};
  for (const field of REQUIRED_FIELDS) {
    if (!values[field]) {
      errors[field] = REQUIRED_MESSAGES[field] || "This field is required.";
      continue;
    }

    const validator = FIELD_VALIDATORS[field];
    const validationError = validator ? validator(values[field]) : "";
    if (validationError) {
      errors[field] = validationError;
    }
  }

  const messageError = FIELD_VALIDATORS.message(values.message);
  if (messageError) {
    errors.message = messageError;
  }

  return errors;
}

function getMissingEnvVars() {
  const requiredEnvVars = [
    "RESEND_API_KEY",
    "RESEND_FROM_EMAIL",
    "CLINIC_NOTIFICATION_EMAIL",
    "GOOGLE_SHEET_ID",
    "GOOGLE_SERVICE_ACCOUNT_EMAIL",
    "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
  ];
  return requiredEnvVars.filter((name) => !getEnv(name));
}

function getErrorDetails(error) {
  if (!error) {
    return "Unknown error";
  }
  if (typeof error === "string") {
    return error;
  }

  const apiMessage = error?.response?.data?.error?.message;
  if (apiMessage) {
    return apiMessage;
  }

  if (error.message) {
    return error.message;
  }

  return "Unknown error";
}

function buildSubmission(payload) {
  return {
    id: `BOOK-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    fullName: normalizeText(payload.fullName),
    email: normalizeText(payload.email).toLowerCase(),
    phone: normalizeText(payload.phone),
    country: normalizeText(payload.country),
    age: normalizeText(payload.age),
    gender: normalizeText(payload.gender),
    serviceType: normalizeText(payload.serviceType),
    message: normalizeText(payload.message),
  };
}

function formatSubmittedAt(isoString) {
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) {
      return isoString;
    }
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }).format(date);
  } catch {
    return isoString;
  }
}

const COUNTRY_DIAL_CODES = {
  india: "+91",
  usa: "+1",
  "united states": "+1",
  "united states of america": "+1",
  canada: "+1",
  uk: "+44",
  "united kingdom": "+44",
  england: "+44",
  scotland: "+44",
  wales: "+44",
  ireland: "+353",
  australia: "+61",
  singapore: "+65",
  malaysia: "+60",
  uae: "+971",
  "united arab emirates": "+971",
  qatar: "+974",
  kuwait: "+965",
  oman: "+968",
  "saudi arabia": "+966",
  germany: "+49",
  france: "+33",
  italy: "+39",
  spain: "+34",
  "south africa": "+27",
  "new zealand": "+64",
};

function countryToDialCode(country) {
  const key = normalizeText(country).toLowerCase();
  return COUNTRY_DIAL_CODES[key] || "";
}

function toPatientContactLinks(phone, country) {
  const rawPhone = normalizeText(phone);
  const compact = rawPhone.replaceAll(/[^\d+]/g, "");

  let e164 = "";
  if (compact.startsWith("+")) {
    const digits = compact.slice(1).replaceAll(/\D/g, "");
    e164 = digits ? `+${digits}` : "";
  } else if (compact.startsWith("00")) {
    const digits = compact.slice(2).replaceAll(/\D/g, "");
    e164 = digits ? `+${digits}` : "";
  } else {
    const localDigits = compact.replaceAll(/\D/g, "").replace(/^0+/, "");
    const dialCode = countryToDialCode(country);
    if (dialCode && localDigits) {
      e164 = `${dialCode}${localDigits}`;
    } else if (localDigits) {
      e164 = `+${localDigits}`;
    }
  }

  const whatsappDigits = e164.replaceAll(/\D/g, "");
  return {
    e164,
    telHref: e164 ? `tel:${e164}` : "",
    whatsappHref: whatsappDigits ? `https://wa.me/${whatsappDigits}` : "",
  };
}

async function appendBookingToSheet(submission) {
  const serviceAccountEmail = getEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = getEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY").replaceAll(String.raw`\n`, "\n");

  const auth = new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const sheetName = getEnv("GOOGLE_BOOKING_SHEET_NAME") || "Bookings";

  const values = [
    [
      submission.id,
      submission.submittedAt,
      submission.fullName,
      submission.email,
      submission.phone,
      submission.country,
      submission.age,
      submission.gender,
      submission.serviceType,
      submission.message,
    ],
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: getEnv("GOOGLE_SHEET_ID"),
    range: `${sheetName}!A1`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values },
  });
}

async function sendBookingEmails(submission) {
  const resend = new Resend(getEnv("RESEND_API_KEY"));
  const fromEmail = getEnv("RESEND_FROM_EMAIL");
  const clinicEmail = getEnv("CLINIC_NOTIFICATION_EMAIL");

  const supportPhoneRaw = CONTACT.phoneIndia || "Not available";
  const supportPhone = escapeHtml(supportPhoneRaw);
  const supportPhoneHref = `tel:${supportPhoneRaw.replaceAll(" ", "")}`;
  const supportEmailRaw = CONTACT.email || "Not available";
  const supportEmail = escapeHtml(supportEmailRaw);
  const supportEmailHref = `mailto:${encodeURIComponent(supportEmailRaw)}`;
  const patientContacts = toPatientContactLinks(submission.phone, submission.country);

  const fullName = escapeHtml(submission.fullName);
  const customerEmailAddress = escapeHtml(submission.email);
  const customerPhone = escapeHtml(submission.phone);
  const country = escapeHtml(submission.country);
  const age = escapeHtml(submission.age);
  const gender = escapeHtml(submission.gender);
  const serviceType = escapeHtml(submission.serviceType);
  const message = escapeHtml(submission.message || "Not provided");
  const submittedAtDisplay = escapeHtml(formatSubmittedAt(submission.submittedAt));
  const submissionId = escapeHtml(submission.id);

  const customerHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e2540; max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e6e6fb; border-radius: 12px; overflow: hidden;">
      <div style="padding: 16px 20px; background: #f2f5ff; border-bottom: 1px solid #e6e6fb;">
        <p style="margin: 0; font-size: 13px; color: #2c46b0; font-weight: 700; letter-spacing: 0.3px;">VIRTUAL PHYSIO CARE</p>
        <h2 style="margin: 6px 0 0; color: #1e2540; font-size: 22px;">Booking Request Confirmation</h2>
      </div>

      <div style="padding: 20px;">
        <p style="margin: 0 0 12px;">Hello ${fullName},</p>
        <p style="margin: 0 0 14px;">Thank you for your booking enquiry. We have received your request successfully, and our team will contact you shortly to confirm your session timing and next steps.</p>

        <div style="background: #f9faff; border: 1px solid #e6e6fb; border-radius: 10px; padding: 14px; margin: 16px 0;">
          <p style="margin: 0 0 8px;"><strong>Reference ID:</strong> ${submissionId}</p>
          <p style="margin: 0 0 8px;"><strong>Service:</strong> ${serviceType}</p>
          <p style="margin: 0;"><strong>Submitted On:</strong> ${submittedAtDisplay}</p>
        </div>

        <p style="margin: 0 0 8px;"><strong>What happens next:</strong></p>
        <ul style="margin: 0 0 16px 18px; padding: 0;">
          <li>Our team reviews your request.</li>
          <li>We contact you to confirm your consultation details.</li>
          <li>Your session plan is initiated.</li>
        </ul>

        <p style="margin: 0 0 8px;"><strong>For any queries, contact us:</strong></p>
        <p style="margin: 0;">Phone/WhatsApp: <a href="${supportPhoneHref}" style="color: #2c46b0; text-decoration: none;">${supportPhone}</a></p>
        <p style="margin: 4px 0 16px;">Email: <a href="${supportEmailHref}" style="color: #2c46b0; text-decoration: none;">${supportEmail}</a></p>

        <p style="margin: 0;">Regards,<br />Virtual Physio Care Team</p>
      </div>

      <div style="padding: 12px 20px; border-top: 1px solid #e6e6fb; background: #fcfcff; font-size: 12px; color: #6b7390;">
        This is an automated confirmation email for your recent enquiry.
      </div>
    </div>
  `;

  const customerText = [
    "Booking Request Confirmation | Virtual Physio Care",
    "",
    `Hello ${submission.fullName},`,
    "",
    "Thank you for your booking enquiry. We have received your request successfully.",
    "Our team will contact you shortly to confirm your session details and next steps.",
    "",
    `Reference ID: ${submission.id}`,
    `Service: ${submission.serviceType}`,
    `Submitted On: ${formatSubmittedAt(submission.submittedAt)}`,
    "",
    "What happens next:",
    "1) Our team reviews your request",
    "2) We contact you to confirm your consultation details",
    "3) Your session plan is initiated",
    "",
    `For any queries, call/WhatsApp: ${CONTACT.phoneIndia}`,
    `For any queries, email: ${supportEmailRaw}`,
    "",
    "Regards,",
    "Virtual Physio Care Team",
  ].join("\n");

  const quickEmailPatient = `<a href="mailto:${encodeURIComponent(submission.email)}" style="display: inline-block; margin-right: 8px; margin-top: 8px; padding: 8px 12px; background: #2c46b0; color: #fff; text-decoration: none; border-radius: 8px; font-size: 13px;">Email Patient</a>`;
  const quickCallPatient = patientContacts.telHref
    ? `<a href="${escapeHtml(patientContacts.telHref)}" style="display: inline-block; margin-right: 8px; margin-top: 8px; padding: 8px 12px; background: #0b7a4b; color: #fff; text-decoration: none; border-radius: 8px; font-size: 13px;">Call Patient</a>`
    : "";
  const quickWhatsappPatient = patientContacts.whatsappHref
    ? `<a href="${escapeHtml(patientContacts.whatsappHref)}" style="display: inline-block; margin-right: 8px; margin-top: 8px; padding: 8px 12px; background: #25d366; color: #fff; text-decoration: none; border-radius: 8px; font-size: 13px;">WhatsApp Patient</a>`
    : "";

  const clinicHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e2540; max-width: 720px; margin: 0 auto; background: #ffffff; border: 1px solid #e6e6fb; border-radius: 12px; overflow: hidden;">
      <div style="padding: 16px 20px; background: #f2f5ff; border-bottom: 1px solid #e6e6fb;">
        <p style="margin: 0; font-size: 13px; color: #2c46b0; font-weight: 700; letter-spacing: 0.3px;">VIRTUAL PHYSIO CARE</p>
        <h2 style="margin: 6px 0 0; color: #1e2540; font-size: 22px;">New Booking Enquiry</h2>
      </div>

      <div style="padding: 20px;">
        <p style="margin: 0 0 8px;"><strong>Reference ID:</strong> ${submissionId}</p>
        <p style="margin: 0 0 14px;"><strong>Submitted On:</strong> ${submittedAtDisplay}</p>

        <div style="margin: 0 0 14px;">
          ${quickEmailPatient}
          ${quickCallPatient}
          ${quickWhatsappPatient}
        </div>

        <table style="width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #e6e6fb; border-radius: 10px; overflow: hidden;">
          <tbody>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eef0ff; width: 35%;"><strong>Name</strong></td><td style="padding: 10px; border-bottom: 1px solid #eef0ff;">${fullName}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eef0ff;"><strong>Email</strong></td><td style="padding: 10px; border-bottom: 1px solid #eef0ff;">${customerEmailAddress}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eef0ff;"><strong>Phone</strong></td><td style="padding: 10px; border-bottom: 1px solid #eef0ff;">${customerPhone}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eef0ff;"><strong>Country</strong></td><td style="padding: 10px; border-bottom: 1px solid #eef0ff;">${country}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eef0ff;"><strong>Age</strong></td><td style="padding: 10px; border-bottom: 1px solid #eef0ff;">${age}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eef0ff;"><strong>Gender</strong></td><td style="padding: 10px; border-bottom: 1px solid #eef0ff;">${gender}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eef0ff;"><strong>Service</strong></td><td style="padding: 10px; border-bottom: 1px solid #eef0ff;">${serviceType}</td></tr>
            <tr><td style="padding: 10px;"><strong>Message</strong></td><td style="padding: 10px;">${message}</td></tr>
          </tbody>
        </table>
      </div>

      <div style="padding: 12px 20px; border-top: 1px solid #e6e6fb; background: #fcfcff; font-size: 12px; color: #6b7390;">
        This notification was generated from the Virtual Physio Care website booking form.
      </div>
    </div>
  `;

  const clinicText = [
    "New Booking Enquiry | Virtual Physio Care",
    "",
    `Reference ID: ${submission.id}`,
    `Submitted On: ${formatSubmittedAt(submission.submittedAt)}`,
    `Name: ${submission.fullName}`,
    `Email: ${submission.email}`,
    `Phone: ${submission.phone}`,
    `Country: ${submission.country}`,
    `Age: ${submission.age}`,
    `Gender: ${submission.gender}`,
    `Service: ${submission.serviceType}`,
    `Message: ${submission.message || "Not provided"}`,
    "",
    "Quick actions:",
    `Call patient: ${submission.phone}`,
    `Email patient: ${submission.email}`,
    `WhatsApp patient: ${patientContacts.whatsappHref || "Not available"}`,
  ].join("\n");

  const customerEmail = resend.emails.send({
    from: fromEmail,
    to: [submission.email],
    replyTo: [supportEmailRaw],
    subject: "Booking Request Confirmation | Virtual Physio Care",
    html: customerHtml,
    text: customerText,
  });

  const clinicNotification = resend.emails.send({
    from: fromEmail,
    to: [clinicEmail],
    replyTo: [submission.email],
    subject: `New Booking Enquiry | ${submission.fullName}`,
    html: clinicHtml,
    text: clinicText,
  });

  await Promise.all([customerEmail, clinicNotification]);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const missingEnvVars = getMissingEnvVars();
  if (missingEnvVars.length > 0) {
    return res.status(500).json({
      error: `Server is missing required environment variables: ${missingEnvVars.join(", ")}`,
    });
  }

  const payload = parseBody(req);
  const fieldErrors = validateSubmissionPayload(payload);
  const hasFieldErrors = Object.keys(fieldErrors).length > 0;
  if (hasFieldErrors) {
    const firstError = Object.values(fieldErrors)[0];
    return res.status(400).json({
      error: "Please review the highlighted fields.",
      details: firstError,
      fieldErrors,
    });
  }

  const submission = buildSubmission(payload);

  try {
    await appendBookingToSheet(submission);
  } catch (error) {
    const details = getErrorDetails(error);
    console.error("Google Sheets append failed", details, error);
    return res.status(500).json({
      error: "Could not save booking data to Google Sheets.",
      details,
    });
  }

  try {
    await sendBookingEmails(submission);
  } catch (error) {
    const details = getErrorDetails(error);
    console.error("Resend email delivery failed", details, error);
    return res.status(500).json({
      error: "Booking was saved, but confirmation email failed.",
      details,
    });
  }

  return res.status(200).json({
    ok: true,
    submissionId: submission.id,
    message: "Booking submitted successfully.",
  });
}
