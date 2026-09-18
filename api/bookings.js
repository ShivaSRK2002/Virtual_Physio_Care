import { google } from "googleapis";
import { Resend } from "resend";

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

  const customerEmail = resend.emails.send({
    from: fromEmail,
    to: [submission.email],
    subject: "Booking request received - Virtual Physio Care",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e2540;">
        <h2 style="margin-bottom: 8px;">Hello ${submission.fullName},</h2>
        <p>Thank you for your enquiry. We have received your booking request successfully.</p>
        <p>Our team will contact you shortly to confirm your session details.</p>
        <h3 style="margin: 20px 0 8px;">Submitted details</h3>
        <ul>
          <li><strong>Age:</strong> ${submission.age}</li>
          <li><strong>Gender:</strong> ${submission.gender}</li>
          <li><strong>Service:</strong> ${submission.serviceType}</li>
        </ul>
        <p>Regards,<br />Virtual Physio Care</p>
      </div>
    `,
  });

  const clinicNotification = resend.emails.send({
    from: fromEmail,
    to: [clinicEmail],
    subject: `New booking request: ${submission.fullName}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e2540;">
        <h2 style="margin-bottom: 8px;">New booking request</h2>
        <p><strong>Submission ID:</strong> ${submission.id}</p>
        <p><strong>Submitted At:</strong> ${submission.submittedAt}</p>
        <p><strong>Name:</strong> ${submission.fullName}</p>
        <p><strong>Email:</strong> ${submission.email}</p>
        <p><strong>Phone:</strong> ${submission.phone}</p>
        <p><strong>Country:</strong> ${submission.country}</p>
        <p><strong>Age:</strong> ${submission.age}</p>
        <p><strong>Gender:</strong> ${submission.gender}</p>
        <p><strong>Service:</strong> ${submission.serviceType}</p>
        <p><strong>Message:</strong> ${submission.message || "Not provided"}</p>
      </div>
    `,
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
