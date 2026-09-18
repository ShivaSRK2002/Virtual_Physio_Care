import { google } from "googleapis";
import { Resend } from "resend";
import { CONTACT } from "../src/config.js";

const REQUIRED_FIELDS = ["fullName", "email", "phone", "country", "age", "gender", "serviceType"];

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

function getMissingFields(payload) {
  return REQUIRED_FIELDS.filter((field) => !normalizeText(payload[field]));
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
  const supportWhatsapp = CONTACT.whatsapp || "";
  const supportEmailRaw = CONTACT.email || "Not available";
  const supportEmail = escapeHtml(supportEmailRaw);
  const supportEmailHref = `mailto:${encodeURIComponent(supportEmailRaw)}`;

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

  const quickWhatsapp = supportWhatsapp
    ? `<a href="${escapeHtml(supportWhatsapp)}" style="display: inline-block; margin-right: 8px; margin-top: 8px; padding: 8px 12px; background: #25d366; color: #fff; text-decoration: none; border-radius: 8px; font-size: 13px;">WhatsApp</a>`
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
          <a href="mailto:${encodeURIComponent(submission.email)}" style="display: inline-block; margin-right: 8px; margin-top: 8px; padding: 8px 12px; background: #2c46b0; color: #fff; text-decoration: none; border-radius: 8px; font-size: 13px;">Email Patient</a>
          <a href="tel:${submission.phone.replaceAll(" ", "")}" style="display: inline-block; margin-right: 8px; margin-top: 8px; padding: 8px 12px; background: #0b7a4b; color: #fff; text-decoration: none; border-radius: 8px; font-size: 13px;">Call Patient</a>
          ${quickWhatsapp}
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
  const missingFields = getMissingFields(payload);
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Please fill all required fields: ${missingFields.join(", ")}`,
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
