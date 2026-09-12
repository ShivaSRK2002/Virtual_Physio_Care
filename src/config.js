// ---------------------------------------------------------------------------
// Site-wide configuration. Edit the values below to update contact details
// and the booking form embed without touching component code.
// ---------------------------------------------------------------------------

// 1. Create a Google Form with fields like: Name, Email, Phone/WhatsApp,
//    Country, Concern/Injury, Preferred Date & Time, Message.
// 2. In the Form, click Send -> the "<>" embed icon -> copy the src URL of
//    the generated <iframe> (it looks like https://docs.google.com/forms/d/e/XXXX/viewform?embedded=true).
// 3. Paste that URL below. Responses will land in the linked Google Sheet
//    (Responses tab -> click the green Sheets icon to create one).
export const GOOGLE_FORM_EMBED_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSc9Tg-SXs-Ql6iHwOGZIV8RNLluaHR5QPAYKVXKp7Gk3WFuGA/viewform?embedded=true";

// Fallback / "open in new tab" link (same form, without ?embedded=true).
export const GOOGLE_FORM_LINK =
  "https://docs.google.com/forms/d/e/1FAIpQLSc9Tg-SXs-Ql6iHwOGZIV8RNLluaHR5QPAYKVXKp7Gk3WFuGA/viewform";

export const CONTACT = {
  phoneIndia: "+91 96295 19420",
  whatsapp: "https://wa.me/919629519420",
  email: "Virtualphysiocare@gmail.com",
  hoursIndia: "Mon – Sat, 8:00 AM – 8:00 PM IST",
  hoursInternational: "By appointment, across time zones",
  // TODO: replace with your real Instagram handle once you have one.
  instagram: "https://instagram.com/virtualphysiocare",
};

// ---------------------------------------------------------------------------
// Optional: pre-fill the "which service?" question in the Google Form based
// on which button a visitor clicked (Online Video Consultation vs. Home
// Visit). This needs one extra one-time step in Google Forms:
//
// 1. Add a question to your form, e.g. "Which service are you interested in?"
//    with options "Online Video Consultation" and "In-Home Visit (Chennai)".
// 2. In the form editor, click the ⋮ menu → "Get pre-filled link".
// 3. Fill in that question with "Online Video Consultation", fill in dummy
//    values for anything required, then click "Get link". Copy the long URL.
// 4. In that URL, find the parameter that looks like entry.123456789=Online...
//    — the number after "entry." is the field's ID. Paste it below.
// 5. Repeat for "In-Home Visit (Chennai)" if the ID differs (it won't).
//
// Until you fill this in, the buttons still work fine — they'll just open
// the form without anything pre-selected.
export const GOOGLE_FORM_SERVICE_TYPE_ENTRY_ID = ""; // e.g. "123456789"
export const GOOGLE_FORM_SERVICE_TYPE_VALUES = {
  online: "Online Video Consultation",
  "home-visit": "In-Home Visit (Chennai)",
};

// Builds the embeddable form URL, pre-filling the service-type question when
// GOOGLE_FORM_SERVICE_TYPE_ENTRY_ID is configured and a valid `type` is given.
export function getBookingFormUrl(type) {
  const value = GOOGLE_FORM_SERVICE_TYPE_VALUES[type];
  if (!GOOGLE_FORM_SERVICE_TYPE_ENTRY_ID || !value) {
    return GOOGLE_FORM_EMBED_URL;
  }
  const separator = GOOGLE_FORM_EMBED_URL.includes("?") ? "&" : "?";
  return `${GOOGLE_FORM_EMBED_URL}${separator}entry.${GOOGLE_FORM_SERVICE_TYPE_ENTRY_ID}=${encodeURIComponent(value)}`;
}
