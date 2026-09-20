/**
 * Accessibility utility functions for LIFE//RECEIPT.
 * Keyboard event helpers, ARIA utilities, and screen reader announcements.
 */

export function isActivationKey(e: React.KeyboardEvent): boolean {
  return e.key === "Enter" || e.key === " ";
}

export function isEscapeKey(e: React.KeyboardEvent | KeyboardEvent): boolean {
  return e.key === "Escape";
}

export function announceToScreenReader(message: string, politeness: "polite" | "assertive" = "polite"): void {
  const existingAnnouncer = document.getElementById("a11y-live-announcer");
  if (existingAnnouncer) {
    existingAnnouncer.setAttribute("aria-live", politeness);
    existingAnnouncer.textContent = "";
    // Trigger DOM update
    setTimeout(() => {
      existingAnnouncer.textContent = message;
    }, 50);
  }
}
