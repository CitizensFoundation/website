// Minimal stroke icons for the platform pages. Each is a 24x24 path set
// rendered in currentColor so the aurora gradient chips can tint them.

const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const make = (children) => () => <svg {...base}>{children}</svg>;

export const IconBulb = make(
  <>
    <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.3 1.2 2.1h4.6c.2-.8.6-1.6 1.2-2.1A6 6 0 0 0 12 3z" />
    <path d="M9.5 19h5" />
    <path d="M10.5 21.5h3" />
  </>
);

export const IconScales = make(
  <>
    <path d="M12 4v16" />
    <path d="M8 20h8" />
    <path d="M5 7h14" />
    <path d="M5 7l-2.5 5.5a2.9 2.9 0 0 0 5 0L5 7z" />
    <path d="M19 7l-2.5 5.5a2.9 2.9 0 0 0 5 0L19 7z" />
  </>
);

export const IconBallot = make(
  <>
    <path d="M4 13.5h16V21H4v-7.5z" />
    <path d="M9 13.5h6" />
    <path d="M12 3.5v6.5" />
    <path d="M9.5 6L12 3.5 14.5 6" />
  </>
);

export const IconChecklist = make(
  <>
    <path d="M4 6.5l1.2 1.2L7.5 5.5" />
    <path d="M4 12.5l1.2 1.2 2.3-2.2" />
    <path d="M4 18.5l1.2 1.2 2.3-2.2" />
    <path d="M11 6.5h9" />
    <path d="M11 12.5h9" />
    <path d="M11 18.5h9" />
  </>
);

export const IconCoins = make(
  <>
    <path d="M5 6.5C5 4.8 8 3.5 12 3.5s7 1.3 7 3-3 3-7 3-7-1.3-7-3z" />
    <path d="M5 6.5v5.5c0 1.7 3 3 7 3s7-1.3 7-3V6.5" />
    <path d="M5 12v5.5c0 1.7 3 3 7 3s7-1.3 7-3V12" />
  </>
);

export const IconShield = make(
  <>
    <path d="M12 3l8 3v6c0 4.8-3.4 7.9-8 9-4.6-1.1-8-4.2-8-9V6l8-3z" />
    <path d="M9 12l2 2 4-4.5" />
  </>
);

export const IconTranslate = make(
  <>
    <path d="M3 5.5h10" />
    <path d="M8 3.5v2" />
    <path d="M5 5.5c.5 4 3 7.5 6.5 9.5" />
    <path d="M11 5.5c-.5 4-3 7.5-6.5 9.5" />
    <path d="M13 20.5l4-10 4 10" />
    <path d="M14.4 17h5.2" />
  </>
);

export const IconSparkles = make(
  <>
    <path d="M11 4l1.4 4.1L16.5 9.5l-4.1 1.4L11 15l-1.4-4.1L5.5 9.5l4.1-1.4L11 4z" />
    <path d="M18.5 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" />
  </>
);

export const IconImage = make(
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="8.5" cy="10" r="1.5" />
    <path d="M21 15.5l-4.5-4.5L6 21" />
  </>
);

export const IconChart = make(
  <>
    <path d="M4 20.5V11" />
    <path d="M10 20.5V4.5" />
    <path d="M16 20.5v-7" />
    <path d="M2.5 20.5h19" />
  </>
);

export const IconBot = make(
  <>
    <rect x="5" y="8" width="14" height="10" rx="3" />
    <circle cx="9.5" cy="12.5" r="1" />
    <circle cx="14.5" cy="12.5" r="1" />
    <path d="M9.5 15.5h5" />
    <path d="M12 8V5.5" />
    <circle cx="12" cy="4.5" r="1" />
  </>
);

export const IconCode = make(
  <>
    <path d="M8 7l-5 5 5 5" />
    <path d="M16 7l5 5-5 5" />
    <path d="M13.5 4.5l-3 15" />
  </>
);

export const IconPackage = make(
  <>
    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
    <path d="M12 12l8-4.5" />
    <path d="M12 12L4 7.5" />
    <path d="M12 12v9" />
  </>
);

export const IconGlobe = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c3 3.5 3 14 0 18" />
    <path d="M12 3c-3 3.5-3 14 0 18" />
  </>
);

export const IconPairwise = make(
  <>
    <path d="M4 8h12" />
    <path d="M13 5l3 3-3 3" />
    <path d="M20 16H8" />
    <path d="M11 13l-3 3 3 3" />
  </>
);

// Filled brand glyphs for the footer social links.
const brand = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true };

export const IconGitHub = () => (
  <svg {...brand}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

export const IconLinkedIn = () => (
  <svg {...brand}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
  </svg>
);

export const IconFacebook = () => (
  <svg {...brand}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const IconX = () => (
  <svg {...brand}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

export const IconUsers = make(
  <>
    <circle cx="9" cy="8.5" r="3.5" />
    <path d="M3.5 20c.5-3.4 2.7-5.4 5.5-5.4s5 2 5.5 5.4" />
    <circle cx="17" cy="9.5" r="2.5" />
    <path d="M16 14.7c2.4.2 4 1.9 4.5 4.8" />
  </>
);
