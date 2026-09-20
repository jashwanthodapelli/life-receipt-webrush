/**
 * Date and time utility functions for LIFE//RECEIPT.
 * Pure, deterministic operations.
 */

export function parseISO(isoString: string): Date {
  const d = new Date(isoString);
  return isNaN(d.getTime()) ? new Date(0) : d;
}

export function formatEditorialDate(isoString: string): string {
  const d = parseISO(isoString);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const month = months[d.getUTCMonth()];
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();
  const rawHours = d.getUTCHours();
  const minutes = d.getUTCMinutes().toString().padStart(2, "0");
  const ampm = rawHours >= 12 ? "PM" : "AM";
  const hours12 = rawHours % 12 === 0 ? 12 : rawHours % 12;

  return `${month} ${day}, ${year} · ${hours12}:${minutes} ${ampm} UTC`;
}

export function formatShortDate(isoString: string): string {
  const d = parseISO(isoString);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

export function formatTimeOnly(isoString: string): string {
  const d = parseISO(isoString);
  const rawHours = d.getUTCHours();
  const minutes = d.getUTCMinutes().toString().padStart(2, "0");
  const ampm = rawHours >= 12 ? "PM" : "AM";
  const hours12 = rawHours % 12 === 0 ? 12 : rawHours % 12;
  return `${hours12}:${minutes} ${ampm}`;
}

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export function getTimeOfDay(isoString: string): TimeOfDay {
  const d = parseISO(isoString);
  const h = d.getUTCHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 22) return "evening";
  return "night";
}

export function getTimeDifferenceMinutes(isoA: string, isoB: string): number {
  const tA = parseISO(isoA).getTime();
  const tB = parseISO(isoB).getTime();
  return Math.abs(tA - tB) / (1000 * 60);
}

export function isSameDay(isoA: string, isoB: string): boolean {
  const a = parseISO(isoA);
  const b = parseISO(isoB);
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

export function getISODayKey(isoString: string): string {
  const d = parseISO(isoString);
  const y = d.getUTCFullYear();
  const m = (d.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = d.getUTCDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}
