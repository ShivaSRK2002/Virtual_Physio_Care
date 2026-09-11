import { CONTACT } from "../config";
import "./PrivacyPolicy.css";

export default function PrivacyPolicy() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Legal</div>
          <h1>Privacy Policy</h1>
          <p>Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
      </section>

      <section className="section">
        <div className="container policy-content">
          <p>
            Virtual Physio Care ("we", "us", "our") provides online physiotherapy video
            consultations and in-home physiotherapy visits. This Privacy Policy explains what
            information we collect when you use this website or submit an enquiry, how we use
            it, and the choices you have.
          </p>

          <h2>Information We Collect</h2>
          <p>When you submit an enquiry through our booking form, we collect:</p>
          <ul>
            <li>Your name and contact details (email, phone/WhatsApp number)</li>
            <li>Your country or city of residence</li>
            <li>Details about your condition or reason for enquiry, which you choose to share</li>
            <li>Your preferred date and time for a consultation</li>
          </ul>
          <p>
            This information is collected directly through a Google Form embedded on our
            Contact page, and stored in a Google Sheet accessible only to our team. We do not
            use cookies for advertising tracking on this website at this time.
          </p>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>To respond to your enquiry and schedule a consultation or home visit</li>
            <li>To provide physiotherapy care, including treatment plans and follow-ups</li>
            <li>To contact you via phone, email, or WhatsApp regarding your enquiry or session</li>
            <li>To improve our services based on aggregated, non-identifying feedback</li>
          </ul>
          <p>
            We do not sell your personal information. We do not share your health-related
            information with third parties except where necessary to provide your care (for
            example, a therapist assigned to your case) or where required by law.
          </p>

          <h2>Data Storage & Security</h2>
          <p>
            Enquiry data is stored using Google's infrastructure (Google Forms and Google
            Sheets), which applies Google's own security and access controls. We limit access
            to this data to authorised staff involved in scheduling and providing your care.
          </p>

          <h2>Data Retention</h2>
          <p>
            We retain enquiry and patient information for as long as necessary to provide care,
            respond to your enquiry, and meet reasonable record-keeping and legal obligations.
            You may request deletion of your information at any time (see "Your Rights" below).
          </p>

          <h2>Your Rights</h2>
          <p>You can contact us at any time to:</p>
          <ul>
            <li>Request a copy of the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your information, subject to any legal record-keeping requirements</li>
            <li>Withdraw consent to be contacted for non-essential communications</li>
          </ul>
          <p>
            To make any of these requests, email us at{" "}
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            Our booking form is provided by Google Forms, and our website may embed a Google
            Maps view of our Chennai service area. These third-party services are governed by
            their own privacy policies (see{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
              Google's Privacy Policy
            </a>
            ).
          </p>

          <h2>Medical Disclaimer</h2>
          <p>
            Virtual Physio Care provides physiotherapy consultation and treatment guidance. Our
            services are not a substitute for emergency medical care. If you are experiencing a
            medical emergency, please contact your local emergency services immediately.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this
            page with an updated "last updated" date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or how your information is handled,
            contact us at <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> or{" "}
            {CONTACT.phoneIndia}.
          </p>

          <p className="policy-note">
            Note: this policy is a general template intended to reflect how this website
            currently operates. It is not a substitute for legal advice — please have it
            reviewed by a qualified professional to ensure it fully meets applicable data
            protection and healthcare regulations in your jurisdiction before running paid
            advertising or handling patient data at scale.
          </p>
        </div>
      </section>
    </>
  );
}
