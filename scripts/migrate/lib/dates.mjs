// Impact-story date parsing: English and Icelandic month names, optional day
// ("6 May 2010", "December 14, 2016", "januar 2013").

const MONTHS = {
  january: 1, januar: 1, "janúar": 1,
  february: 2, februar: 2, "febrúar": 2,
  march: 3, mars: 3,
  april: 4, "apríl": 4,
  may: 5, mai: 5, "maí": 5,
  june: 6, juni: 6, "júní": 6,
  july: 7, juli: 7, "júlí": 7,
  august: 8, agust: 8, "ágúst": 8,
  september: 9,
  october: 10, oktober: 10, "október": 10,
  november: 11, "nóvember": 11,
  december: 12, desember: 12,
};

export function parseLooseDate(text) {
  if (!text) return null;
  const tokens = text.toLowerCase().replace(/[,.]/g, " ").split(/\s+/).filter(Boolean);
  let year = null, month = null, day = null;
  for (const tok of tokens) {
    if (/^\d{4}$/.test(tok)) year = Number(tok);
    else if (/^\d{1,2}$/.test(tok)) day = Number(tok);
    else if (MONTHS[tok]) month = MONTHS[tok];
  }
  if (!year || !month) return null;
  const pad = (n) => String(n).padStart(2, "0");
  return `${year}-${pad(month)}-${pad(day || 1)}`;
}
