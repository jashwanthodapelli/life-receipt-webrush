import { Receipt, ReceiptCategory } from "../types";

export const VALID_CATEGORIES: ReceiptCategory[] = [
  "Music",
  "Movies & Entertainment",
  "Places",
  "Purchases",
  "Photos",
  "Messages",
  "Searches",
  "Events",
  "Personal Notes",
];

export function isValidReceiptCategory(cat: unknown): cat is ReceiptCategory {
  return typeof cat === "string" && VALID_CATEGORIES.includes(cat as ReceiptCategory);
}

export function isValidReceipt(obj: unknown): obj is Receipt {
  if (!obj || typeof obj !== "object") return false;
  const r = obj as Record<string, unknown>;

  if (typeof r.id !== "string" || r.id.trim() === "") return false;
  if (typeof r.timestamp !== "string" || isNaN(Date.parse(r.timestamp))) return false;
  if (!isValidReceiptCategory(r.category)) return false;
  if (typeof r.title !== "string" || r.title.trim() === "") return false;
  if (typeof r.description !== "string") return false;
  if (!Array.isArray(r.tags)) return false;

  return true;
}

export function validateReceiptArray(arr: unknown): Receipt[] {
  if (!Array.isArray(arr)) {
    throw new Error("Dataset is not an array");
  }
  const valid: Receipt[] = [];
  for (const item of arr) {
    if (isValidReceipt(item)) {
      valid.push(item);
    }
  }
  return valid;
}
