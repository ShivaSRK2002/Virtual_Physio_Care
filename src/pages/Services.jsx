import { Link } from "react-router-dom";
import { Accessibility, Activity, Bone, Brain, Monitor, HeartPulse, Dumbbell } from "lucide-react";
import "./Services.css";

const services = [
  {
    icon: Accessibility,
    title: "Geriatric Physiotherapy",
    tags: ["Parkinson's", "Stroke", "Balance & Falls", "Gait Issues", "Mobility Problems"],
  },
  {
    icon: Activity,
    title: "Pain Management",
    tags: ["Neck Pain", "Back Pain", "Shoulder Pain", "Knee Pain", "Joint Pain", "Muscle Pain"],
  },
  {
    icon: Bone,
    title: "Orthopedic Rehabilitation",
    tags: ["Sports Injuries", "Sprains & Strains", "Arthritis", "Tendon Injuries", "Post-Surgery Rehabilitation"],
  },
  {
    icon: Brain,
    title: "Neurological Rehabilitation",
    tags: ["Stroke", "Parkinson's", "Balance Problems", "Gait Training", "Coordination & Mobility"],
  },
  {
    icon: Monitor,
    title: "Workplace Physiotherapy",
    tags: ["Neck & Back Pain", "Posture Problems", "Desk-related Pain", "Ergonomic Guidance", "Mobility Exercises"],
  },
  {
    icon: HeartPulse,
    title: "Women's Physiotherapy",
    tags: ["Pregnancy-related Pain", "Postnatal Rehabilitation", "Pelvic & Back Pain", "Core Strengthening"],
  },
  {
    icon: Dumbbell,
    title: "Wellness & Weight Management",
    tags: ["Strength", "Flexibility", "Mobility", "Posture Correction", "Fall Prevention", "Weight Loss Fitness"],
  },
];

export default function Services() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Services</div>
          <h1>Physiotherapy Services We Offer</h1>
          <p>
            Available as an online video consultation from anywhere in the world, or as an
            in-home visit across Chennai. Every plan begins with a full assessment, followed
            by a personalised treatment plan and follow-ups to track your progress.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-3 service-grid">
            {services.map((s) => (
              <div className="card service-detail-card" key={s.title}>
                <div className="icon-badge">
                  <s.icon size={22} strokeWidth={2} />
                </div>
                <h3>{s.title}</h3>
                <div className="tag-row">
                  {s.tags.map((tag) => (
                    <span className="tag-chip" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container" style={{ textAlign: "center" }}>
          <h2>Not sure which service is right for you?</h2>
          <p>Tell us about your condition and we'll recommend the best next step.</p>
          <Link to="/contact#booking" className="btn btn-primary btn-lg">
            Get a Free Enquiry
          </Link>
        </div>
      </section>
    </>
  );
}
