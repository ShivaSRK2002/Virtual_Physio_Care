import "./ServiceAreaMap.css";

const areas = [
  "Anna Nagar",
  "T Nagar",
  "Adyar",
  "Mylapore",
  "Nungambakkam",
  "Kilpauk",
  "Velachery",
  "Porur",
  "Tambaram",
  "OMR / Sholinganallur",
];

export default function ServiceAreaMap() {
  return (
    <div className="area-map-wrap">
      <div className="area-map-frame">
        <iframe
          title="Virtual Physio Care home-visit service area — Chennai"
          src="https://www.google.com/maps?q=Chennai,+Tamil+Nadu&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="area-pill-row">
        {areas.map((a) => (
          <span className="pill" key={a}>
            {a}
          </span>
        ))}
      </div>
    </div>
  );
}
