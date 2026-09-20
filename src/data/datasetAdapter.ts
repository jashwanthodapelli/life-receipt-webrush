import { Receipt, ReceiptCategory } from "../types";
import { RawKaggleRecord, DatasetAdapterResult } from "./datasetSchema";
import { isValidReceiptCategory } from "../utils/validation";

/**
 * Normalizes raw category strings from Kaggle or external sources
 * into one of the 9 canonical ReceiptCategory variants.
 */
export function mapRawCategoryToReceiptCategory(raw?: string): ReceiptCategory {
  if (!raw) return "Personal Notes";
  const lower = raw.toLowerCase().trim();

  if (lower.includes("music") || lower.includes("audio") || lower.includes("track") || lower.includes("podcast") || lower.includes("spotify")) {
    return "Music";
  }
  if (lower.includes("movie") || lower.includes("film") || lower.includes("cinema") || lower.includes("stream") || lower.includes("entertainment") || lower.includes("tv") || lower.includes("video")) {
    return "Movies & Entertainment";
  }
  if (lower.includes("place") || lower.includes("location") || lower.includes("checkin") || lower.includes("cafe") || lower.includes("restaurant") || lower.includes("travel") || lower.includes("transit") || lower.includes("geofence")) {
    return "Places";
  }
  if (lower.includes("purchase") || lower.includes("buy") || lower.includes("order") || lower.includes("shop") || lower.includes("transaction") || lower.includes("receipt") || lower.includes("payment")) {
    return "Purchases";
  }
  if (lower.includes("photo") || lower.includes("image") || lower.includes("camera") || lower.includes("gallery") || lower.includes("snapshot")) {
    return "Photos";
  }
  if (lower.includes("message") || lower.includes("chat") || lower.includes("sms") || lower.includes("conversation") || lower.includes("thread")) {
    return "Messages";
  }
  if (lower.includes("search") || lower.includes("query") || lower.includes("browse") || lower.includes("web") || lower.includes("lookup")) {
    return "Searches";
  }
  if (lower.includes("event") || lower.includes("calendar") || lower.includes("conference") || lower.includes("meeting") || lower.includes("concert") || lower.includes("festival")) {
    return "Events";
  }

  return "Personal Notes";
}

/**
 * Normalizes raw timestamps into valid ISO 8601 strings.
 */
export function normalizeTimestamp(raw: string | number | undefined): string {
  if (!raw) return new Date().toISOString();
  if (typeof raw === "number") {
    // If epoch seconds vs epoch ms
    const ms = raw < 10000000000 ? raw * 1000 : raw;
    return new Date(ms).toISOString();
  }
  const parsed = Date.parse(raw);
  if (!isNaN(parsed)) {
    return new Date(parsed).toISOString();
  }
  return new Date().toISOString();
}

/**
 * Adapts an array of raw Kaggle records into normalized Receipt models.
 */
export function adaptKaggleDataset(rawRecords: RawKaggleRecord[]): DatasetAdapterResult {
  const receipts: Receipt[] = [];
  const parseErrors: string[] = [];

  rawRecords.forEach((item, index) => {
    try {
      const id = item.id || item.event_id || item.uuid || `rcpt-kaggle-${index + 1}`;
      const timestamp = normalizeTimestamp(item.timestamp || item.datetime || item.utc_timestamp);
      
      const rawCat = item.category_label || item.type || item.action || item.domain;
      const category: ReceiptCategory = isValidReceiptCategory(rawCat)
        ? rawCat
        : mapRawCategoryToReceiptCategory(rawCat);

      const title = item.title || item.name || item.headline || `${category} Activity`;
      const description = item.description || item.details || item.summary || item.text || "Recorded digital interaction.";
      
      const location = item.location_name || item.venue || (item.city ? `${item.city}` : undefined);

      // Parse tags
      let tags: string[] = [];
      if (Array.isArray(item.keywords)) {
        tags = item.keywords.map(k => String(k).trim()).filter(Boolean);
      } else if (typeof item.keywords === "string") {
        tags = item.keywords.split(",").map(k => k.trim()).filter(Boolean);
      }
      if (tags.length === 0) {
        tags = [category.toLowerCase().replace(/\s+/g, "-")];
      }

      // Parse entities
      let entities: string[] = [];
      if (Array.isArray(item.entities_mentioned)) {
        entities = item.entities_mentioned.map(e => String(e).trim()).filter(Boolean);
      } else if (typeof item.entities_mentioned === "string") {
        entities = item.entities_mentioned.split(",").map(e => e.trim()).filter(Boolean);
      }

      receipts.push({
        id,
        timestamp,
        category,
        title,
        description,
        location,
        tags,
        entities: entities.length > 0 ? entities : undefined,
        metadata: item.properties,
      });
    } catch {
      parseErrors.push(`Failed to adapt record at index ${index}`);
    }
  });

  return {
    receipts,
    parseErrors,
    totalRawRecords: rawRecords.length,
  };
}
