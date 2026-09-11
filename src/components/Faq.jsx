import "./Faq.css";

const faqs = [
  {
    q: "How does an online physiotherapy session work?",
    a: "You book a free enquiry, and we schedule a video consultation at a time that suits your time zone. Your physiotherapist assesses your condition over video, explains a treatment plan, and demonstrates exercises live. You get a written plan afterward, plus follow-up sessions to track progress.",
  },
  {
    q: "Can online physiotherapy really treat my condition?",
    a: "Yes, for most musculoskeletal conditions — back and neck pain, joint pain, post-surgical rehabilitation, sports injuries, and geriatric or neurological rehabilitation — assessment, exercise prescription, and progress tracking can be done effectively over video. If a condition needs in-person hands-on treatment, we'll tell you upfront and, if you're in Chennai, offer a home visit instead.",
  },
  {
    q: "I live outside India — can I still book a session?",
    a: "Yes. Online consultations are available worldwide. We schedule around your local time zone, and sessions are held over a secure video call, so your location doesn't matter.",
  },
  {
    q: "Do you offer home visits outside Chennai?",
    a: "In-home physiotherapy visits are currently available only within Chennai (including areas like Anna Nagar, T Nagar, Adyar, Mylapore, Nungambakkam, Kilpauk, Velachery, Porur, Tambaram, and OMR/Sholinganallur). Patients outside Chennai can book an online video consultation instead.",
  },
  {
    q: "Is home visit physiotherapy suitable for elderly patients?",
    a: "Yes — home visits are especially well suited to elderly patients, those recovering from surgery, or anyone with limited mobility, since there's no travel involved and treatment happens in a familiar environment.",
  },
  {
    q: "How much does a session cost?",
    a: "Pricing depends on the type of session (online or home visit) and your location. Send a free, no-obligation enquiry with your condition and preferred option, and we'll share exact pricing before you commit to anything.",
  },
  {
    q: "Is my information kept confidential?",
    a: "Yes. Enquiry details are used only to schedule and provide your care, and are not shared with third parties beyond what's needed to operate the booking form. See our Privacy Policy for full details.",
  },
];

export default function Faq() {
  return (
    <div className="faq-list">
      {faqs.map((item) => (
        <details className="faq-item" key={item.q}>
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export { faqs };
