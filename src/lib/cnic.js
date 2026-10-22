/**
 * CNIC helpers for Pakistani Computerised National Identity Cards.
 *
 * A CNIC has 13 digits, usually written as #####-#######-#.
 * The first digit is a province or region code (1 to 7).
 */

export function normalizeCnic(input) {
  if (input === null || input === undefined) return "";
  return String(input).replace(/[\s-]/g, "").trim();
}

export function isValidCnic(input) {
  const digits = normalizeCnic(input);
  if (!/^\d{13}$/.test(digits)) return false;
  const firstDigit = Number(digits.charAt(0));
  if (firstDigit < 1 || firstDigit > 7) return false;
  if (/^(\d)\1{12}$/.test(digits)) return false;
  return true;
}

export function formatCnic(input) {
  const digits = String(input ?? "").replace(/\D/g, "").slice(0, 13);
  if (digits.length <= 5) return digits;
  if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
}
