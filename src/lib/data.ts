export const LINKS = {
  github: "https://github.com/AarnavNoble",
  linkedin: "https://linkedin.com/in/aarnav-noble",
  email: "aarnavnoble14@gmail.com",
};

export const EXPERIENCE = [
  {
    company: "AethexAI",
    detail: "Stealth voice AI startup · London, UK",
    role: "Member of Technical Staff, Intern",
    period: "Jan 2026 – Apr 2026",
    bullets: [
      "Post-call LLM pipeline to correct ASR transcripts across every production call; parallelized per-turn, async from the live path, zero latency impact",
      "5-phase conversation state machine resolving interrupt-handling failures in a sub-500ms voice pipeline; fixed recording timeline drift across WebRTC, telephony, and WebSocket",
      "Designed and shipped 100+ REST and WebSocket endpoints for the external developer API and Python SDK: session lifecycle, outbound calls, webhooks, browser auth",
      "AWS/EKS: Kubernetes deployments, Terraform infra, OIDC secret management, 500+ pods in production; CI/CD endpoint-change notification workflows",
      "Hardened the RAG knowledge-base pipeline against concurrent loading races, cross-turn retrieval dedup, and S3 key collisions",
    ],
  },
  {
    company: "Environment and Climate Change Canada",
    detail: "Burlington, Ontario",
    role: "AI/ML Developer",
    period: "May 2025 – Aug 2025",
    bullets: [
      "Basin-wide GNN (PyTorch) for Lake Erie concentration forecasting integrating satellite and atmospheric data; 5× spatial coverage vs. traditional approaches",
      "XGBoost pipeline with multi-source spatial feature engineering (weather, satellite, soil), 85% accuracy improvement",
    ],
  },
  {
    company: "Toronto Transit Commission",
    detail: "Toronto, Ontario",
    role: "Software Analyst",
    period: "Sep 2024 – Dec 2024",
    bullets: [
      "Automated OS imaging via PXE boot and bash scripting for 2000+ devices, 50% faster imaging",
      "Remote software migration for 400+ devices via DSM, 60% operational efficiency improvement",
    ],
  },
  {
    company: "UW Orbital",
    detail: "Waterloo, Ontario",
    role: "Firmware & Control Systems Developer",
    period: "Jan 2024 – Dec 2024",
    bullets: [
      "LM75BD temperature sensor driver in C over I2C with real-time over-temperature shutdown under FreeRTOS",
      "STM32 satellite thermal controller in MATLAB/Simulink",
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

export const PROJECTS = [
  {
    slug: "roam",
    name: "Roam",
    tagline: "AI travel planner built on dense retrieval, learning-to-rank, and route optimization. Not an LLM wrapper.",
    description:
      "Give it a destination, trip length, transport mode, and interests; it returns a day-by-day itinerary with stops ordered to minimize travel time. Most AI travel apps are LLM wrappers. Roam builds the actual ML stack: dense retrieval, learning-to-rank, and combinatorial optimization, with the LLM used only for the final synthesis pass.",
    github: "https://github.com/AarnavNoble/roam",
    demo: "https://huggingface.co/spaces/AarnavNoble/roam",
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
];
