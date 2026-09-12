import nodemailer from "nodemailer";

let cachedTransporter;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error("Missing GMAIL_USER or GMAIL_APP_PASSWORD env vars");
  }

  cachedTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  return cachedTransporter;
}

export async function sendPatientConfirmation({ to, name }) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"Virtual Physio Care" <${process.env.GMAIL_USER}>`,
    to,
    subject: "We've received your enquiry — Virtual Physio Care",
    text: `Hi ${name},

Thank you for reaching out to Virtual Physio Care. We've received your enquiry and a member of our team will get back to you within 24 hours to confirm your session.

If your concern is urgent, feel free to reach us directly on WhatsApp.

— Virtual Physio Care
Online physiotherapy worldwide, home visits across Chennai`,
  });
}

export async function sendAdminNotification({ subject, text }) {
  const transporter = getTransporter();
  const to = process.env.ADMIN_NOTIFY_EMAIL || process.env.GMAIL_USER;
  await transporter.sendMail({
    from: `"Virtual Physio Care Website" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text,
  });
}
