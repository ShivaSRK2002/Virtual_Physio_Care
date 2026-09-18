import { Link } from "react-router-dom";
import { Users, UserRound, CalendarDays, Clock3 } from "lucide-react";
import "./Programs.css";

const programs = [
  {
    icon: Users,
    title: "Group Weight Loss Fitness",
    subtitle: "Small-group training with physiotherapy guidance",
    fee: "₹2,999/month",
    points: [
      "12 sessions per month",
      "3 sessions per week",
      "Small group sessions",
      "Physiotherapy-guided exercises",
      "Session duration: 45-60 minutes",
    ],
    badges: ["12 Sessions/Month", "3 Days/Week"],
  },
  {
    icon: UserRound,
    title: "Individual 1:1 Personal Training",
    subtitle: "Personalized coaching for strength and weight management",
    fee: "₹4,500/month",
    points: [
      "15 sessions per month",
      "1:1 personalized training",
      "Sessions at your preferred timing",
      "Session duration: 45-60 minutes",
      "Strength, mobility, core and weight management",
    ],
    badges: ["12 Personal Training Sessions", "3 Guided Cardio Sessions"],
  },
];

export default function Programs() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Fitness</div>
          <h1>Weight Loss &amp; Strength Training Fitness</h1>
          <p>
            Structured, physiotherapy-guided fitness plans designed to support weight management,
            strength, mobility and overall fitness.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2 programs-grid">
            {programs.map((program) => (
              <article className="card program-card" key={program.title}>
                <div className="icon-badge">
                  <program.icon size={22} strokeWidth={2} />
                </div>

                <h2>{program.title}</h2>
                <p className="program-subtitle">{program.subtitle}</p>

                <div className="program-meta">
                  <span>
                    <CalendarDays size={16} />
                    Monthly Plan
                  </span>
                  <span>
                    <Clock3 size={16} />
                    45-60 Minutes/Session
                  </span>
                </div>

                <ul className="program-points">
                  {program.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>

                <p className="program-fee">Fee: {program.fee}</p>

                <div className="program-badges">
                  {program.badges.map((badge) => (
                    <span className="pill" key={badge}>
                      {badge}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container programs-cta">
          <h2>Need help choosing the right plan?</h2>
          <p>Talk to our physiotherapy team and get a recommendation based on your goals.</p>
          <Link to="/contact#booking" className="btn btn-primary btn-lg">
            Book a Free Enquiry
          </Link>
        </div>
      </section>
    </>
  );
}
