import { Mail } from "lucide-react";
import { CONTACT } from "../config";
import "./SocialIcons.css";

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.69.44 3.34 1.28 4.79L2 22l5.42-1.38a9.9 9.9 0 0 0 4.62 1.16h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.82c0 4.55-3.7 8.25-8.25 8.25a8.2 8.2 0 0 1-4.1-1.1l-.29-.17-3.21.82.86-3.13-.19-.32a8.19 8.19 0 0 1-1.26-4.36c0-4.55 3.7-8.24 8.25-8.24zm-4.52 4.7c-.16 0-.42.06-.64.31-.22.25-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.16 1.7 2.6 4.14 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.09.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.44-1.34-1.68-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.42-.55-.42h-.47z" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function SocialIcons({ className = "" }) {
  return (
    <div className={`social-icons ${className}`}>
      <a
        href={CONTACT.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="social-icon-link"
      >
        <WhatsAppIcon width={18} height={18} />
      </a>
      <a
        href={CONTACT.instagram}
        target="_blank"
        rel="noreferrer"
        aria-label="Follow us on Instagram"
        className="social-icon-link"
      >
        <InstagramIcon width={18} height={18} />
      </a>
      <a href={`mailto:${CONTACT.email}`} aria-label="Email us" className="social-icon-link">
        <Mail size={18} strokeWidth={2} />
      </a>
    </div>
  );
}
