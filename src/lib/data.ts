export const LINKS = {
  github: "https://github.com/AarnavNoble",
  linkedin: "https://linkedin.com/in/aarnav-noble",
  email: "aarnavnoble14@gmail.com",
  resume: "/AarnavNoble-Resume.pdf",
};

export const EXPERIENCE = [
  {
    company: "AethexAI",
    detail: "Voice AI infrastructure · San Francisco, CA",
    role: "Member of Technical Staff Intern",
    period: "Jan 2026 – Apr 2026",
    bullets: [
      "Built the platform's public API and Python SDK from scratch, with 30+ endpoints for mid-call session control",
      "Managed the production AWS/EKS platform on Kubernetes, Terraform, and CI/CD across 500+ pods",
      "Hardened the sub-500ms voice pipeline to 75+ concurrent calls, fixing state races and null crashes under load",
      "Designed a 5-phase interrupt state machine spanning 3 transports, ending dropped speech and state corruption",
      "Rebuilt agent-document RAG across ingestion, concurrency, cross-turn dedup, and grounding over 10K+ chunks",
      "Built a WebRTC call simulator that runs 200+ scripted call scenarios in CI, interrupts included",
    ],
  },
  {
    company: "Environment and Climate Change Canada",
    detail: "Burlington, Ontario",
    role: "AI/ML Developer",
    period: "May 2025 – Aug 2025",
    bullets: [
      "Designed and built a PyTorch GNN, 4 message-passing layers over a 10K+ node basin graph",
      "Beat gradient-boosted baselines by 85%, replacing hand-built spatial features with learned graph structure",
      "Extended usable output 5x by generating forecasts at graph nodes with no observed data",
      "Engineered 50+ spatial-temporal features and cut a full run from hours to minutes by vectorizing and parallelizing",
      "Led ML on a 6-person research team from architecture to eval, presenting results toward a publication",
    ],
  },
  {
    company: "Toronto Transit Commission",
    detail: "Toronto, Ontario",
    role: "Software Developer",
    period: "Sep 2024 – Dec 2024",
    bullets: [
      "Built an idempotent deployment system that drove 10K+ devices to a declared software state from one config",
      "Automated zero-touch OS provisioning with network-boot and Bash pipelines, cutting per-device setup ~50%",
      "Wrote Python/Bash orchestration for staged patch and driver rollouts across 2K+ machines, with auto-retry on failure",
    ],
  },
  {
    company: "UW Orbital",
    detail: "Waterloo, Ontario",
    role: "Firmware & Control Systems Developer",
    period: "Jan 2024 – Dec 2024",
    bullets: [
      "Wrote an LM75BD temperature-sensor driver in C over I2C with real-time over-temp shutdown under FreeRTOS",
      "Built an STM32 satellite thermal controller in MATLAB/Simulink",
    ],
  },
  {
    company: "Ontario Chamber of Commerce",
    detail: "Toronto, Ontario",
    role: "Software Developer",
    period: "Jan 2024 – Apr 2024",
    bullets: [
      "Built 10+ configurable storefront widgets with a JSON-schema settings layer, customized by non-devs with no code",
      "Built a Dockerized Go webhook service on Kubernetes that synced Shopify events into storefronts via GraphQL",
      "Modeled 15+ Shopify Metaobject types as a custom data layer, bound to live storefront content",
      "Secured the embedded app with session-token auth, scoped OAuth, and HMAC-verified webhooks against forged events",
    ],
  },
];

export const EDUCATION = {
  school: "University of Waterloo",
  degree: "B.ASc. Honours Computer Engineering",
  period: "2023 – 2028 (expected)",
  location: "Waterloo, Ontario",
  courses: [
    "Data Structures & Algorithms",
    "Systems Programming & Concurrency",
    "Digital Circuits (VHDL)",
    "Embedded Microprocessor Systems",
    "Signals & Systems",
  ],
};

const PROJECTS_RAW = [
  {
    slug: "roam",
    name: "Roam",
    tagline: "AI travel planner built on dense retrieval, learning-to-rank, and route optimization. Not an LLM wrapper.",
    description:
      "Give it a destination, trip length, transport mode, and interests; it returns a day-by-day itinerary with stops ordered to minimize travel time. Most AI travel apps are LLM wrappers. Roam builds the actual ML stack: dense retrieval, learning-to-rank, and combinatorial optimization, with the LLM used only for the final synthesis pass.",
    github: "https://github.com/AarnavNoble/roam",
    demo: null,
    stack: ["Python", "FastAPI", "sentence-transformers", "FAISS", "LightGBM", "OR-Tools", "Groq", "React Native"],
    pipeline: [
      {
        step: "RAG Retrieval",
        tech: "FAISS + sentence-transformers",
        detail:
          "Scrapes Wikivoyage and Reddit trip reports per destination. Chunks into 512-word overlapping windows, embeds with all-MiniLM-L6-v2, stores in a FAISS flat index. Retrieves top-5 semantically relevant chunks to ground the LLM.",
      },
      {
        step: "POI Fetch",
        tech: "Overpass API (OpenStreetMap)",
        detail: "Pulls local points of interest. Filters out chains and low-signal tags. Returns name, coordinates, categories, and opening hours.",
      },
      {
        step: "Preference Ranking",
        tech: "LightGBM LambdaRank",
        detail:
          "Scores each POI against the user's stated goals using 8 features: cosine similarity between goal embedding and POI description, category match signals (food/nature/history/nightlife), tag richness. NDCG-optimized ranking, same objective as production search engines.",
      },
      {
        step: "Route Optimization",
        tech: "OR-Tools VRP",
        detail:
          "Builds an N×N travel time matrix (OpenRouteService, Haversine fallback). Solves TSP per day with time window constraints and visit duration estimates. Greedy day assignment respects a 10-hour daily budget.",
      },
      {
        step: "LLM Synthesis",
        tech: "Groq · Llama 3.3 70B",
        detail: "Receives the optimized route and retrieved travel context. Writes the natural-language itinerary. This is the only LLM step; everything above it is deterministic ML.",
      },
    ],
    sampleOutput: {
      label: "Sample output: Tokyo, 2 days, walking, food + history",
      days: [
        {
          day: "Day 1",
          stops: [
            { time: "09:00", name: "Senso-ji Temple", area: "Asakusa", note: "Arrive early to beat crowds. One of Tokyo's oldest temples." },
            { time: "10:30", name: "Nakamise-dori", area: "Asakusa", note: "Street market leading to the temple gate. Ningyoyaki and sembei." },
            { time: "12:30", name: "Tsukiji Outer Market", area: "Chuo", note: "Fresh sushi, tamagoyaki, street food. Inner market moved to Toyosu." },
            { time: "15:00", name: "teamLab Borderless", area: "Azabudai", note: "Digital art museum. Book in advance." },
          ],
        },
        {
          day: "Day 2",
          stops: [
            { time: "08:30", name: "Meiji Jingu", area: "Harajuku", note: "Forest shrine dedicated to Emperor Meiji. Quiet in the morning." },
            { time: "11:00", name: "Takeshita Street", area: "Harajuku", note: "Crepes and Harajuku fashion." },
            { time: "13:30", name: "Ramen Nagi", area: "Shinjuku", note: "Niboshi (dried sardine) broth, rich and savoury." },
            { time: "15:30", name: "Shinjuku Gyoen", area: "Shinjuku", note: "Large national garden. Good for an afternoon walk." },
          ],
        },
      ],
    },
  },
  {
    slug: "dothraki-asr",
    name: "Dothraki ASR",
    tagline: "Zero-shot ASR for a constructed language with zero training data; phoneme matching against the Dothraki lexicon.",
    description:
      "Dothraki was invented by linguist David J. Peterson for HBO's Game of Thrones. It has a documented phonology and a 4,000-word lexicon, but zero representation in any ASR training set. This project tests whether multilingual Whisper can produce useful output when run zero-shot on Dothraki audio, and whether that output can be mapped back to real Dothraki words via phoneme matching.",
    github: "https://github.com/AarnavNoble/dothraki-asr",
    demo: null,
    stack: ["Python", "mlx-whisper", "Demucs", "espeak-ng", "gruut", "Next.js", "wavesurfer.js"],
    pipeline: [
      {
        step: "Vocal Isolation",
        tech: "Demucs",
        detail: "Game of Thrones scenes mix Dothraki dialogue with film score and SFX. Demucs separates the vocal stem from the audio before anything else runs.",
      },
      {
        step: "Zero-Shot ASR",
        tech: "mlx-whisper",
        detail: "Whisper (Apple Silicon optimized) transcribes the isolated vocal. It has never seen Dothraki; the output is phonetically plausible English/gibberish that approximates what it hears.",
      },
      {
        step: "IPA Conversion",
        tech: "espeak-ng + gruut",
        detail: "The Whisper output is converted to International Phonetic Alphabet. This decouples the matching step from Whisper's specific romanization choices.",
      },
      {
        step: "Phoneme Matching",
        tech: "custom engine",
        detail: "The IPA sequence is matched against a phonemicized Dothraki lexicon using edit distance with language-specific substitution costs. Returns candidate Dothraki words per phrase segment.",
      },
      {
        step: "Translation",
        tech: "lexicon lookup",
        detail: "Matched Dothraki words are looked up in the Peterson lexicon to produce an English gloss.",
      },
    ],
    sampleOutput: {
      label: "Sample trace: \"Hash yer dothrae chek?\"",
      steps: [
        { label: "Scene audio", value: "raw GoT scene with music and SFX" },
        { label: "After Demucs", value: "isolated vocal stem" },
        { label: "Whisper output", value: "\"hash ya dot rat check\"" },
        { label: "IPA", value: "/hæʃ jɑː dɒt ɹæt tʃɛk/" },
        { label: "Dothraki match", value: "hash · yer · dothrae · chek" },
        { label: "Translation", value: "\"Are you riding well?\"" },
      ],
    },
  },
  {
    slug: "vestige",
    name: "Vestige",
    tagline: "Observability and eval platform for production AI agents: replays real failures as deterministic CI tests, at zero model API cost.",
    description:
      "Production AI agents fail in ways unit tests don't catch: a prompt edit changes tone, a tool call returns something unexpected, and nobody notices until a customer does. Vestige instruments every LLM call, tool call, and transitive HTTP request in an agent run via OpenTelemetry, then lets you promote any recorded run into a regression test. Replay reconstructs that failure from content-hashed fixtures instead of live model calls, so a full test suite re-run costs nothing and never touches a real provider. A GitHub Actions gate runs this on every pull request and blocks the merge on regression.",
    github: null,
    demo: "https://vestigeapp.vercel.app/",
    stack: ["Python", "Go", "TypeScript", "Next.js", "OpenTelemetry", "ClickHouse"],
    pipeline: [
      {
        step: "Capture",
        tech: "OpenTelemetry SDK",
        detail:
          "Auto-instruments OpenAI and Anthropic calls via OTel GenAI semantic conventions and patches httpx/requests at the transport layer to capture every hidden HTTP call inside a tool function, the signal that makes replay possible at all.",
      },
      {
        step: "Ingest",
        tech: "Go + ClickHouse",
        detail:
          "A Go OTLP receiver normalizes spans and batches them into a ClickHouse schema partitioned by day and ordered by trace for fast single-trace reads, backed by a write-ahead log so a database outage degrades ingest instead of dropping spans.",
      },
      {
        step: "Promote",
        tech: "content-hashed fixtures",
        detail:
          "Any recorded trace can be frozen into a regression test. Every external request/response pair captured during that run is content-hashed and stored, forming a deterministic manifest keyed by request hash.",
      },
      {
        step: "Replay",
        tech: "pg-boss worker",
        detail:
          "A Postgres-backed job re-runs the agent with the same code path, but every outbound call is intercepted and served from the recorded fixture by hash instead of hitting a real model. Zero LLM calls, zero cost, byte-exact determinism.",
      },
      {
        step: "Diff & gate",
        tech: "GitHub Actions",
        detail:
          "The replayed output is diffed against the original at the token level. A GitHub App posts a check on every pull request and blocks the merge if any promoted test regresses.",
      },
    ],
    sampleOutput: {
      label: "Sample regression: synthesizer prompt edit",
      steps: [
        { label: "Original trace", value: "refund_request → \"Refund of $50 has been issued.\"" },
        { label: "Promoted to test", value: "fixture manifest frozen, 3 spans" },
        { label: "Prompt edited", value: "+\"Always end with a poem about logistics.\"" },
        { label: "Replay (0 API calls)", value: "reruns against recorded fixtures only" },
        { label: "Diff detected", value: "reply now ends in unsolicited verse" },
        { label: "CI check", value: "✕ merge blocked" },
      ],
    },
  },
  {
    slug: "flame-forecaster",
    name: "Flame Forecaster",
    tagline: "Wildfire severity prediction for Alberta, built with a 4-person team for an Ernst & Young hackathon.",
    description:
      "Alberta wildfire records (fire location, cause, weather, spread rate, ~22,900 rows) broken down by FSA region to find the areas most vulnerable to severe fires, then modeled to predict final burned area. Linear and ridge regression collapsed on this data (R² = -0.14, essentially no signal); the team swept SVR, Random Forest, and Kernel Ridge before landing on a tuned XGBoost regressor validated with repeated k-fold cross-validation, cutting mean squared error by roughly 97% over the linear baseline.",
    github: "https://github.com/pandya-aditya/Flame_Forecaster",
    demo: null,
    stack: ["Python", "pandas", "NumPy", "scikit-learn", "XGBoost", "seaborn"],
    pipeline: [
      {
        step: "Data Cleaning",
        tech: "pandas + z-score filtering",
        detail:
          "~22,900 Alberta wildfire records: geography, cause, weather, and spread data. Rows more than 2 standard deviations from the mean on any numeric feature are dropped before modeling.",
      },
      {
        step: "Regional Analysis",
        tech: "pandas + seaborn",
        detail:
          "Heatmaps and stacked bar charts break down fire count and size class by FSA region, cause, and origin, weighted by population, to surface the regions most vulnerable to severe fires.",
      },
      {
        step: "Feature Engineering",
        tech: "NumPy + datetime",
        detail:
          "Derives total burn duration (extinguish time minus start time) and fire spread rate as the primary predictors of final fire size.",
      },
      {
        step: "Model Benchmarking",
        tech: "scikit-learn",
        detail:
          "Linear and ridge regression collapse on this data (R² = -0.14). The team swept SVR, Random Forest, and Kernel Ridge, cutting MSE by roughly 97% over the linear baseline.",
      },
      {
        step: "Final Model",
        tech: "XGBoost",
        detail:
          "An XGBRegressor tuned via repeated k-fold cross-validation (6 folds × 3 repeats) predicts final burned area from spread rate and duration.",
      },
    ],
    sampleOutput: {
      label: "Model sweep: linear baseline vs. tuned XGBoost",
      steps: [
        { label: "Linear baseline", value: "R² = -0.14 · MSE ≈ 4.28M ha²" },
        { label: "Outlier removal", value: "z-score filtering, |z| > 2" },
        { label: "Non-linear sweep", value: "SVR, Random Forest, Kernel Ridge" },
        { label: "Final model (XGBoost)", value: "6-fold × 3-repeat CV · MSE ≈ 110.9K ha²" },
        { label: "Improvement", value: "~97% MSE reduction vs. linear baseline" },
      ],
    },
  },
];

// Display order: Vestige is the flagship and leads.
const PROJECT_ORDER = ["vestige", "roam", "dothraki-asr", "flame-forecaster"];
export const PROJECTS = PROJECT_ORDER.map(
  (slug) => PROJECTS_RAW.find((p) => p.slug === slug)!,
);
