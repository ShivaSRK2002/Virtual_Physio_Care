import { Link } from "react-router-dom";
import {
  Accessibility,
  Activity,
  Bone,
  Brain,
  Monitor,
  HeartPulse,
  Dumbbell,
  Home as HomeIcon,
  Clock,
  Globe2,
  Wallet,
  ShieldCheck,
  CalendarClock,
  Check,
} from "lucide-react";
import heroBanner from "../assets/images/hero-banner.jpg";
import ServiceAreaMap from "../components/ServiceAreaMap";
import Faq, { faqs } from "../components/Faq";
import "./Home.css";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

const carePaths = [
  {
    icon: Globe2,
    tag: "Available Worldwide",
    title: "Online Video Consultation",
    text: "Speak with a certified physiotherapist over a secure video call — from India, the Gulf, Europe, North America, or anywhere else.",
    points: [
      "Time-zone friendly scheduling",
      "Personalised exercise plan sent after every session",
      "Follow-ups over video or WhatsApp",
    ],
    cta: "Book an Online Session",
    type: "online",
  },
  {
    icon: HomeIcon,
    tag: "Available Across Chennai",
    title: "In-Home Physiotherapy",
    text: "A physiotherapist visits you at home anywhere in Chennai — ideal for post-surgical, elderly, or mobility-limited patients.",
    points: [
      "No travel required — we come to you",
      "Hands-on assessment and treatment",
      "Well suited to recovery and geriatric care",
    ],
    cta: "Book a Home Visit",
    type: "home-visit",
  },
];

const steps = [
  {
    title: "Book a Free Enquiry",
    text: "Fill our quick enquiry form with your concern and preferred time — no cost, no obligation.",
  },
  {
    title: "Video Assessment",
    text: "Meet your physiotherapist over video call for a full assessment of your condition and goals.",
  },
  {
    title: "Personalised Plan & Follow-ups",
    text: "Get a tailored treatment plan with exercises, and follow-up sessions to track your recovery.",
  },
];

const benefits = [
  { icon: HomeIcon, title: "No Travel Needed", text: "Get expert care from home, anywhere in India or abroad." },
  { icon: Clock, title: "No Waiting Lists", text: "Skip long clinic queues — book a session at a time that suits you." },
  { icon: Globe2, title: "Across Time Zones", text: "We work with international clients across different time zones." },
  { icon: Wallet, title: "Affordable Pricing", text: "Transparent pricing in INR and USD, with no hidden costs." },
  { icon: ShieldCheck, title: "Certified Therapists", text: "Sessions led by qualified, experienced physiotherapists." },
  { icon: CalendarClock, title: "Flexible Scheduling", text: "Morning, evening, or weekend slots — built around your day." },
];

const testimonials = [
  {
    quote:
      "My lower back pain had lasted almost a year. Within three online sessions I finally had a plan that worked.",
    name: "Anita, Chennai",
  },
  {
    quote:
      "My mother has Parkinson's and was struggling with walking and balance. After sessions with Virtual Physio Care, her walking and balance improved greatly. The sessions were friendly, effective, and very flexible with timings. Highly recommended!",
    name: "Maheshwari",
  },
  {
    quote:
      "I'm having one-on-one personal weight-loss sessions with Ms. Nithya. The sessions have been very helpful, informative, and easy to follow. I'm really happy with the guidance and support!",
    name: "Nandhini",
  },
];

const services = [
  { icon: Accessibility, name: "Geriatric Physiotherapy" },
  { icon: Activity, name: "Pain Management" },
  { icon: Bone, name: "Orthopedic Rehabilitation" },
  { icon: Brain, name: "Neurological Rehabilitation" },
  { icon: Monitor, name: "Workplace Physiotherapy" },
  { icon: HeartPulse, name: "Women's Physiotherapy" },
  { icon: Dumbbell, name: "Wellness & Weight Management" },
];

export default function Home() {
  return (
    <>
      <section className="hero-banner">
        <div className="container">
          <h1 className="visually-hidden">
            Online Physiotherapy Worldwide, and In-Home Physiotherapy Across Chennai
          </h1>
          <img
            className="hero-banner-img"
            src={heroBanner}
            alt="Physiotherapist guiding a patient through a stretching exercise during an online video consultation"
          />
          <div className="hero-banner-actions">
            <Link to="/contact#booking" className="btn btn-primary btn-lg">
              Book a Session
            </Link>
            <Link to="/services" className="btn btn-secondary btn-lg">
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      <section className="section care-paths-section">
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">Two Ways to Get Care</div>
            <h2>Wherever You Are, Help Is Within Reach</h2>
            <p>
              Living with pain shouldn't mean waiting weeks for an appointment or traveling
              across the city. Choose the option that fits you.
            </p>
          </div>
          <div className="grid grid-2 care-paths">
            {carePaths.map((path) => (
              <div className="card care-path-card" key={path.title}>
                <div className="icon-badge">
                  <path.icon size={22} strokeWidth={2} />
                </div>
                <span className="care-path-tag">{path.tag}</span>
                <h3>{path.title}</h3>
                <p>{path.text}</p>
                <ul className="care-path-points">
                  {path.points.map((point) => (
                    <li key={point}>
                      <Check size={16} strokeWidth={2.5} />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/contact?type=${path.type}#booking`}
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                >
                  {path.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="care-paths-note">
            Not sure which one you need? Send a free, no-obligation enquiry and we'll recommend
            the right option for your condition.
          </p>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">What We Treat</div>
            <h2>Physiotherapy for Every Stage of Recovery</h2>
            <p>Full online assessments and follow-up treatment tailored to your condition.</p>
          </div>
          <div className="grid grid-3">
            {services.map((s) => (
              <div className="card service-card" key={s.name}>
                <div className="icon-badge">
                  <s.icon size={22} strokeWidth={2} />
                </div>
                <h3>{s.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">How It Works</div>
            <h2>Three Simple Steps to Feeling Better</h2>
          </div>
          <div className="grid grid-3">
            {steps.map((step, i) => (
              <div className="card step-card" key={step.title}>
                <div className="step-number">{i + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">Why Choose Us</div>
            <h2>Care Designed Around You</h2>
          </div>
          <div className="grid grid-3">
            {benefits.map((b) => (
              <div className="card" key={b.title}>
                <div className="icon-badge icon-badge-soft">
                  <b.icon size={22} strokeWidth={2} />
                </div>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">Where We Serve</div>
            <h2>Online Consultations Worldwide, Home Visits Across Chennai</h2>
            <p>
              Book a video consultation from anywhere in the world, or, if you're in Chennai,
              request an in-home visit in areas including Anna Nagar, T Nagar, Adyar, Mylapore,
              Nungambakkam, Kilpauk, Velachery, Porur, Tambaram, and OMR / Sholinganallur.
            </p>
          </div>
          <ServiceAreaMap />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">Testimonials</div>
            <h2>What Our Patients Say</h2>
            <p>Real stories from patients we've helped move, heal, and get back to their lives.</p>
          </div>
          <div className="grid grid-3">
            {testimonials.map((t) => (
              <div className="card testimonial-card" key={t.name}>
                <p className="quote">"{t.quote}"</p>
                <p className="quote-name">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">FAQs</div>
            <h2>Common Questions</h2>
            <p>Everything you might want to know before booking your first session.</p>
          </div>
          <Faq />
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </section>

      <section className="section cta-section">
        <div className="container cta-inner">
          <h2>Pain doesn't need to wait for a "better time."</h2>
          <p>
            The sooner it's addressed, the easier it usually is to treat. Send a free,
            no-obligation enquiry today and hear back within 24 hours.
          </p>
          <Link to="/contact#booking" className="btn btn-primary btn-lg">
            Book Your Free Enquiry
          </Link>
        </div>
      </section>
    </>
  );
}
