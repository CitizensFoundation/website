export const PLAUSIBLE_EVENTS = {
  workWithUs: "Work With Us Click",
  contactEmail: "Contact Email Click",
  yourPriorities: "Your Priorities Click",
  startProject: "Start Project Click",
  policySynth: "Policy Synth Click",
  github: "GitHub Click",
  notFound: "404",
};

export function plausibleClass(eventName) {
  return `plausible-event-name=${eventName.replace(/\s+/g, "+")}`;
}

export function trackPlausible(eventName, options) {
  if (typeof window === "undefined" || typeof window.plausible !== "function") return;
  window.plausible(eventName, options);
}
