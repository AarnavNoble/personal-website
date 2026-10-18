export const LINKS = {
  github: "https://github.com/AarnavNoble",
  linkedin: "https://linkedin.com/in/aarnav-noble",
  email: "anoble@uwaterloo.ca",
  resume: "/AarnavNoble-Resume.pdf",
};

export const EXPERIENCE = [
  {
    company: "AethexAI",
    detail: "Voice AI infrastructure · San Francisco, CA",
    role: "Member of Technical Staff Intern",
    period: "Jan 2026 – Apr 2026",
    bullets: [
      "Owned the public API and Python SDK end to end: 100+ endpoints, including control of calls already in progress",
      "Ran the production AWS/EKS platform on Kubernetes, Terraform, and CI/CD at 500+ pods, with KEDA autoscaling that pre-warms GPU workers when a call connects instead of waiting out a 5-minute cold start",
      "Held streaming latency under 500ms at 75+ concurrent calls on a platform taking 15K+ calls a day",
      "Built eval infrastructure for the voice agent: an LLM judge scoring 270 real calls, Langfuse tracing, and a TTS pipeline gated on the results",
      "Designed a 5-phase interrupt state machine across 3 transports that removed the failures behind roughly 80% of interrupts",
      "Rebuilt agent RAG for launch with thread-safe ingestion, dedup across turns, and grounding over 10K+ chunks",
      "Replaced manual regression checks with a Monte Carlo and WebRTC call simulator that runs 1,400 scripted calls",
    ],
  },
  {
    company: "Environment and Climate Change Canada",
    detail: "Burlington, Ontario",
    role: "AI/ML Developer",
    period: "May 2025 – Aug 2025",
    bullets: [
      "Designed and trained a PyTorch GNN, 4 message-passing layers over a 10K+ node basin graph",
      "Beat gradient-boosted baselines by 85%, replacing hand-built spatial features with learned graph structure",
      "Ruled out spatial overfitting with region-holdout cross-validation and a 100+ run hyperparameter sweep",
      "Extended usable output 5x by generating forecasts at graph nodes with no observed data",
      "Engineered 50+ spatial-temporal features and cut a full run from hours to minutes by vectorizing and parallelizing",
      "Led ML on a 6-person research team from architecture to eval, presenting results toward a publication",
    ],
  },
  {
    company: "Toronto Transit Commission",
    detail: "Toronto, Ontario",
    role: "Software Engineering Intern",
    period: "Sep 2024 – Dec 2024",
    bullets: [
      "Built config-as-code deployment that holds a 10K+ device fleet to one declared software state",
      "Automated zero-touch bare-metal provisioning over network boot and Bash, roughly halving setup time per device",
      "Wrote staged patch and driver rollouts across 2K+ machines that retry failed hosts automatically",
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
      "Built 10+ reusable React storefront components with schema-driven settings that non-developers edit in a visual editor",
      "Wrote a Dockerized Go service on Kubernetes that feeds external data into 15+ Shopify Metaobject types bound to live content",
      "Locked down the embedded app with session-token auth, scoped OAuth, and HMAC verification on every webhook",
    ],
  },
];

export const OPEN_SOURCE = [
  {
    project: "vLLM AIBrix",
    detail: "vLLM's Kubernetes control plane for LLM serving: routing, autoscaling, KV cache",
    role: "Top-20 contributor",
    stats: "15 merged PRs",
    link: "https://github.com/vllm-project/aibrix/pulls?q=is%3Apr+author%3AAarnavNoble",
    color: "#E8A33D",
    tags: ["Go", "Kubernetes", "Redis", "Prometheus"],
    bullets: [
      "Moved prefill/decode admission ahead of the prefill leg, so a burst against a full decode pod runs 1 GPU prefill instead of 16 that get thrown away",
      "Made the KPA autoscaler keep its panic state between reconciles, so a traffic spike holds peak capacity for up to 180s instead of none",
      "Aged stale pods out of the prefix-cache index, so routing stops favouring pods that already evicted the matching KV cache",
      "Fixed least-latency routing ignoring queue time, and streamed requests being metered and closed out on their first usage chunk instead of their last",
      "Plus fixes to autoscaler status reporting, per-autoscaler state cleanup, and annotation validation",
    ],
  },
  {
    project: "FastMCP",
    detail: "Python framework for building MCP servers and clients",
    role: "Contributor",
    stats: "5 PRs in review",
    link: "https://github.com/PrefectHQ/fastmcp/pulls?q=is%3Apr+author%3AAarnavNoble",
    color: "#34d399",
    tags: ["Python", "MCP", "OpenAPI", "JSON Schema"],
    bullets: [
      "Fixes to OpenAPI-to-tool schema generation: $ref pointers into component schemas, readOnly properties, and shared references",
      "Proxies now pass prompt argument titles and the client's sampling result through unchanged",
    ],
  },
];

export const EDUCATION = {
  school: "University of Waterloo",
  degree: "B.ASc. Honours Computer Engineering",
  period: "Sep 2023 – Apr 2028 (expected)",
  location: "Waterloo, Ontario",
  courses: [
    "Operating Systems",
    "Computer Architecture",
    "Compilers",
    "Databases",
    "Computer Networks",
    "Data Structures & Algorithms",
    "Concurrency",
    "Probability & Statistics",
  ],
};

const PROJECTS_RAW = [
  {
    slug: "roam",
    name: "Roam",
    short: "Plans a day of travel where a ranker and a solver build the route, not an LLM.",
    tagline: "AI travel planner where the route is ranked and solved, not written by an LLM: learning-to-rank, route optimization, and a fallback for every upstream.",
    highlights: [
      "The ranker and solver choose and order real places; the LLM only narrates, on 74% fewer tokens",
      "Profiling showed 82% of a 41s request waiting on map queries; batching and caching brought repeat requests to 2s",
      "Keeps serving through LLM and map outages, verified by 36 injected failures across 5 upstream APIs",
    ],
    description:
      "Give it a city, a starting point, a number of hours, and a list of interests; it returns a day plan with stops ordered and timed. Places come from OpenStreetMap, a LightGBM ranker picks which ones to visit, and an OR-Tools solver decides the order and arrival times. The LLM only writes prose keyed by stop number, which the server joins onto the route, so names, coordinates, and times never pass through model output. Every stage that depends on an outside service has a fallback, and each response lists the ones it used. Reworking the request path took median latency from 40.7 s to 17.7 s on a first request and 2.0 s on a repeat, and a tool-calling agent edits a saved trip in plain language.",
    github: "https://github.com/AarnavNoble/roam",
    demo: "https://aarnavnoble-roam.hf.space/",
    stack: ["Python", "FastAPI", "LightGBM", "OR-Tools", "FAISS", "PostgreSQL", "OpenTelemetry", "sentence-transformers", "Groq", "React Native"],
    pipeline: [
      {
        step: "RAG Retrieval",
        tech: "FAISS + sentence-transformers",
        detail:
          "Wikivoyage and Reddit trip reports for 10 cities, embedded with all-MiniLM-L6-v2 into a FAISS index. Retrieval runs on a worker thread alongside geocoding and the POI fetch, and the request continues without context if it fails.",
      },
      {
        step: "POI Fetch",
        tech: "Overpass API (OpenStreetMap)",
        detail:
          "One batched Overpass query covers every category. Mirrors are hedged and each has its own circuit breaker; results are cached in memory for an hour, and a stored copy up to 7 days old is served when every mirror is down. This stage was 82% of request time before the rework.",
      },
      {
        step: "Preference Ranking",
        tech: "LightGBM LambdaRank",
        detail:
          "Scores each place against the traveller's goals using 14 features, trained on 4,785 relevance pairs graded by an LLM judge. In leave-one-city-out evaluation it reaches NDCG@10 of 0.725 against 0.636 for cosine similarity alone on the pool the app actually ranks. CI fails if the model stops beating that baseline.",
      },
      {
        step: "Route Optimization",
        tech: "OR-Tools",
        detail:
          "Each day is solved as an open path from the start location, with a penalty for reaching a stop outside its preferred time of day. Soft windows mean a packed day always has an answer; against the earlier heuristic the solver travels 3.1% less and spends 7.3% less time off-window.",
      },
      {
        step: "LLM Writing",
        tech: "Groq · model failover",
        detail:
          "Receives the finished route as a numbered list and returns prose keyed by stop number, using 74% fewer tokens than echoing every stop as JSON. If no model answers, the same itinerary is returned with text written from OpenStreetMap tags.",
      },
      {
        step: "Trip Editing",
        tech: "tool-calling agent",
        detail:
          "A plain loop with six tools edits a saved trip from a request like \"swap the museum for a park\". Guardrails live in the session, not the prompt: a place can be added only if a search returned it, and the result is saved as a new trip. It passes 14 of 17 eval cases.",
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
    slug: "llm-engine",
    name: "LLM Engine",
    short: "An LLM inference server written from scratch in C++ and CUDA.",
    tagline: "LLM inference server written from scratch in C++ and CUDA: paged KV cache, continuous batching, prefix caching, and an OpenAI-compatible streaming API. No PyTorch at runtime.",
    highlights: [
      "Matches PyTorch layer by layer across all 24 layers, on two model architectures",
      "Continuous batching cuts time to first token 53x over static batching on an A40; paged KV cache lifts slot use from 55% to 99%",
      "8 hand-written CUDA kernels; profiling put 88% of a decode step in attention, and sharing K/V across GQA groups made it 1.6x faster",
      "Serves a live view of its own scheduler: requests joining a running batch, shared prefixes, preemption under memory pressure",
    ],
    description:
      "A small serving engine for Llama-architecture models (Qwen2.5-0.5B, TinyLlama-1.1B) built from the same parts production engines use. Weights are read straight from safetensors, the tokenizer parses tokenizer.json directly, and the CPU forward pass is checked layer by layer against Hugging Face on 22 prompts. The CUDA backend keeps the whole forward pass on the device, with hand-written kernels for embedding, RMSNorm, RoPE, the KV cache write, and paged decode attention, and is gated against the CPU path as its oracle. On an A40, continuous batching cuts time to first token 53x over static batching and prefix caching cuts it 14.4x on a shared system prompt. Every published number names the machine it was measured on, and CI fails if a figure quoted in the docs disagrees with the benchmark data.",
    github: "https://github.com/AarnavNoble/llm-engine",
    demo: null,
    stack: ["C++17", "CUDA", "cuBLAS", "CMake", "Catch2", "Prometheus", "Docker", "Helm", "KEDA"],
    pipeline: [
      {
        step: "Model Loading",
        tech: "safetensors + tokenizer.json",
        detail:
          "Reads weights from safetensors and parses the tokenizer file directly, with every dimension taken from the model config. A second architecture, TinyLlama-1.1B, passes the same verification unchanged.",
      },
      {
        step: "Paged KV Cache",
        tech: "16-token blocks + block tables",
        detail:
          "Each sequence owns a table of fixed-size blocks drawn from a free list, so a prompt allocates only what it uses: 99.0% slot utilization against 54.8% for a contiguous allocator with a declared output cap on the same workload.",
      },
      {
        step: "Continuous Batching",
        tech: "iteration-level scheduler",
        detail:
          "Finished sequences leave the batch on the step they finish and new ones join on the next, under a token budget. Long prompts are prefilled in chunks, and an admission watermark cuts preemption recompute waste from 17.1% to 4.7% of all token work.",
      },
      {
        step: "Prefix Caching",
        tech: "chained block hashes",
        detail:
          "Full blocks are hashed together with the previous block's hash and shared by refcount, so requests with the same system prompt skip its prefill. Unowned blocks sit in an LRU until memory pressure evicts them.",
      },
      {
        step: "CUDA Backend",
        tech: "hand-written kernels + cuBLAS",
        detail:
          "Activations stay on the device for the whole forward pass. The paged attention kernel walks the block table directly, and a test fragments the table on purpose so a kernel that computes slots arithmetically cannot pass. Sharing each K/V read across a grouped-query attention group made the attention kernel 1.62x faster.",
      },
      {
        step: "Streaming API",
        tech: "OpenAI-compatible SSE",
        detail:
          "Serves /v1/completions and /v1/chat/completions with streaming, so any OpenAI client works. Past a queue-depth limit it returns 429 with Retry-After, and SIGTERM flips readiness to 503, finishes in-flight sequences, then exits.",
      },
      {
        step: "Deploy & Metrics",
        tech: "Prometheus + Helm + KEDA",
        detail:
          "Exports queue depth, KV block usage, prefix hit ratio, TTFT and inter-token latency. The Helm chart requests one GPU per pod and a KEDA ScaledObject scales on queue depth; CI fails if a dashboard panel references a metric the server does not expose.",
      },
    ],
    sampleOutput: {
      label: "Measured results (Qwen2.5-0.5B, hardware named per row)",
      steps: [
        { label: "Correctness", value: "argmax identical to Hugging Face on 22 prompts, all 24 layers checked; CUDA gated against the CPU path" },
        { label: "KV slot utilization", value: "99.0% paged vs. 54.8% contiguous (hardware independent)" },
        { label: "Continuous vs. static batching", value: "53x faster TTFT p50 · 1.37x tokens/s (A40)" },
        { label: "Prefix caching", value: "14.4x faster TTFT p50 on a shared 512-token system prompt (A40)" },
        { label: "GQA-shared attention kernel", value: "1.62x faster kernel · 1.27x tokens/s end to end (A40)" },
        { label: "Chunked prefill", value: "11.8x shorter worst decode stall on CPU · 1.3x on an A40" },
      ],
    },
  },
  {
    slug: "dothraki-asr",
    name: "Dothraki ASR",
    short: "Speech recognition for a fictional language with no training data.",
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
    short: "Turns production AI agent failures into free, deterministic CI tests.",
    tagline: "Observability and eval platform for production AI agents: replays real failures as deterministic CI tests, at zero model API cost.",
    highlights: [
      "Go ingest takes 30K+ agent spans/sec and lost none of them through a ClickHouse outage",
      "Replays a 50-span agent failure from recorded fixtures in under 5s, with zero model calls",
      "Gates PRs on replayed regression tests in a no-network sandbox, with a 100-pair test proving tenants stay isolated",
    ],
    description:
      "Production AI agents fail in ways unit tests don't catch: a prompt edit changes tone, a tool call returns something unexpected, and nobody notices until a customer does. Vestige instruments every LLM call, tool call, and transitive HTTP request in an agent run via OpenTelemetry, then lets you promote any recorded run into a regression test. Replay reconstructs that failure from content-hashed fixtures instead of live model calls, so a full test suite re-run costs nothing and never touches a real provider. Replays run in a Docker sandbox with no network, a read-only filesystem, and none of the worker's credentials. A GitHub Actions gate runs this on every pull request and blocks the merge on regression, and when an output changes, an LLM judge tells the reviewer whether it is a rewording or a real difference without ever passing the test itself.",
    github: null,
    demo: "https://vestigeapp.vercel.app/",
    stack: ["Python", "Go", "TypeScript", "Next.js", "OpenTelemetry", "ClickHouse", "PostgreSQL", "Docker"],
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
          "A Go OTLP receiver normalizes spans and writes them to a ClickHouse schema partitioned by day and ordered by trace for fast single-trace reads. Concurrent requests share grouped inserts, which about doubles throughput at 32 senders (roughly 30,000 spans/sec on a laptop). A write-ahead log covers database outages: stopping ClickHouse for 15 seconds mid-run lost none of 229,800 acknowledged spans.",
      },
      {
        step: "Promote",
        tech: "content-hashed fixtures",
        detail:
          "Any recorded trace can be frozen into a regression test. Every external request/response pair captured during that run is content-hashed and stored, forming a deterministic manifest keyed by request hash.",
      },
      {
        step: "Replay",
        tech: "pg-boss worker + Docker sandbox",
        detail:
          "A Postgres-backed job re-runs the agent with the same code path, but every outbound call is intercepted and served from the recorded fixture by hash instead of hitting a real model. The agent runs in a container with no network and a read-only filesystem; the worker mounts the fixtures in and forwards the spans it buffered to disk. Zero LLM calls, zero cost.",
      },
      {
        step: "Diff & gate",
        tech: "GitHub Actions + LLM judge",
        detail:
          "The replayed output is canonicalized and compared to the original by hash, with a token-level diff for the reviewer. A GitHub App posts a check on every pull request and blocks the merge if any promoted test regresses. The judge only explains a change; it never turns a failure into a pass.",
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
    short: "Predicts how much of Alberta a wildfire will burn.",
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
const PROJECT_ORDER = ["vestige", "llm-engine", "roam", "dothraki-asr", "flame-forecaster"];
export const PROJECTS = PROJECT_ORDER.map(
  (slug) => PROJECTS_RAW.find((p) => p.slug === slug)!,
);
