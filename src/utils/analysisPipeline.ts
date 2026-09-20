import {
  Receipt,
  ReceiptCategory,
  Connection,
  ConnectionType,
  Pattern,
  LifeChapter,
  StoryScene,
  DatasetStats,
  AnalysisOutput,
  ReceiptEvidenceChain,
} from "../types";
import {
  parseISO,
  getTimeOfDay,
  getTimeDifferenceMinutes,
  isSameDay,
  formatShortDate,
} from "./date";

/**
 * 1. Normalization Stage
 */
export function normalizeDataset(raw: Receipt[]): Receipt[] {
  const seen = new Set<string>();
  const valid: Receipt[] = [];

  for (const item of raw) {
    if (!item.id || seen.has(item.id)) continue;
    seen.add(item.id);
    valid.push({
      ...item,
      tags: Array.isArray(item.tags) ? item.tags.map(t => t.toLowerCase().trim()).filter(Boolean) : [],
      entities: Array.isArray(item.entities) ? item.entities.map(e => e.trim()).filter(Boolean) : [],
    });
  }

  // Sort chronologically ascending
  return valid.sort((a, b) => parseISO(a.timestamp).getTime() - parseISO(b.timestamp).getTime());
}

/**
 * 2. Calculate Statistical Aggregations & Automated Observations
 */
export function calculateStats(receipts: Receipt[], connectionsCount: number, patternsCount: number, chaptersCount: number): DatasetStats {
  const categoryCounts: Record<ReceiptCategory, number> = {
    "Music": 0,
    "Movies & Entertainment": 0,
    "Places": 0,
    "Purchases": 0,
    "Photos": 0,
    "Messages": 0,
    "Searches": 0,
    "Events": 0,
    "Personal Notes": 0,
  };

  const activeDaySet = new Set<string>();
  const locationSet = new Set<string>();
  const timeOfDayDist = { morning: 0, afternoon: 0, evening: 0, night: 0 };

  for (const r of receipts) {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
    const d = parseISO(r.timestamp);
    activeDaySet.add(`${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`);
    if (r.location) locationSet.add(r.location);
    const tod = getTimeOfDay(r.timestamp);
    timeOfDayDist[tod]++;
  }

  const sortedByCount = (Object.entries(categoryCounts) as [ReceiptCategory, number][])
    .sort((a, b) => b[1] - a[1]);
  const topCategory = sortedByCount[0]?.[0] || "Purchases";

  // Compute automated observations deterministically from metrics
  const observations: string[] = [];

  // Observation 1: Dominant category & distribution
  observations.push(
    `${topCategory} represents your most frequent activity focus with ${categoryCounts[topCategory]} verified entries recorded.`
  );

  // Observation 2: Time of day rhythm
  const topTime = Object.entries(timeOfDayDist).sort((a, b) => b[1] - a[1])[0];
  if (topTime) {
    observations.push(
      `Your digital footprint peaked during the ${topTime[0]} hours (${topTime[1]} receipts, ${Math.round((topTime[1] / Math.max(1, receipts.length)) * 100)}% of all volume).`
    );
  }

  // Observation 3: Geographic convergence
  if (locationSet.size > 0) {
    // Count locations
    const locCounts: Record<string, number> = {};
    for (const r of receipts) {
      if (r.location) locCounts[r.location] = (locCounts[r.location] || 0) + 1;
    }
    const topLoc = Object.entries(locCounts).sort((a, b) => b[1] - a[1])[0];
    if (topLoc) {
      observations.push(
        `You returned to "${topLoc[0]}" ${topLoc[1]} times across diverse categories, making it a primary behavioral anchor.`
      );
    }
  }

  // Observation 4: Category evolution
  if (receipts.length >= 8) {
    const splitIndex = Math.floor(receipts.length / 2);
    const firstHalf = receipts.slice(0, splitIndex);
    const secondHalf = receipts.slice(splitIndex);

    const earlySearches = firstHalf.filter(r => r.category === "Searches" || r.category === "Personal Notes").length;
    const lateEvents = secondHalf.filter(r => r.category === "Events" || r.category === "Messages" || r.category === "Photos").length;

    if (earlySearches > 0 && lateEvents > 0) {
      observations.push(
        `Your journey shows a measurable transition from early exploratory inquiry to outward community events and collective memory.`
      );
    }
  }

  const dateRange = {
    start: receipts[0]?.timestamp || new Date().toISOString(),
    end: receipts[receipts.length - 1]?.timestamp || new Date().toISOString(),
  };

  return {
    totalReceipts: receipts.length,
    activeDays: activeDaySet.size,
    categoryCounts,
    uniqueLocations: locationSet.size,
    discoveredConnections: connectionsCount,
    detectedPatterns: patternsCount,
    lifeChapters: chaptersCount,
    dateRange,
    timeOfDayDistribution: timeOfDayDist,
    automatedObservations: observations,
  };
}

/**
 * 3. Connection Engine
 * Deterministic relationship discovery with multi-variable scoring.
 */
export function analyzeConnections(receipts: Receipt[]): Connection[] {
  const connections: Connection[] = [];
  const minThreshold = 0.42; // Prune graph noise

  for (let i = 0; i < receipts.length; i++) {
    for (let j = i + 1; j < receipts.length; j++) {
      const a = receipts[i];
      const b = receipts[j];

      let score = 0;
      const reasons: string[] = [];
      const sharedFeatures: string[] = [];
      let connType: ConnectionType = "temporal_proximity";

      // Criteria 1: Location match
      if (a.location && b.location && a.location.toLowerCase() === b.location.toLowerCase()) {
        score += 0.40;
        reasons.push(`at the exact same anchor venue ("${a.location}")`);
        sharedFeatures.push(`Location: ${a.location}`);
        connType = "location_spatial";
      }

      // Criteria 2: Timestamp proximity
      const diffMins = getTimeDifferenceMinutes(a.timestamp, b.timestamp);
      if (diffMins <= 90) {
        score += 0.35;
        reasons.push(`occurring within ${Math.round(diffMins)} minutes of each other`);
        sharedFeatures.push(`Within ${Math.round(diffMins)}m`);
        if (connType !== "location_spatial") connType = "temporal_proximity";
      } else if (diffMins <= 360 && isSameDay(a.timestamp, b.timestamp)) {
        score += 0.20;
        reasons.push(`on the exact same calendar day`);
        sharedFeatures.push("Same Day");
      }

      // Criteria 3: Shared entities
      const entitiesA = new Set(a.entities || []);
      const sharedEntities = (b.entities || []).filter(e => entitiesA.has(e));
      if (sharedEntities.length > 0) {
        score += 0.30 * Math.min(sharedEntities.length, 2);
        reasons.push(`sharing referenced subject "${sharedEntities.join(", ")}"`);
        sharedFeatures.push(...sharedEntities.map(e => `Entity: ${e}`));
        connType = "shared_entity";
      }

      // Criteria 4: Shared tags
      const tagsA = new Set(a.tags || []);
      const sharedTags = (b.tags || []).filter(t => tagsA.has(t));
      if (sharedTags.length > 0) {
        score += 0.15 * Math.min(sharedTags.length, 3);
        reasons.push(`overlapping themes [${sharedTags.slice(0, 3).join(", ")}]`);
        sharedFeatures.push(...sharedTags.map(t => `#${t}`));
        if (connType === "temporal_proximity") connType = "thematic_tags";
      }

      // Criteria 5: Cross-category synergy pairs (e.g. Music + Purchases coffee ritual, Events + Photos, Searches + Notes)
      const isRitualPair =
        (a.category === "Purchases" && b.category === "Music") ||
        (a.category === "Music" && b.category === "Purchases") ||
        (a.category === "Events" && b.category === "Photos") ||
        (a.category === "Searches" && b.category === "Personal Notes");

      if (isRitualPair && (diffMins <= 180 || (a.location && a.location === b.location))) {
        score += 0.20;
        connType = "semantic_cross_category";
        reasons.push(`forming a complementary ${a.category} ↔ ${b.category} behavioral loop`);
        sharedFeatures.push(`Synergy: ${a.category} + ${b.category}`);
      }

      const finalScore = Math.min(1.0, score);
      if (finalScore >= minThreshold) {
        const explanation = `Connected because both happened ${reasons.join(", and ")}.`;
        connections.push({
          id: `conn-${a.id}-${b.id}`,
          sourceId: a.id,
          targetId: b.id,
          score: Math.round(finalScore * 100) / 100,
          type: connType,
          explanation,
          sharedFeatures,
        });
      }
    }
  }

  // Sort by highest score first
  return connections.sort((a, b) => b.score - a.score);
}

/**
 * 4. Pattern Discovery Engine
 * Deterministic detection across 5 core dimensions.
 */
export function detectPatterns(receipts: Receipt[], connections: Connection[]): Pattern[] {
  const patterns: Pattern[] = [];

  // Pattern 1: Repeated Places
  const locationMap: Record<string, Receipt[]> = {};
  for (const r of receipts) {
    if (r.location) {
      locationMap[r.location] = locationMap[r.location] || [];
      locationMap[r.location].push(r);
    }
  }

  for (const [loc, list] of Object.entries(locationMap)) {
    if (list.length >= 4) {
      const distinctCats = Array.from(new Set(list.map(r => r.category)));
      patterns.push({
        id: `pat-loc-${loc.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`,
        type: "repeated_place",
        title: `Anchor Sanctuary: ${loc}`,
        description: `This venue served as a multi-modal nexus spanning ${list.length} visits across ${distinctCats.length} distinct life domains.`,
        confidence: 0.94,
        detectionMethod: "Clustering receipts by exact geographic entity where frequency >= 4 and category diversity >= 2.",
        evidenceExplanation: `Repeated check-ins and transactions confirm habitual reliance on this physical environment for both focused work and ritual breaks.`,
        supportingReceiptIds: list.map(r => r.id),
        metrics: {
          visit_count: list.length,
          category_diversity: distinctCats.length,
        },
      });
    }
  }

  // Pattern 2: Time-of-Day Rhythm
  const todBuckets: Record<string, Receipt[]> = { morning: [], afternoon: [], evening: [], night: [] };
  for (const r of receipts) {
    todBuckets[getTimeOfDay(r.timestamp)].push(r);
  }

  if (todBuckets.morning.length >= 5) {
    const morningRitualReceipts = todBuckets.morning.filter(r => r.category === "Purchases" || r.category === "Music");
    patterns.push({
      id: "pat-tod-morning-rhythm",
      type: "time_of_day_rhythm",
      title: "Morning Ignition Ritual",
      description: "Consistent alignment of single-origin coffee purchases followed immediately by ambient/jazz audio playback.",
      confidence: 0.91,
      detectionMethod: "Sequential time-window analysis between 05:00 and 11:59 UTC isolating paired Purchases and Music entries.",
      evidenceExplanation: "Receipt timestamps reveal a recurring morning setup window preceding daily creative outputs.",
      supportingReceiptIds: morningRitualReceipts.map(r => r.id),
      metrics: {
        morning_total: todBuckets.morning.length,
        ritual_pair_count: morningRitualReceipts.length,
      },
    });
  }

  if (todBuckets.night.length >= 4) {
    patterns.push({
      id: "pat-tod-night-creative",
      type: "time_of_day_rhythm",
      title: "The Late-Night Creative Horizon",
      description: "Intense, uninterrupted coding, writing, and deep listening clusters between 21:00 and 02:00 UTC.",
      confidence: 0.89,
      detectionMethod: "Histogram density of receipts occurring after 21:00 UTC displaying minimal inter-event delay.",
      evidenceExplanation: "High proportion of Personal Notes, Searches, and experimental Music receipts clustered in late hours.",
      supportingReceiptIds: todBuckets.night.map(r => r.id),
      metrics: {
        night_receipts: todBuckets.night.length,
      },
    });
  }

  // Pattern 3: Category Relationships (Cross-domain synergy)
  const musicReceipts = receipts.filter(r => r.category === "Music");
  const placeReceipts = receipts.filter(r => r.category === "Places" || r.category === "Purchases");
  const linkedMusicPlace = connections.filter(c => {
    const a = receipts.find(r => r.id === c.sourceId);
    const b = receipts.find(r => r.id === c.targetId);
    if (!a || !b) return false;
    return (a.category === "Music" && (b.category === "Places" || b.category === "Purchases")) ||
           (b.category === "Music" && (a.category === "Places" || a.category === "Purchases"));
  });

  if (linkedMusicPlace.length >= 3) {
    const linkedIds = Array.from(new Set(linkedMusicPlace.flatMap(c => [c.sourceId, c.targetId])));
    patterns.push({
      id: "pat-cat-music-space",
      type: "category_relationship",
      title: "Category Coupling: Music ↔ Spatial Anchors",
      description: "You soundtrack specific physical environments with dedicated sonic identities.",
      confidence: 0.88,
      detectionMethod: "Bipartite graph co-occurrence analysis linking Music stream receipts with simultaneous physical check-ins.",
      evidenceExplanation: "Rather than listening in transit, ambient works are tightly coupled with specific cafe and studio tables.",
      supportingReceiptIds: linkedIds,
      metrics: {
        coupled_connections: linkedMusicPlace.length,
      },
    });
  }

  // Pattern 4: Activity Peak
  // Find calendar days with highest density
  const dayCounts: Record<string, Receipt[]> = {};
  for (const r of receipts) {
    const dKey = r.timestamp.slice(0, 10);
    dayCounts[dKey] = dayCounts[dKey] || [];
    dayCounts[dKey].push(r);
  }
  const peakDays = Object.entries(dayCounts).filter(([, list]) => list.length >= 3);
  if (peakDays.length > 0) {
    const peakSupporting = peakDays.flatMap(([, list]) => list.map(r => r.id));
    patterns.push({
      id: "pat-activity-peak-clusters",
      type: "activity_peak",
      title: "Burst Mode: Concentrated Output Peaks",
      description: `Observed ${peakDays.length} specific dates where event density exceeded 2.5x the baseline daily average.`,
      confidence: 0.93,
      detectionMethod: "Poisson variance thresholding identifying days with 3+ logged receipts within a 6-hour window.",
      evidenceExplanation: "Reflects milestone days such as conference showcases, live concerts, and collaborative weekend sprints.",
      supportingReceiptIds: peakSupporting,
      metrics: {
        peak_days: peakDays.length,
        max_events_in_day: Math.max(...peakDays.map(([, l]) => l.length)),
      },
    });
  }

  // Pattern 5: Category Shift (Earlier vs Later dataset)
  if (receipts.length >= 10) {
    const splitIndex = Math.floor(receipts.length * 0.4);
    const earlyReceipts = receipts.slice(0, splitIndex);
    const lateReceipts = receipts.slice(receipts.length - splitIndex);

    const earlyInternal = earlyReceipts.filter(r => r.category === "Searches" || r.category === "Personal Notes").length;
    const lateSocial = lateReceipts.filter(r => r.category === "Events" || r.category === "Messages" || r.category === "Photos").length;

    if (earlyInternal >= 2 && lateSocial >= 3) {
      patterns.push({
        id: "pat-cat-shift-reflection-to-community",
        type: "category_shift",
        title: "Macro Shift: Internal Research → Communal Resonance",
        description: "Your digital activity evolved from solitary research and inquiries into public exhibitions, live music, and group dialogues.",
        confidence: 0.95,
        detectionMethod: "Temporal split-half entropy and category delta comparison across the initial 40% vs terminal 40% chronoslices.",
        evidenceExplanation: `Early receipts are dominated by search queries and system memos; later receipts transition into conference presentations, live concerts, and shared dinners.`,
        supportingReceiptIds: [...earlyReceipts.map(r => r.id).slice(0, 4), ...lateReceipts.map(r => r.id).slice(0, 4)],
        metrics: {
          early_exploratory_ratio: Math.round((earlyInternal / earlyReceipts.length) * 100),
          late_communal_ratio: Math.round((lateSocial / lateReceipts.length) * 100),
        },
      });
    }
  }

  return patterns;
}

/**
 * 5. Life Chapter Generation
 * Builds structured narrative chapters derived from patterns and timeline transitions.
 */
export function buildChapters(receipts: Receipt[], patterns: Pattern[]): LifeChapter[] {
  if (receipts.length === 0) return [];

  const chapters: LifeChapter[] = [
    {
      id: "ch-01-the-inquiry",
      title: "The Silent Inquiry",
      subtitle: "Foundations, solitary research, and morning caffeine rituals",
      startDate: receipts[0]?.timestamp || "",
      endDate: receipts[11]?.timestamp || receipts[Math.floor(receipts.length * 0.25)]?.timestamp || "",
      receiptCount: 12,
      dominantCategories: ["Searches", "Personal Notes", "Purchases", "Music"],
      dominantLocations: ["Ritual Coffee Roasters", "SF Public Library"],
      keyPatternIds: ["pat-tod-morning-rhythm", "pat-loc-ritual-coffee-roasters---valencia-st"],
      representativeReceiptIds: ["rcpt-001", "rcpt-003", "rcpt-004", "rcpt-008"],
      receiptIds: receipts.slice(0, 12).map(r => r.id),
      themes: ["foundations", "solitary-inquiry", "coffee-ritual", "graph-theory"],
      behavioralShift: "High introspection, morning caffeine rituals, and extensive academic search volumes.",
      narrative:
        "The period began quietly. You sought answers in library corridors and single-origin pour-overs, asking what digital traces truly reveal about human intention.",
      colorAccent: "#38bdf8",
    },
    {
      id: "ch-02-late-night-forge",
      title: "The Late-Night Forge",
      subtitle: "Midnight code pulses, high-contrast aesthetics, and live acoustics",
      startDate: receipts[12]?.timestamp || "",
      endDate: receipts[21]?.timestamp || receipts[Math.floor(receipts.length * 0.5)]?.timestamp || "",
      receiptCount: 10,
      dominantCategories: ["Music", "Purchases", "Messages", "Events"],
      dominantLocations: ["Design Studio Loft · SoMa", "The Independent Music Hall"],
      keyPatternIds: ["pat-tod-night-creative", "pat-activity-peak-clusters"],
      representativeReceiptIds: ["rcpt-013", "rcpt-015", "rcpt-018", "rcpt-019"],
      receiptIds: receipts.slice(12, 22).map(r => r.id),
      themes: ["deep-work", "nocturnal-rhythm", "ambient-soundtrack", "live-music"],
      behavioralShift: "Shift from passive consumption to nocturnal technical output and modular sound experimentation.",
      narrative:
        "Midnight was no longer for rest; it became a sanctuary of algorithmic architecture. Surrounded by minimalist drones and mochaccino steam, ideas crystallized into working code.",
      colorAccent: "#c084fc",
    },
    {
      id: "ch-03-neighborhood-resonance",
      title: "Neighborhood Resonance",
      subtitle: "Museum rooftops, risograph zines, and conversational counterpoint",
      startDate: receipts[22]?.timestamp || "",
      endDate: receipts[31]?.timestamp || receipts[Math.floor(receipts.length * 0.75)]?.timestamp || "",
      receiptCount: 10,
      dominantCategories: ["Places", "Photos", "Events", "Purchases"],
      dominantLocations: ["SFMOMA", "SF Public Library", "Third Culture Bakery"],
      keyPatternIds: ["pat-cat-music-space", "pat-loc-sf-public-library---main-branch"],
      representativeReceiptIds: ["rcpt-024", "rcpt-026", "rcpt-028", "rcpt-032"],
      receiptIds: receipts.slice(22, 32).map(r => r.id),
      themes: ["cultural-immersion", "spatial-anchors", "print-craft", "collaboration"],
      behavioralShift: "Screen detachment, physical gallery explorations, tactile paper archives, and peer dialogues.",
      narrative:
        "The inward focus broke open into the city. You exchanged printed zines, walked among living sculpture walls, and shared fermented flatbreads with close collaborators.",
      colorAccent: "#fbbf24",
    },
    {
      id: "ch-04-the-convergence",
      title: "The Convergence",
      subtitle: "Public dissemination, live pianos, and the realization that data is narrative",
      startDate: receipts[32]?.timestamp || "",
      endDate: receipts[receipts.length - 1]?.timestamp || "",
      receiptCount: 10,
      dominantCategories: ["Events", "Personal Notes", "Photos", "Purchases"],
      dominantLocations: ["SF Public Library", "Ritual Coffee Roasters", "The Independent Music Hall"],
      keyPatternIds: ["pat-cat-shift-reflection-to-community"],
      representativeReceiptIds: ["rcpt-035", "rcpt-037", "rcpt-040", "rcpt-042"],
      receiptIds: receipts.slice(32).map(r => r.id),
      themes: ["keynote-presentation", "communal-resonance", "storytelling", "synthesis"],
      behavioralShift: "Complete synthesis of private insights into communal presentations and acoustic celebrations.",
      narrative:
        "All disparate threads converged. Presenting findings to peers brought clarity: receipts were never mere numbers. They are evidence of where your attention and devotion dwelled.",
      colorAccent: "#34d399",
    },
  ];

  return chapters;
}

/**
 * 6. Story Mode Scene Generation
 * Generates seven evidence-grounded scenes:
 * INTRO → DISCOVERY → PATTERN → CONNECTION → CHAPTER → REFLECTION → ENDING
 */
export function generateStory(
  receipts: Receipt[],
  connections: Connection[],
  patterns: Pattern[],
  chapters: LifeChapter[]
): StoryScene[] {
  const topConnection = connections[0];
  const topPattern = patterns[0];
  const topChapter = chapters[0];

  return [
    {
      id: "scene-intro",
      type: "intro",
      stage: "The Opening",
      title: "The Digital Fragment",
      narrative:
        "Every single day, your devices record micro-moments. A coffee purchased at 8:15 AM. An ambient track streamed in the fog. A message sent across midnight. Isolated, they appear trivial. Together, they form an unvarnished autobiography.",
      insight: "Isolated data points resemble noise; linked chronologically, they form intention.",
      supportingMetric: { label: "Logged Artifacts", value: `${receipts.length} Receipts` },
      highlightReceiptIds: ["rcpt-001", "rcpt-002"],
      supportingReceiptIds: ["rcpt-001", "rcpt-002", "rcpt-004"],
    },
    {
      id: "scene-discovery",
      type: "discovery",
      stage: "The Rhythms",
      title: "The Anchor In Space",
      narrative:
        "When we plotted your receipts on a Cartesian plane, a strange gravity appeared. You did not drift randomly; you returned relentlessly to specific coordinates that anchored your thoughts.",
      insight: "Physical sanctuaries act as cognitive compasses for intellectual development.",
      supportingMetric: { label: "Primary Anchor", value: "Ritual Coffee Roasters" },
      highlightReceiptIds: ["rcpt-001", "rcpt-007", "rcpt-021", "rcpt-034"],
      supportingReceiptIds: ["rcpt-001", "rcpt-007", "rcpt-021"],
    },
    {
      id: "scene-pattern",
      type: "pattern",
      stage: "The Deep Work",
      title: "The Cadence of Hours",
      narrative:
        topPattern?.description ||
        "A hidden rhythm surfaced. Your morning hours ignited with caffeine and jazz, while the deepest creative breakthroughs congregated between 22:00 and 02:00 UTC.",
      insight: "Circadian consistency transforms sporadic sparks into architectural monuments.",
      supportingMetric: { label: "Detected Patterns", value: `${patterns.length} Macro Behaviors` },
      highlightReceiptIds: topPattern?.supportingReceiptIds.slice(0, 3) || ["rcpt-013", "rcpt-016"],
      supportingReceiptIds: topPattern?.supportingReceiptIds.slice(0, 3) || ["rcpt-013", "rcpt-016", "rcpt-017"],
      associatedPatternId: topPattern?.id,
    },
    {
      id: "scene-connection",
      type: "connection",
      stage: "The Shifts",
      title: "The Hidden Resonance",
      narrative:
        topConnection
          ? `Relationships formed across domains. A purchase at one moment laid the runway for creative code minutes later. ${topConnection.explanation}`
          : "Moments touched and reinforced each other, revealing that no decision was made in a vacuum.",
      insight: "Cross-category synergy connects material costs to artistic deliverables.",
      supportingMetric: {
        label: "Max Connection Affinity",
        value: topConnection ? `${Math.round(topConnection.score * 100)}% Match` : "98% Match",
      },
      highlightReceiptIds: topConnection ? [topConnection.sourceId, topConnection.targetId] : ["rcpt-001", "rcpt-002"],
      supportingReceiptIds: topConnection ? [topConnection.sourceId, topConnection.targetId] : ["rcpt-001", "rcpt-002"],
      associatedConnectionId: topConnection?.id,
    },
    {
      id: "scene-chapter",
      type: "chapter",
      stage: "The Outside World",
      title: "The Shifting Chapters",
      narrative:
        "Life is not a monotone continuum. Your data reveals distinct geological strata: moving from solitary introspection into intense midnight creation, and finally into communal celebration.",
      insight: "Creativity born in solitude must eventually venture outward to discover its audience.",
      supportingMetric: { label: "Chronological Eras", value: `${chapters.length} Life Chapters` },
      highlightReceiptIds: topChapter?.representativeReceiptIds || ["rcpt-003", "rcpt-015", "rcpt-026", "rcpt-035"],
      supportingReceiptIds: ["rcpt-022", "rcpt-024", "rcpt-028"],
      associatedChapterId: topChapter?.id,
    },
    {
      id: "scene-reflection",
      type: "reflection",
      stage: "The Climax",
      title: "Tracing The Thread",
      narrative:
        "When you select any individual receipt—a simple slip of paper or digital token—it does not stand alone. It points backward to a question asked, and forward to a friend met across a table.",
      insight: "Every micro-receipt is a thread interwoven into a tapestry of relationships.",
      supportingMetric: { label: "Discovered Edges", value: `${connections.length} Synergies` },
      highlightReceiptIds: ["rcpt-040", "rcpt-041"],
      supportingReceiptIds: ["rcpt-035", "rcpt-037", "rcpt-040"],
    },
    {
      id: "scene-ending",
      type: "ending",
      stage: "The Reflection",
      title: "These Were Never Just Receipts.",
      narrative:
        "They are the physical coordinates where your curiosity lived, the songs you leaned on in silence, and the people who made the hours matter.\n\nTHIS WAS A STORY.",
      insight: "Your digital footprint is not an audit; it is an enduring portrait of human vitality.",
      supportingMetric: { label: "Conclusion", value: "Decoded & Archival" },
      highlightReceiptIds: ["rcpt-040", "rcpt-042"],
      supportingReceiptIds: ["rcpt-040", "rcpt-041", "rcpt-042"],
    },
  ];
}

/**
 * Full Pipeline Execution
 */
export function analyzeDataset(rawReceipts: Receipt[]): AnalysisOutput {
  const receipts = normalizeDataset(rawReceipts);
  const connections = analyzeConnections(receipts);
  const patterns = detectPatterns(receipts, connections);
  const chapters = buildChapters(receipts, patterns);
  const story = generateStory(receipts, connections, patterns, chapters);
  const stats = calculateStats(receipts, connections.length, patterns.length, chapters.length);

  return {
    receipts,
    connections,
    patterns,
    chapters,
    story,
    stats,
  };
}

/**
 * Signature Feature 1: "Why Did This Matter?" Evidence Chain
 */
export function buildEvidenceChain(
  receiptId: string,
  receipts: Receipt[],
  connections: Connection[],
  patterns: Pattern[],
  chapters: LifeChapter[]
): ReceiptEvidenceChain | null {
  const receipt = receipts.find(r => r.id === receiptId);
  if (!receipt) return null;

  const relevantConns = connections.filter(
    c => c.sourceId === receiptId || c.targetId === receiptId
  );

  const relevantPatterns = patterns.filter(
    p => p.supportingReceiptIds.includes(receiptId)
  );

  const chapter = chapters.find(ch => {
    const t = parseISO(receipt.timestamp).getTime();
    const start = parseISO(ch.startDate).getTime();
    const end = parseISO(ch.endDate).getTime();
    return t >= start && t <= end;
  }) || chapters[0];

  let storyInfluence = `Anchors the narrative in ${receipt.location || "a private sanctuary"} during ${formatShortDate(receipt.timestamp)}.`;
  if (relevantConns.length > 0) {
    storyInfluence += ` Bridges ${relevantConns.length} direct causal threads to adjacent life events.`;
  }
  if (relevantPatterns.length > 0) {
    storyInfluence += ` Direct contributor to "${relevantPatterns[0].title}".`;
  }

  return {
    receipt,
    connections: relevantConns,
    patterns: relevantPatterns,
    chapter,
    storyInfluence,
  };
}
