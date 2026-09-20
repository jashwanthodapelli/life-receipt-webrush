import { ReceiptCategory } from "../types";

/**
 * Raw Kaggle Dataset Schema definitions.
 * Accommodates potential field variants from typical user activity logs,
 * personal data exports (Google Takeout, Apple Health/Location, Spotify Extended Streaming History, etc.).
 */
export interface RawKaggleRecord {
  event_id?: string;
  uuid?: string;
  id?: string;
  utc_timestamp?: string;
  datetime?: string;
  timestamp?: string | number;
  domain?: string;
  type?: string;
  action?: string;
  category_label?: string;
  headline?: string;
  name?: string;
  title?: string;
  description?: string;
  details?: string;
  summary?: string;
  text?: string;
  venue?: string;
  city?: string;
  location_name?: string;
  keywords?: string[] | string;
  entities_mentioned?: string[] | string;
  properties?: Record<string, string | number | boolean>;
}

export interface KaggleDatasetContainer {
  version?: string;
  source?: string;
  exported_at?: string;
  records: RawKaggleRecord[];
}

export interface DatasetAdapterResult {
  receipts: import("../types").Receipt[];
  parseErrors: string[];
  totalRawRecords: number;
}
