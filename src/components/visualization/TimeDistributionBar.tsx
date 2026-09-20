import React from "react";
import { Sunrise, Sun, Sunset, Moon } from "lucide-react";

interface TimeDistributionBarProps {
  distribution: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  total: number;
}

export const TimeDistributionBar: React.FC<TimeDistributionBarProps> = ({
  distribution,
  total,
}) => {
  const safeTotal = Math.max(1, total);
  const segments = [
    {
      id: "morning",
      label: "Morning",
      hours: "05:00 – 11:59",
      count: distribution.morning,
      pct: Math.round((distribution.morning / safeTotal) * 100),
      icon: Sunrise,
      color: "bg-amber-400",
      textColor: "text-amber-400",
    },
    {
      id: "afternoon",
      label: "Afternoon",
      hours: "12:00 – 16:59",
      count: distribution.afternoon,
      pct: Math.round((distribution.afternoon / safeTotal) * 100),
      icon: Sun,
      color: "bg-orange-400",
      textColor: "text-orange-400",
    },
    {
      id: "evening",
      label: "Evening",
      hours: "17:00 – 21:59",
      count: distribution.evening,
      pct: Math.round((distribution.evening / safeTotal) * 100),
      icon: Sunset,
      color: "bg-purple-400",
      textColor: "text-purple-400",
    },
    {
      id: "night",
      label: "Night",
      hours: "22:00 – 04:59",
      count: distribution.night,
      pct: Math.round((distribution.night / safeTotal) * 100),
      icon: Moon,
      color: "bg-indigo-400",
      textColor: "text-indigo-400",
    },
  ];

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-neutral-200">
          Circadian Rhythms & Time of Day
        </h4>
        <span className="font-mono text-[11px] text-neutral-400">
          Analyzed across 24-hour UTC window
        </span>
      </div>

      {/* Multi-segment progress bar */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-neutral-900 border border-neutral-800">
        {segments.map(seg => (
          <div
            key={seg.id}
            style={{ width: `${Math.max(4, seg.pct)}%` }}
            className={`${seg.color} transition-all duration-300`}
            title={`${seg.label}: ${seg.count} receipts (${seg.pct}%)`}
          />
        ))}
      </div>

      {/* Segment Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {segments.map(seg => {
          const Icon = seg.icon;
          return (
            <div
              key={seg.id}
              className="p-3 rounded-lg border border-neutral-800/80 bg-neutral-900/40 space-y-1"
            >
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[11px] font-medium">{seg.label}</span>
                <Icon className={`h-3.5 w-3.5 ${seg.textColor}`} />
              </div>
              <div className="font-mono text-lg font-bold text-neutral-100">
                {seg.pct}%
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                <span>{seg.count} receipts</span>
                <span className="text-[9px]">{seg.hours.split(" ")[0]}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
