import { Activity, MapPin, GitCompare, Clock, TrendingUp } from "lucide-react";
import { PatternType } from "../types";

export const PATTERN_TYPE_ICONS: Record<PatternType, any> = {
  activity_peak: Activity,
  repeated_place: MapPin,
  category_relationship: GitCompare,
  category_coupling: GitCompare,
  time_of_day_rhythm: Clock,
  circadian_rhythm: Clock,
  category_shift: TrendingUp,
  macro_shift: TrendingUp,
};
