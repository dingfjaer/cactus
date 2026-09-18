const calendar = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Europe/Oslo', year: 'numeric', month: '2-digit', day: '2-digit',
});

/** Convert a photo instant to the calendar day shown on the Norwegian site.
 * @param {string | null} takenAt
 */
export function photoCalendarDate(takenAt) {
  if (!takenAt || Number.isNaN(Date.parse(takenAt))) return null;
  return calendar.format(new Date(takenAt));
}

/** Calendar age from Tintin's birthday, 2025-04-08. No elapsed-time/DST math.
 * @param {string | null} day
 */
export function tintinAge(day) {
  if (!day || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return 'Alder ukjent';
  const [year, month, date] = day.split('-').map(Number);
  const target = new Date(Date.UTC(year, month - 1, date));
  if (target.toISOString().slice(0, 10) !== day) return 'Alder ukjent';
  if (day < '2025-04-08') return 'Før Tintin ble født';
  let months = (year - 2025) * 12 + month - 4;
  if (date < 8) months--;
  const anniversary = new Date(Date.UTC(2025, 3 + months, 8));
  const days = Math.round((target.valueOf() - anniversary.valueOf()) / 86400000);
  const years = Math.floor(months / 12);
  return [years && `${years} år`, months % 12 && `${months % 12} mnd`,
    (days || (!years && !(months % 12))) && `${days} d`].filter(Boolean).join(' ');
}

/** @param {string | null} day */
export function formatPhotoDate(day) {
  return day ? day.split('-').reverse().join('.') : 'Dato ukjent';
}
