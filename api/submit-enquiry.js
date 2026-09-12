import { appendRow } from "./_lib/googleSheets.js";
import { sendPatientConfirmation, sendAdminNotification } from "./_lib/mailer.js";

const TYPE_LABELS = {
  online: "Online Video Consultation",
  "home-visit": "In-Home Visit (Chennai)",
};

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || {};
  const {
    name,
    email,
    phone,
    type,
    location,
    message,
    preferredDate,
    preferredTime,
    company, // honeypot: real users never see/fill this field
  } = body;

  // Silently "succeed" for bots without doing any real work.
  if (company) {
    return res.status(200).json({ ok: true });
  }

  const trimmed = {
    name: (name || "").trim().slice(0, 200),
    email: (email || "").trim().slice(0, 200),
    phone: (phone || "").trim().slice(0, 60),
    location: (location || "").trim().slice(0, 200),
    message: (message || "").trim().slice(0, 2000),
    preferredDate: (preferredDate || "").trim().slice(0, 60),
    preferredTime: (preferredTime || "").trim().slice(0, 60),
  };

  if (!trimmed.name || !trimmed.email || !trimmed.phone || !trimmed.message) {
    return res.status(400).json({ error: "Please fill in all required fields." });
  }
  if (!isValidEmail(trimmed.email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  const typeLabel = TYPE_LABELS[type] || "Not specified";

  try {
    await appendRow([
      new Date().toISOString(),
      typeLabel,
      trimmed.name,
      trimmed.email,
      trimmed.phone,
      trimmed.location,
      trimmed.message,
      `${trimmed.preferredDate} ${trimmed.preferredTime}`.trim(),
    ]);
  } catch (err) {
    console.error("Sheets append failed:", err);
    return res.status(502).json({ error: "Could not save your enquiry. Please try again." });
  }

  // Email failures shouldn't fail the whole request — the enquiry is already
  // safely stored in the Sheet at this point.
  try {
    await sendPatientConfirmation({ to: trimmed.email, name: trimmed.name });
  } catch (err) {
    console.error("Patient confirmation email failed:", err);
  }

  try {
    await sendAdminNotification({
      subject: `New enquiry: ${trimmed.name} (${typeLabel})`,
      text: `Name: ${trimmed.name}
Email: ${trimmed.email}
Phone: ${trimmed.phone}
Type: ${typeLabel}
Location: ${trimmed.location}
Preferred date/time: ${trimmed.preferredDate} ${trimmed.preferredTime}

Message:
${trimmed.message}`,
    });
  } catch (err) {
    console.error("Admin notification email failed:", err);
  }

  return res.status(200).json({ ok: true });
}
