import { photoCalendarDate, tintinAge } from './tintin-age.mjs';

/** Calendar-day progress through the year in Oslo, independent of browser timezone/DST.
 * @param {Date} [date]
 */
export function nowCalendar(date = new Date()) {
  const day = photoCalendarDate(date.toISOString());
  if (!day) throw new RangeError('Invalid calendar date');
  const year = Number(day.slice(0, 4));
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year + 1, 0, 1);
  const progress = (Date.parse(`${day}T00:00:00Z`) - start) / (end - start);
  return {
    day, year, progress, age: tintinAge(day),
    dateLabel: new Intl.DateTimeFormat('nb-NO', {timeZone:'Europe/Oslo', day:'numeric', month:'long', year:'numeric'}).format(date),
  };
}
