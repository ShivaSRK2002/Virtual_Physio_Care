import { HeartHandshake, GraduationCap, Globe2 } from "lucide-react";
import aboutTeam from "../assets/illustrations/about-team.svg";
import "./About.css";

const values = [
  {
    icon: HeartHandshake,
    title: "Patient-First Approach",
    text: "Every treatment plan is built around your specific condition, lifestyle, and recovery goals — not a one-size-fits-all routine.",
  },
  {
    icon: GraduationCap,
    title: "Certified Expertise",
    text: "Our physiotherapists are qualified professionals with hands-on clinical experience across sports, orthopaedic, and neurological rehabilitation.",
  },
  {
    icon: Globe2,
    title: "Care Without Borders",
    text: "We work with patients across India and internationally, scheduling sessions that fit your time zone.",
  },
];

export default function About() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">About Us</div>
          <h1>Physiotherapy That Comes to You — Wherever "You" Is</h1>
          <p>
            Virtual Physio Care offers certified online consultations for patients anywhere in
            the world, and in-home physiotherapy visits for patients across Chennai — without the
            cost, travel, or waiting lists of a typical clinic.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2 about-story">
          <div>
            <h2>Our Story</h2>
            <p>
              We noticed that many people — whether in a small town in India or living abroad far
              from specialist care — struggled to access reliable physiotherapy. Long waiting
              lists, expensive private clinics, and time constraints kept people from getting the
              help they needed.
            </p>
            <p>
              Virtual Physio Care bridges that gap in two ways: secure, one-on-one video
              consultations for anyone, anywhere in the world, and in-home physiotherapy visits
              for patients across Chennai who prefer hands-on, in-person care.
            </p>
            <h2>Who We Help</h2>
            <p>
              We work with people recovering from injuries, post-surgical patients, older adults
              needing geriatric rehabilitation, office workers with posture-related pain, and
              anyone dealing with chronic back, neck, or joint discomfort — across Chennai, the
              rest of India, and internationally.
            </p>
          </div>
          <div className="about-image">
            <img src={aboutTeam} alt="Physiotherapist reviewing a patient's treatment plan" />
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">Our Values</div>
            <h2>What Guides Our Care</h2>
          </div>
          <div className="grid grid-3">
            {values.map((v) => (
              <div className="card" key={v.title}>
                <div className="icon-badge">
                  <v.icon size={22} strokeWidth={2} />
                </div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
