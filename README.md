# LIFE//RECEIPT

> **Your digital life, decoded.**  
> *Receipts are moments. Connections reveal meaning. Chapters reveal patterns. Your story brings it all together.*

---

## 1. Executive Summary & Problem Statement

Modern individuals generate thousands of transactional and interaction artifacts every month:
- Digital purchase statements and cafe cards
- Streaming service tracks and listening sessions
- Location visits and check-ins
- Calendar events and ticket stubs
- Saved bookmarks, notes, and search queries

When viewed as raw lists or financial dashboards, these records feel cold, fragmented, and meaningless. **LIFE//RECEIPT** solves this by treating transactional logs not as accounting data, but as **the archeological footprints of human intention and devotion**.

By processing atomic digital records through a **100% deterministic, client-side analytical pipeline**, LIFE//RECEIPT decodes:
1. **Connections**: Why discrete events are tied through spatial proximity, temporal adjacency, shared entities, and cross-category routines.
2. **Patterns**: Algorithmic detection of circadian habits, repeated physical sanctuaries, and macro behavioral shifts.
3. **Chapters**: Segmenting a person's life into narrative eras resembling chapters in an unfolding memoir.
4. **Story**: A 7-stage interactive digital documentary that synthesizes life data into emotional clarity.

---

## 2. Architectural Design

```
+---------------------------------------------------------------------------------+
|                               LIFE//RECEIPT ENGINE                              |
+---------------------------------------------------------------------------------+
                                      |
                       [Raw Logs / Kaggle JSON Ingestion]
                                      |
                                      v
                        +----------------------------+
                        |     datasetAdapter.ts      |
                        |   Schema Normalization     |
                        +----------------------------+
                                      |
                                      v
                        +----------------------------+
                        |    analysisPipeline.ts     |
                        | (Pure Functional Pipeline) |
                        +----------------------------+
                         /     |         |         \
                        /      |         |          \
                       v       v         v           v
                 [Stats] [Connections] [Patterns] [Chapters]
                       \       |         |          /
                        \      |         |         /
                         v     v         v        v
                        +----------------------------+
                        |        generateStory       |
                        |   7-Stage Narrative Arc    |
                        +----------------------------+
                                      |
                                      v
                        +----------------------------+
                        |      DatasetProvider       |
                        |    (React State Bridge)    |
                        +----------------------------+
                                      |
              +-----------------------+-----------------------+
              |                       |                       |
              v                       v                       v
      [Exploration UI]        [Topological Graph]     [Documentary Mode]
```

### Key Architectural Tenets:
1. **Frontend-Only Execution**:
   - Zero backend servers, zero databases, zero external AI model API calls.
   - Operates in-browser with sub-millisecond calculation times and offline resilience.
2. **Determinism & Explainability**:
   - Every metric, connection score, pattern confidence, and chapter boundary is backed by reproducible mathematical formulas and tangible receipt references.
   - Zero hallucinated statements; 100% evidence-grounded insights.
3. **Single Source of Truth**:
   - All derived artifacts (`connections`, `patterns`, `chapters`, `story`, `stats`) are produced atomically by `analyzeDataset(receipts)` within `DatasetProvider`.
4. **Clean Decoupling**:
   - Presentation components (`HomePage`, `ExplorePage`, `ConnectionsPage`, `PatternsPage`, `ChaptersPage`, `StoryPage`) consume domain state via the `useDataset()` hook.

---

## 3. Core Features & Capabilities

### A. The Receipt Archive (`/explore`)
- **Faceted Multi-Axis Filtering**: Instant real-time filtering across Category, Physical Location Anchor, Thematic Tag, and Start/End Date window.
- **Full-Text Lexical Search**: Searches titles, descriptions, entities, places, and tags with relevance scoring.
- **Chronological & Relevance Sorting**: Newest, oldest, or matched relevance.
- **Detailed Receipt Inspection**: Modal inspection showing full metadata, location coordinates, supporting patterns, and adjacent chronological events.

### B. Topological Relationship Graph (`/connections`)
- **Interactive Force/Radial Canvas**: Visualizes receipts as nodes scaled by connection degree, with category-colored indicators and affinity-weighted edge lines.
- **Interactive Edge Verification**: Clicking any edge explains *why* the two receipts are connected, displaying calculated scores and shared feature vectors.
- **Accessible Table Alternative**: A full WCAG-compliant table alternative allows keyboard users and screen readers to inspect all relationships without relying on canvas mouse drag.

### C. Algorithmic Pattern Intelligence (`/patterns`)
- **Activity Peaks**: Density cluster calculations identifying unusually high creative or social bursts.
- **Repeated Places**: Physical sanctuaries visited $\ge 4$ times across diverse life domains.
- **Category Couplings**: Cross-domain routines (e.g., Music $\leftrightarrow$ Places morning rituals).
- **Circadian Rhythms**: Time-of-day distribution across Morning, Afternoon, Evening, and Night.
- **Macro Behavioral Shifts**: Split-half entropy analysis detecting evolutions (e.g., from solitary research to communal exhibitions).

### D. Life Chapters Memoir (`/chapters`)
- **Memoir Page Metaphor**: Visual chapters resembling pages in an autobiography.
- **Algorithmic Boundary Detection**: Explains the exact category variance or temporal inflection that triggered the era shift.
- **Chapter Artifacts**: Lists dominant themes, observed behavioral transitions, and verified anchor receipts.

### E. Story Mode Documentary (`/story`)
- **7-Stage Unfolding Narrative**:
  1. *The Opening*: The Digital Fragment
  2. *The Rhythms*: The Anchor In Space
  3. *The Deep Work*: The Cadence of Hours
  4. *The Shifts*: The Hidden Resonance
  5. *The Outside World*: The Shifting Chapters
  6. *The Climax*: Tracing The Thread
  7. *The Reflection*: These Were Never Just Receipts
- **Playback Controls**: Autoplay with pause/play toggle, stage scrubber, and keyboard arrow keys (`←` / `→` / `Space`).

---

## 4. Signature Innovations

### 1. "Why Did This Matter?"
When any receipt is inspected, users can trigger an unbroken **5-step evidence chain**:
$$\text{Receipt} \longrightarrow \text{Connection} \longrightarrow \text{Pattern} \longrightarrow \text{Chapter} \longrightarrow \text{Story Influence}$$
This bridges micro transactions into macro life meaning, proving how a single morning coffee or late-night audio stream catalysed a project milestone.

### 2. "Follow the Thread"
An interactive digital archaeology drawer enabling users to trace relational trajectories:
$$\text{Starting Receipt} \longrightarrow \text{Connected Receipt} \longrightarrow \text{Discovered Pattern} \longrightarrow \text{Life Chapter}$$

### 3. Kaggle Dataset Adapter (`datasetAdapter.ts`)
Allows users to inject arbitrary JSON datasets or Kaggle exports (e.g., Google Takeout, Spotify Extended History, Apple Health/Location). The adapter validates fields, normalizes schemas, and re-executes the entire analytical pipeline instantly.

---

## 5. Performance & Accessibility (WCAG AA Compliance)

- **Strict WCAG AA Color Contrast**: All text elements meet or exceed the 4.5:1 minimum contrast ratio against dark backgrounds (`#0a0a0a` / `#171717`).
- **Screen Reader Support & ARIA Landmarks**:
  - Accessible dialog modals (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`).
  - Native skip-to-content anchor link (`#main-content`).
  - Non-text visual elements marked with `aria-hidden="true"`.
- **Keyboard Traversal**:
  - All interactive elements are fully focusable with high-contrast amber focus rings (`focus-visible:ring-2 focus-visible:ring-amber-400`).
  - Escape key closes all modals and drawers.
  - Arrow keys control story playback.
- **Reduced Motion Support**:
  - Honors `prefers-reduced-motion: reduce`. Automatically defaults graph visualizations to the accessible table mode.
- **Zero Heavy Graph Bundle Dependencies**: Custom deterministic SVG canvas without heavy D3 force bundles, keeping initial bundle size minimal and responsive.

---

## 6. Verification & Test Suite

- TypeScript strict type checking passes with **0 errors**.
- Vite production build compiles with **0 warnings**.
- Fully responsive across mobile (375px), tablet (768px), and wide desktop (1440px+).

```bash
# Build verification
npm run build
```
