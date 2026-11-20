export interface Project {
  slug: string;
  num: string;
  title: string;
  subtitle: string;
  status: string;
  description: string;
  longDescription: string;
  tags: string[];
  icon: string;
  githubUrl: string;
  isFlagship: boolean;
  architecture?: string;
  specifications?: Record<string, string>;
  cliUsage?: string;
  benchmarkData?: Record<string, string[]>;
  sandboxType?: 'echobaud' | 'phaseveil' | 'osint-center' | 'tensorgate';
}

const echobaudArchitecture = `┌─────────────────────────────────────────────────────────────────────────────┐
│                         ECHOBAUD SIGNAL PIPELINE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  SEND PATH                                                                  │
│  ────────                                                                   │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌──────────┐       │
│  │  TEXT   │──▶│ ENCRYPT │──▶│  FRAME  │──▶│   FEC   │──▶│ MODULATE │       │
│  │ / FILE  │   │AES-256  │   │ + CRC32 │   │RS(255,  │   │ 4-FSK +  │       │
│  │         │   │  GCM    │   │ + CHUNK │   │  201)   │   │  CHIRP   │       │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘   └──────────┘       │
│       │            │            │            │             │                │
│       ▼            ▼            ▼            ▼             ▼                │
│  plaintext    ciphertext   200B frames  255B codewords  44.1 kHz float32    │
│  (or binary)  (salt+nonce) 188B payload   54 parity      audio buffer       │
│                                                                             │
│  RECEIVE PATH                                                               │
│  ─────────────                                                              │
│  ┌──────────┐   ┌─────────┐   ┌──────────┐   ┌─────────┐   ┌──────────┐     │
│  │ CAPTURE  │──▶│ SYNC    │──▶│DEMODULATE│──▶│  FEC    │──▶│ DEFRAME  │     │
│  │  AUDIO   │   │ CHIRP   │   │  4-FSK   │   │  DECODE │   │+ DECRYPT │     │
│  │ 44.1kHz  │   │  CORR   │   │ GOERTZEL │   │ RS DEC  │   │ CRC+AES  │     │
│  └──────────┘   └─────────┘   └──────────┘   └─────────┘   └──────────┘     │
│       │            │            │            │             │                │
│       ▼            ▼            ▼            ▼             ▼                │
│  float32      sample idx   2-bit syms   201B msg      plaintext or          │
│  buffer       + corr       (0-3)       (or fail)     saved file             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘`;

const phaseveilArchitecture = `                    ┌─────────────────────────────────────────────────┐
                    │                 phaseveil                       │
                    │                 (CLI entry)                     │
                    └───────┬──────────────┬──────────────┬───────────┘
                            │              │              │
        ┌───────────────────┼──────────────┼──────────────┼───────────────────┐
        │                   │              │              │                   │
        ▼                   ▼              ▼              ▼                   ▼
 ┌─────────────┐   ┌──────────────┐  ┌───────────┐  ┌────────────┐     ┌───────────┐
 │   crypto    │   │   payload    │  │audio_stego│  │  timing_   │     │ detector  │
 │ AES-256-GCM │──▶│ frame + RS   │─▶│ phase     │  │  channel   │     │ zero-ML   │
 │ zlib +      │   │ (255, 207)   │  │ coding    │  │ IPD codec  │     │ statistics│
 │ PBKDF2      │   │ CRC32        │  │           │  │ + sockets  │     │           │
 └─────────────┘   └──────────────┘  └─────┬─────┘  └─────┬──────┘     └─────┬─────┘
        │                                  │              │                  │
        │            ┌─────────────────────┘              │                  │
        │            │                                    │                  │
        │            ▼                                    ▼                  │
        │     ┌─────────────┐                     ┌───────────────┐          │
        │     │ STEGO .wav  │                     │ loopback      │          │
        │     │ 16-bit PCM  │                     │ UDP/TCP IATs  │          │
        │     └──────┬──────┘                     └───────┬───────┘          │
        │            │                                    │                  │
        │            └──────────────┬─────────────────────┘                  │
        │                           │                                        │
        │                           ▼                                        │
        │                  ┌─────────────────┐                               │
        └─────────────────▶│ phase-vector /  │◀──────────────────────────────┘
                           │ packet trace    │        (both channels feed the
                           └─────────────────┘         SAME statistical engine)`;

const osintCenterArchitecture = `OSINT Center/
├── index.html              app shell (login, header, legend, CCTV modal)
├── serve.py                local server + /proxy + HLS playlist rewriting
├── download_istanbul_map.py  offline map downloader (free, resumable)
├── css/
│   ├── base.css            theme variables, reset, primitives, animations
│   ├── shell.css           login, loader, header, ticker, nav, layout
│   ├── panels.css          right-hand panels: rows, toolbar, chips, news
│   ├── map.css             map, legend, controls, search, coordinate tooltip
│   └── modal.css           CCTV viewer modal + live/offline states
├── js/
│   ├── vendor/             Leaflet + markercluster + satellite.js + hls.js (local)
│   ├── main.js             entry point: boot, action dispatch, schedulers
│   ├── config.js           endpoints, refresh cadence, limits, basemap zoom
│   ├── state.js            shared state + marker registry
│   ├── utils.js            proxy-aware HTTP, DOM helpers, formatters, assetUrl
│   ├── map/                map engine, layers, offline, overlays, coords, search, controls, perf, markers
│   ├── feeds/              one file per data source (flights, aircraftMeta, quakes, disasters, conflicts, maritime, cyber, cyberAttacks, news, satellites, cctv)
│   ├── data/               statics, msidMid (MMSI MID → flag country)
│   └── ui/                 login, clock, ticker, eventLog, tabs, legend, panels
└── maps/istanbul/          offline map tiles (if downloaded)`;

const tensorgateArchitecture = `TENSORGATE ARCHITECTURE
═══════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│                           TENSORGATE CORE                                    │
│                                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  │
│  │  STATIC TRIAGE      │  │  802.11 WIPS        │  │  ALERT PIPELINE     │  │
│  │  ENGINE             │  │  MONITOR            │  │                     │  │
│  │                     │  │                     │  │  ┌───────────────┐  │  │
│  │  • PE/ELF/APK Parse │  │  • Deauth Flood     │  │  │ ntfy.sh       │  │  │
│  │  • Entropy Analysis │  │  • Rogue AP Detect  │  │  │ Telegram Bot  │  │  │
│  │  • Permission Enum  │  │  • Mgmt Frame Spoof │  │  │ Zero Cloud    │  │  │
│  │  • IOC Extraction   │  │  • Passive IDS Mode │  │  │ Zero AI/ML    │  │  │
│  │  • Zero Execution   │  │  • Auth Lab Active  │  │  └───────────────┘  │  │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘  │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    DEPENDENCY MANAGER (< 1 GB)                       │    │
│  │  • Automated package manager                                        │    │
│  │  • SHA-256 verification for 2 external free tools                   │    │
│  │  • Refactored from ~2.5-3 GB → < 1 GB release footprint            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘

STATIC TRIAGE PIPELINE
═══════════════════════

  INPUT (PE/ELF/APK)
        │
        ▼
  ┌─────────────────┐
  │ HEADER PARSER   │  → DOS/PE headers, ELF ident, APK manifest
  └────────┬────────┘
        │
        ▼
  ┌─────────────────┐
  │ ENTROPY SCANNER │  → Shannon entropy per section (detect packing/encryption)
  └────────┬────────┘
        │
        ▼
  ┌─────────────────┐
  │ PERMISSION/IOC  │  → Android permissions, suspicious API calls, URLs, IPs
  │ EXTRACTOR       │
  └────────┬────────┘
        │
        ▼
  ┌─────────────────┐
  │ RULE ENGINE     │  → Deterministic YARA-like rules, no ML
  └────────┬────────┘
        │
        ▼
  OUTPUT: JSON report + ntfy/Telegram alert

WIPS MONITOR PIPELINE
══════════════════════

  WIFI INTERFACE (monitor/AP mode)
        │
        ▼
  ┌─────────────────┐
  │ FRAME CAPTURE   │  → 802.11 management frames
  └────────┬────────┘
        │
        ├──────────────────┬──────────────────┐
        ▼                  ▼                  ▼
  ┌───────────┐      ┌───────────┐      ┌───────────┐
  │ DEAUTH    │      │ ROGUE AP  │      │ SPOOFED   │
  │ FLOOD     │      │ DETECT    │      │ MGMT      │
  │ DETECTOR  │      │ (BSSID    │      │ FRAMES    │
  │           │      │  mismatch)│      │           │
  └─────┬─────┘      └─────┬─────┘      └─────┬─────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
                   ┌───────────────┐
                   │ THREAT SCORE  │  → Rule-based, deterministic
                   │ AGGREGATOR    │
                   └───────┬───────┘
                           │
                           ▼
                   ┌───────────────┐
                   │ ALERT PIPELINE│  → ntfy + Telegram, zero cloud
                   └───────────────┘`;

export const projects: Project[] = [
  {
    slug: 'echobaud',
    num: '01',
    title: 'ECHOBAUD',
    subtitle: 'Air-Gapped Acoustic Modem for Encrypted Transfer',
    status: 'Production Ready • v1.2.0',
    description: 'Air-gapped acoustic modem transmitting AES-256-GCM encrypted text and files over sound waves — zero Wi-Fi, Bluetooth, internet, or cables.',
    longDescription: `EchoBaud is an air-gapped acoustic modem for encrypted text and file transfer via speakers and microphone. It requires zero network infrastructure — no Wi-Fi, Bluetooth, internet, or cables. Built with pure Python 3.10+, it implements deterministic digital signal processing with production-grade reliability.

The signal pipeline consists of:
- **Encryption**: AES-256-GCM with PBKDF2-HMAC-SHA256 (100,000 iterations)
- **Framing**: 200-byte frames with MAGIC (0xEB90), version/flags, chunk ID, total chunks, payload length, payload (188 bytes), and CRC32
- **FEC**: Reed-Solomon RS(255, 201) over GF(256) with 54 bytes parity, correcting up to 27 byte errors per codeword
- **Modulation**: 4-FSK (2 bits/symbol) at 50 baud, 100 bps raw bit rate
- **Synchronization**: Chirp preamble (1000→4000 Hz audible, 17000→20000 Hz ultrasonic) with normalized cross-correlation detection
- **Demodulation**: Goertzel algorithm for 4-tone detection with adaptive squelch threshold

Two operating profiles:
- **Audible**: 1200/1900/2600/3300 Hz tones, 700 Hz spacing
- **Ultrasonic (Experimental)**: 17500/18167/18833/19500 Hz tones, 667 Hz spacing

Benchmarked at SNR from +20 dB to -5 dB with 100% FEC recovery in audible mode. Peak RAM: < 42 MB. Effective throughput: ~4.9 bps.`,
    tags: ['PYTHON', 'DSP', '4-FSK', 'AES-256-GCM', 'REED-SOLOMON', 'AIR-GAPPED'],
    icon: '📻',
    githubUrl: 'https://github.com/agiprogrammerch/echobaud',
    isFlagship: true,
    architecture: echobaudArchitecture,
    specifications: {
      'Sample Rate': '44,100 Hz',
      'Modulation': '4-FSK (2 bits/symbol)',
      'Symbol Duration': '20 ms (882 samples)',
      'Baud Rate': '50 baud',
      'Raw Bit Rate': '100 bps',
      'Audible Tone Frequencies': '1200, 1900, 2600, 3300 Hz',
      'Ultrasonic Tone Frequencies': '17500, 18167, 18833, 19500 Hz',
      'Tone Spacing': '700 Hz (audible) / 667 Hz (ultrasonic)',
      'Chirp Preamble': '1000→4000 Hz (audible) / 17000→20000 Hz (ultrasonic), 100 ms',
      'Taper Window': 'Raised-cosine, 10% (2 ms) each edge',
      'Sync Detection': 'Normalized XCorr (FFT), threshold 0.25 (audible) / 0.30 (ultrasonic)',
      'Demodulation': 'Goertzel algorithm (4 tones)',
      'Squelch Threshold': '0.015 (audible) / 0.020 (ultrasonic) adaptive',
      'Reed-Solomon FEC': 'RS(255, 201) over GF(256), primitive polynomial 0x11D',
      'Parity': '54 bytes (correction: 27 byte errors per codeword)',
      'Encryption': 'AES-256-GCM, PBKDF2-HMAC-SHA256 (100,000 iterations)',
      'Salt': '16 bytes (random per message)',
      'Nonce': '12 bytes (random per message)',
      'Tag': '16 bytes (appended to ciphertext)',
    },
    cliUsage: `# Send text (plays through speakers)
echobaud send --text "Hello, air-gapped world!"

# Send text to WAV file
echobaud send --text "Hello!" --wav-out message.wav

# Send file to WAV
echobaud send --file document.pdf --wav-out transfer.wav

# Receive from WAV (text prints to stdout)
echobaud listen --wav-in message.wav

# Receive file from WAV
echobaud listen --wav-in transfer.wav --out-dir ./received

# Live receive from microphone (30 seconds)
echobaud listen --duration 30

# Encryption with passphrase
echobaud --passphrase "my-secret" send --text "Classified info" --wav-out secret.wav
echobaud --passphrase "my-secret" listen --wav-in secret.wav

# Ultrasonic mode (near-inaudible, experimental)
echobaud --mode ultrasonic send --text "Silent message" --wav-out ultra.wav
echobaud --mode ultrasonic listen --wav-in ultra.wav

# Benchmark
echobaud benchmark [--mode audible|ultrasonic]`,
    benchmarkData: {
      'Audible Profile': ['SNR', 'Preamble Corr', 'Raw Errors', 'FEC Recovery', 'Peak RAM'],
      'Audible +20 dB': ['0.995', '0/255', '✅ PASS', '41.3 MB'],
      'Audible +15 dB': ['0.984', '0/255', '✅ PASS', '41.3 MB'],
      'Audible +10 dB': ['0.952', '0/255', '✅ PASS', '41.3 MB'],
      'Audible +5 dB': ['0.867', '0/255', '✅ PASS', '41.3 MB'],
      'Audible 0 dB': ['0.704', '0/255', '✅ PASS', '41.3 MB'],
      'Audible -5 dB': ['0.497', '0/255', '✅ PASS', '41.3 MB'],
      'Ultrasonic Profile': ['SNR', 'Preamble Corr', 'Raw Errors', 'FEC Recovery', 'Peak RAM'],
      'Ultrasonic +20 dB': ['0.752', '0/255', '✅ PASS', '41.3 MB'],
      'Ultrasonic +15 dB': ['0.748', '0/255', '✅ PASS', '41.3 MB'],
      'Ultrasonic +10 dB': ['0.718', '0/255', '✅ PASS', '41.3 MB'],
      'Ultrasonic +5 dB': ['0.661', '0/255', '✅ PASS', '41.3 MB'],
      'Ultrasonic 0 dB': ['0.535', '0/255', '✅ PASS', '41.3 MB'],
      'Ultrasonic -5 dB': ['0.378', '6/255', '✅ PASS', '41.3 MB'],
    },
    sandboxType: 'echobaud',
  },
  {
    slug: 'phaseveil',
    num: '02',
    title: 'PHASEVEIL',
    subtitle: 'Covert-Channel Steganography & Steganalysis Engine',
    status: 'Production Ready • v1.0.0',
    description: 'Research-grade deterministic Python engine for hiding AES-256-GCM encrypted payloads in the phase spectrum of 16-bit PCM WAV files and network inter-packet delays (IPD), with mathematical detection via zero-ML statistics.',
    longDescription: `PhaseVeil is a research-grade, fully deterministic Python engine for three core capabilities:

1. **Audio Phase Spectrum Steganography**: Hiding AES-256-GCM encrypted payloads in the phase spectrum of 16-bit PCM .wav files using classic phase coding (no LSB byte tricks). Uses 8-PSK constellation on selected mid-band bins (1000–6000 Hz) with delta-preserving followers across K=4 segments per chunk. Achieves SNR 33–35 dB, PSNR 44–46 dB at ~180 B/s.

2. **Network Timing Covert Channel**: Transmitting hidden bits over loopback UDP/TCP socket inter-packet delays (IPD). Bit 0 = 20 ms gap, Bit 1 = 60 ms gap. 40 ms symbol separation vs ±8 ms OS jitter provides 5× margin. Adaptive decoding scans threshold over candidates, chosen by 16-bit alternating preamble match.

3. **Deterministic Statistical Steganalysis**: Mathematically detecting both covert channels with zero AI/ML — just Fourier analysis, distributional statistics, and information-theoretic tests. Audio detector measures per-carrier z-scores of phase quantization to π/4 grid (max z ~25 for covert vs ~3 for clean). Timing detector uses bimodal separation ratio, Shannon entropy, lag-1 autocorrelation, and KS-test against exponential/normal marginals. Fixed weighted score: audio = 0.7·z + 0.3·entropy, timing = 0.45·bimodal + 0.25·entropy + 0.20·lag1 + 0.10·KS. Verdict: SUSPICIOUS iff score ≥ 0.5.

All transforms are pure, local, deterministic mathematics. No AI/ML models, no telemetry, no cloud APIs, no phone-home. Network channel restricted to 127.0.0.1 loopback by default.`,
    tags: ['PYTHON', 'STEGANOGRAPHY', 'PHASE-CODING', 'AES-256-GCM', 'IPD', 'STEGANALYSIS'],
    icon: '🔐',
    githubUrl: 'https://github.com/agiprogrammerch/phaseveil',
    isFlagship: true,
    architecture: phaseveilArchitecture,
    specifications: {
      'Audio FFT Segment (N)': '2048 samples (46 ms hop, 21.5 Hz bins @44.1 kHz)',
      'Embedding Band': '1000–6000 Hz (mid-band: strong harmonics, no LF rumble / HF hiss)',
      'Constellation (M)': '8-PSK (3 bits/bin, 3× payload per unit energy vs 2-PSK)',
      'Chunk (K)': '4 segments (carrier + 3 delta-preserving followers)',
      'Bin Window': '[0.3, 1.0] × band median, 3% dead-band (energy-aware, stable bin sets)',
      'Boundary Ladder': '7 multipliers, 0.2% stability margin (int16 rounding scale)',
      'Reliability Floor': 'max(1%, 20 × σ_q) — erasures only where phase truly lost',
      'Reed-Solomon FEC': 'RS(255, 191), nsym 64 (32 byte errors or 64 erasures per codeword)',
      'Small Payload Mode': '1 codeword of frame + parity (~2× shorter streams)',
      'Crypto': 'AES-256-GCM, 200,000 PBKDF2 iterations, 16B salt, 12B nonce',
      'Timing bit0_ms / bit1_ms': '20 / 60 ms (40 ms gap vs ±8 ms jitter = 5× margin)',
      'Timing Preamble': '16 alternating bits (sync without assuming absolute clocks)',
      'Idle Timeout': '1500 ms (clean listener shutdown)',
      'Detector Verdict Threshold': '0.50 (calibrated on synthetic TP/FP sweep)',
      'Detector Weights (Audio)': '0.7·z_max + 0.3·entropy',
      'Detector Weights (Timing)': '0.45·bimodal + 0.25·entropy + 0.20·lag1 + 0.10·KS',
    },
    cliUsage: `# Audio phase steganography
phaseveil audio hide --in cover.wav --out stego.wav --text "hello world"
phaseveil audio hide --in cover.wav --out stego.wav --file secret.bin --passphrase "lab secret"
phaseveil audio extract --in stego.wav [--passphrase "lab secret"] [--out payload.bin]

# Network inter-packet-delay covert channel (loopback!)
phaseveil timing send --host 127.0.0.1 --port 9999 --text "hello" [--passphrase PASS] [--delay-ms 20,60] [--tcp]
phaseveil timing listen --host 127.0.0.1 --port 9999 [--passphrase PASS] [--out payload.bin] [--save-trace trace.json] [--tcp]

# Deterministic statistical steganalysis
phaseveil analyze audio --in sample.wav [--baseline clean_cover.wav]
phaseveil analyze timing --trace trace.json

# Benchmark (capacity, SNR, jitter, detector accuracy, peak RAM)
phaseveil benchmark [--json bench.json]`,
    benchmarkData: {
      'Audio Phase-Coding Round-Trip': ['Metric', 'Plaintext', 'AES-256-GCM'],
      'SNR': ['33.69 dB', '32.58 dB'],
      'PSNR': ['44.65 dB', '43.53 dB'],
      'Embedded': ['143 B', '191 B'],
      'Capacity': ['552 B', '552 B'],
      'Timing Codec': ['12/12 jitter trials (±3–8 ms) recover', '±8 ms worst case PASS'],
      'Detector Audio': ['TP 6/6, FP 0/6', 'Clean score 0.000 vs Covert 0.700'],
      'Detector Timing': ['TP 6/6, Poisson FP 0/6, Gaussian FP 0/6', 'Clean Poisson 0.10 vs Covert 0.55'],
      'Peak RSS': ['111.2 MB (budget 150 MB)', ''],
      'Capacity Scaling': ['1 s → 172 B', '2 s → 356 B', '3 s → 588 B', '5 s → 926 B (44.1 kHz)'],
      'Robustness Sweep': ['27/27 lossless round-trips over 9 cover classes × 3 seeds', 'SNR 9.4–37.6 dB, 0 erasure-induced failures'],
      'Test Suite': ['136 passed in ~95 s', 'Includes live loopback UDP/TCP exchanges'],
    },
    sandboxType: 'phaseveil',
  },
  {
    slug: 'osint-center',
    num: '03',
    title: 'OSINT CENTER',
    subtitle: 'Browser-Based OSINT Dashboard — 100% Free, No API Keys',
    status: 'Active • v4.0',
    description: 'Live aircraft, earthquakes, disasters, conflict zones, maritime traffic, attack telemetry, satellites, and live camera video from ~6,800 public cameras worldwide — all on a dark CRT map. Python 3 stdlib + vanilla ES modules + public data APIs.',
    longDescription: `VOID//MATRIX OSINT Command Center is a browser-based OSINT dashboard that runs entirely on free, public data sources with zero API keys, zero accounts, zero npm install, and zero build step. It uses Python 3 standard library for the local proxy server and vanilla ES modules for the frontend.

**Data Panels:**
- **OVERVIEW**: BBC, Al Jazeera, Guardian, DW, NPR RSS feeds parsed locally via proxy
- **AIR TRAFFIC**: OpenSky Network (OAuth or anonymous) with aircraft enrichment via hexdb.io + api.adsb.lol (30-day local cache) — registration, model, manufacturer, owner, operator, country, altitude, vertical rate, ground speed, heading, squawk, position age. Military aircraft get dedicated markers and filters.
- **CYBER**: SANS ISC/DShield + abuse.ch Feodo — live attack origins (60) with IP, geolocation (country/city/AS/ISP), event/packet counts, targeted services, botnet C2 indicators. Each origin drawn as pulsing pin sized by attack volume.
- **DISASTERS**: USGS earthquakes + NASA EONET — full detail on quakes (PAGER alert, MMI/CDI shaking, felt reports, significance, tsunami flag) and events (category, magnitude, description, source, movement track).
- **CCTV**: Live-Environment-Streams HLS index + TfL — **genuine live video from 6,832 active public cameras** worldwide. Local proxy fetches and rewrites HLS playlists (variant playlists, .ts/.mp4 segments, EXT-X-KEY, EXT-X-MAP) into absolute proxy URLs. 60 cameras curated via country×network round-robin, 800 markers drawn worldwide. Each panel camera play-tested in background, badged LIVE HLS or OFFLINE. TfL JamCams fallback (London snapshots every 2s).
- **MARITIME**: Digitraffic AIS (Baltic) — real vessels with name, MMSI, IMO, callsign, flag country (decoded from MMSI MID), type (ITU ship codes), dimensions, speed, course, nav status, destination + country (UN/LOCODE), decoded AIS ETA, draught. Military/government vessels (AIS type 35/55) get dedicated markers.
- **INTEL FEEDS**: Same RSS headlines as OVERVIEW as full list.
- **SATELLITES**: CelesTrak TLEs + satellite.js SGP4 propagation.

**Architecture**: Native ES modules (type="module") served via Python serve.py which provides /proxy endpoint (GET/POST, any http(s) URL, follows redirects, forwards headers) and rewrites HLS playlists for camera playback. Bundled libraries (Leaflet, markercluster, satellite.js, hls.js) in js/vendor/ with CDN fallback. Offline Istanbul map downloader (free, resumable, 39,706 tiles, 277 MB, z0–z19). Free-tier etiquette configured: OpenSky 5 min refresh (288/day), others 2.5–30 min.`,
    tags: ['PYTHON', 'JAVASCRIPT', 'OSINT', 'LEAFLET', 'HLS.JS', 'SATELLITE.JS', 'PUBLIC-APIS'],
    icon: '🛰️',
    githubUrl: 'https://github.com/agiprogrammerch/osint-center',
    isFlagship: true,
    architecture: osintCenterArchitecture,
    specifications: {
      'Server': 'Python 3 stdlib (serve.py) — HTTP server + /proxy + HLS rewrite',
      'Frontend': 'Vanilla ES modules (type="module") — no bundler, no npm',
      'Map Engine': 'Leaflet 1.9+ with markercluster, preferCanvas + chunkedLoading',
      'Satellite Tracking': 'satellite.js (SGP4) + CelesTrak TLEs',
      'Video Playback': 'hls.js (live watchdog) + native HLS fallback (Safari)',
      'Offline Maps': 'download_istanbul_map.py — resumable, polite (3 workers, 0.2s delay)',
      'Aircraft Enrichment': 'hexdb.io + api.adsb.lol (free, key-less, 30-day localStorage cache)',
      'Offline Decoding': 'Airline callsign prefixes (~100), ICAO type codes (~150), MMSI MID → flag',
      'Proxy Features': 'GET/POST, any http(s) URL, redirect follow, header forwarding, HLS playlist rewrite',
      'Camera Index': 'Live-Environment-Streams GeoJSON (~6,800 HLS streams, 60 curated, 800 markers)',
      'Fallback Cameras': 'TfL JamCams (London) — snapshots every 2s, cached in localStorage',
      'Refresh Intervals': 'Flights 5min, Ships 5min, Quakes 5min, Disasters 10min, Cyber 15min, News 2.5min, Satellites 5min, CCTV 30min',
      'OpenSky OAuth': 'Optional — drops flight refresh from 5min → 2min (auto-fallback on failure)',
      'Map Layers': 'Flights, Military, Ships, Conflicts, Quakes, Fires, Cyber, Satellites, CCTV',
      'Controls': 'Zoom, pan, graticule (G), day/night terminator (N), crosshair (C), coords (M), basemap (B), fullscreen (F)',
      'Search': 'Coordinates (DD/DMS) + Nominatim place search (free, key-less)',
      'Basemaps': 'OSM DARK (German mirror), OSM, TOPO, SAT VIEW (Esri), Offline Istanbul',
      'Offline Istanbul': '39,706 tiles, 277 MB, z0–z19, osm-de source',
      'Peak RAM (Browser)': '~200-400 MB depending on active layers',
      'Dependencies': 'Zero — all libraries vendored, only live feeds need internet',
    },
    cliUsage: `# Run the OSINT Center
cd "/path/to/OSINT Center"
python3 serve.py            # then open http://127.0.0.1:8000
python3 serve.py --port 8080  # optional custom port

# Login (themed client-side gate)
# Username: agiprogrammerch
# Password: Hacker@11

# Download offline Istanbul map
python3 download_istanbul_map.py                 # quick preset (z0-13 metro + z14-15 core, ~2,366 tiles)
python3 download_istanbul_map.py --preset standard  # z0-13 metro + z10-16 core, ~7,648 tiles
python3 download_istanbul_map.py --preset full     # z0-13 metro + z10-19 core, ~425k tiles
python3 download_istanbul_map.py --bbox 51.4,-0.15,51.6,0.05 --zoom 8-14 -l london`,
    benchmarkData: {
      'Data Feeds': ['Source', 'Refresh', 'Status'],
      'Flights (OpenSky)': ['5 min (2 min OAuth)', 'Live / Simulated fallback'],
      'Ships (Digitraffic)': ['5 min', 'Baltic Sea only'],
      'Quakes (USGS)': ['5 min', 'M2.5+, 24h'],
      'Disasters (NASA EONET)': ['10 min', 'Real categories + tracks'],
      'Cyber C2 (abuse.ch)': ['15 min', 'Feodo blocklist'],
      'Cyber Attacks (SANS/DShield)': ['15 min', '60 origins, geolocated'],
      'News (RSS)': ['2.5 min', 'BBC, AJ, Guardian, DW, NPR'],
      'Satellites (CelesTrak)': ['5 min', 'SGP4 propagation'],
      'CCTV (Live-Env-Streams)': ['30 min', '6,832 streams, 60 curated'],
      'Offline Map': ['On demand', '39,706 tiles, 277 MB, z0-19'],
      'Free-Tier Compliance': ['OpenSky 288 req/day', 'All others reasonable use'],
      'Proxy': ['Local only', 'No third-party proxy sees traffic'],
    },
    sandboxType: 'osint-center',
  },
  {
    slug: 'tensorgate',
    num: '04',
    title: 'TENSORGATE',
    subtitle: 'Defensive Cybersecurity, Digital Forensics & Authorized Vulnerability Assessment Suite',
    status: 'Active Development — Public v1.0 Targeting Mid-2027',
    description: 'Modular defensive cybersecurity suite: zero-execution static malware/APK triage, 802.11 WIPS & router anomaly monitor, deterministic real-time alert pipeline, sub-1 GB packaging. 100% rule-based, zero AI/ML, $0 paid APIs.',
    longDescription: `TensorGate is a modular defensive cybersecurity, digital forensics, and authorized vulnerability assessment suite — explicitly scoped for defensive monitoring, digital forensics, and authorized lab validation only. Never described as a "hacking framework."

**Core Modules:**

1. **Zero-Execution Static Malware & Android APK Triage Engine**: Statically inspects Windows PE, Linux ELF, and Android APK binaries without running VMs or executing payloads. Performs header parsing, Shannon entropy checks, permission and IOC extraction. All analysis is static — zero execution risk.

2. **802.11 Wireless Intrusion Prevention System (WIPS) & Router Anomaly Monitor**: Activates when connected to Wi-Fi with a basic monitor/AP-mode Wi-Fi dongle to detect active wireless attacks: deauthentication floods, rogue APs, spoofed management frames. Defaults to Passive IDS monitoring; authorized-lab active isolation engineered to block suspicious actors without inspecting or invading legitimate clients' privacy.

3. **Deterministic Real-Time Alert Pipeline**: Dispatches live incident notifications via ntfy and Telegram with zero cloud dependency or AI inference. Rule-based deterministic engine only.

4. **Sub-1 GB Packaging & Supply-Chain Dependency Manager**: Refactored from ~2.5–3 GB down to a < 1 GB release footprint via a built-in automated package manager. Includes documented manual download and SHA-256 checksum verification for 2 external free tools before automated setup.

**Verified Resource Footprint:**
- Peak RAM strictly < 1 GB
- Smooth execution on low-end integrated GPU (128 MB VRAM)
- 100% deterministic rule-based engine (zero AI/ML models)
- $0 paid APIs

**Disclaimer**: Explicitly scoped for defensive monitoring, digital forensics, and authorized lab validation only.`,
    tags: ['PYTHON', 'STATIC-ANALYSIS', 'WIPS', '802.11', 'FORENSICS', 'NTFY', 'TELEGRAM', 'ZERO-AI'],
    icon: '🛡️',
    githubUrl: 'https://github.com/agiprogrammerch/tensorgate',
    isFlagship: true,
    architecture: tensorgateArchitecture,
    specifications: {
      'Static Triage Targets': 'Windows PE, Linux ELF, Android APK',
      'Analysis Mode': 'Zero-execution static analysis only',
      'Header Parsing': 'PE DOS/NT headers, ELF ident/program headers, APK AndroidManifest.xml',
      'Entropy Analysis': 'Shannon entropy per section (packing/encryption detection)',
      'Permission Enumeration': 'Android dangerous permissions, suspicious API calls',
      'IOC Extraction': 'URLs, IPs, domains, file paths, registry keys, crypto constants',
      'Rule Engine': 'Deterministic YARA-like rules, zero ML/AI',
      'WIPS Interface': 'Monitor/AP mode Wi-Fi dongle (basic hardware)',
      'Deauth Detection': '802.11 management frame analysis, flood thresholding',
      'Rogue AP Detection': 'BSSID/SSID mismatch, beacon anomaly analysis',
      'Mgmt Frame Spoofing': 'Sequence number analysis, timestamp validation',
      'Default Mode': 'Passive IDS (monitoring only)',
      'Authorized Active Mode': 'Lab isolation only, no legitimate client inspection',
      'Alert Channels': 'ntfy.sh (self-hosted or public), Telegram Bot API',
      'Alert Dependency': 'Zero cloud, zero AI inference, deterministic rules',
      'Packaging': 'Built-in automated package manager, < 1 GB footprint',
      'External Tools': '2 free tools with documented manual download + SHA-256 verification',
      'Peak RAM': '< 1 GB (verified)',
      'GPU Requirement': 'Integrated GPU (128 MB VRAM) sufficient',
      'AI/ML Models': 'ZERO — 100% deterministic rule-based',
      'Paid APIs': '$0',
      'Scope': 'Defensive monitoring, digital forensics, authorized lab validation ONLY',
    },
    cliUsage: `# Static malware/APK triage
tensorgate triage --file sample.apk --output report.json
tensorgate triage --file malware.exe --format json --verbose

# WIPS monitor (requires monitor/AP mode Wi-Fi dongle)
tensorgate wips start --interface wlan0 --mode passive
tensorgate wips start --interface wlan0 --mode active --authorized-lab
tensorgate wips stop

# Dependency management
tensorgate deps check      # Verify SHA-256 of external tools
tensorgate deps install    # Automated install (refactored < 1 GB)
tensorgate deps verify     # Full supply-chain verification

# Alert pipeline test
tensorgate alert test --channel ntfy --topic tensorgate-alerts
tensorgate alert test --channel telegram --bot-token $TOKEN --chat-id $CHAT_ID

# Version & status
tensorgate --version
tensorgate status          # RAM usage, active modules, alert queue`,
    benchmarkData: {
      'Resource Footprint': ['Metric', 'Value'],
      'Peak RAM': ['< 1 GB (strict ceiling)'],
      'GPU VRAM': ['128 MB (integrated) sufficient'],
      'Disk Footprint': ['< 1 GB release (refactored from ~2.5-3 GB)'],
      'AI/ML Models': ['ZERO — deterministic rules only'],
      'Paid APIs': ['$0'],
      'External Tools': ['2 free tools, SHA-256 verified'],
      'Static Triage': ['PE/ELF/APK', 'Zero-execution, header+entropy+permissions+IOC'],
      'WIPS Detection': ['Deauth floods, Rogue APs, Spoofed frames', 'Passive IDS default, authorized active lab'],
      'Alert Latency': ['< 1 second (local ntfy/Telegram)'],
      'Test Coverage': ['Rule-based unit tests, integration tests'],
      'Scope Compliance': ['Defensive/Forensics/Authorized Lab ONLY'],
    },
    sandboxType: 'tensorgate',
  },
  {
    slug: 'cyber-virtual-mouse',
    num: '',
    title: 'CYBER VIRTUAL MOUSE',
    subtitle: 'CPU-Efficient Webcam Hand-Tracking Cursor Controller',
    status: 'Experimental • Research Prototype',
    description: 'Low-latency hand-tracking cursor controller optimized for low-end integrated laptop webcams. Runs efficiently on modest hardware without dedicated GPU acceleration.',
    longDescription: `Cyber Virtual Mouse is a CPU-efficient webcam-based hand-tracking cursor controller designed specifically for low-end integrated laptop webcams. Unlike heavy ML-based hand tracking solutions, this implementation uses classical computer vision techniques (OpenCV) optimized for real-time performance on modest hardware.

**Key Features:**
- Classical CV pipeline: background subtraction → contour analysis → convex hull defects → fingertip detection
- No deep learning models — runs entirely on CPU with OpenCV
- Optimized for 720p/30fps integrated webcams (tested on Asus VivoBook X515EA built-in)
- Sub-50ms latency from frame capture to cursor movement
- Configurable gesture mapping: index finger = move, pinch = click, fist = right-click
- Smoothing via exponential moving average for jitter-free control
- Calibration routine for varying lighting conditions
- Falls back gracefully when hand detection confidence drops

**Performance on Reference Hardware (Asus VivoBook X515EA, i3-1115G4, 8GB RAM):**
- CPU usage: ~15-25% single core
- RAM: < 100 MB
- Latency: 30-50ms end-to-end
- Works in typical indoor lighting (no IR/depth sensor required)

**Limitations:**
- Requires reasonable lighting (not suitable for dark rooms)
- Single-hand tracking only
- Precision lower than dedicated mouse — intended for accessibility/presentation use
- No gesture recognition beyond basic pinch/fist`,
    tags: ['PYTHON', 'OPENCV', 'COMPUTER-VISION', 'HAND-TRACKING', 'LOW-LATENCY', 'CPU-ONLY'],
    icon: '🖱️',
    githubUrl: 'https://github.com/agiprogrammerch/cyber-virtual-mouse',
    isFlagship: false,
  },
  {
    slug: 'lan-drop',
    num: '',
    title: 'ENCRYPTED LAN DROP',
    subtitle: 'Zero-Server E2E Encrypted P2P Wi-Fi File Transfer',
    status: 'Experimental • Research Prototype',
    description: 'Peer-to-peer encrypted file transfer over local Wi-Fi without any server infrastructure. Uses AES-256-GCM with ephemeral keys derived from a shared passphrase.',
    longDescription: `Encrypted LAN Drop is a zero-server, end-to-end encrypted peer-to-peer file transfer utility for local Wi-Fi networks. No central server, no internet connection required, no accounts — just two devices on the same LAN.

**Architecture:**
- **Discovery**: UDP broadcast/multicast for peer discovery on LAN
- **Key Exchange**: Ephemeral session keys derived from shared passphrase via PBKDF2-HMAC-SHA256 (100,000 iterations)
- **Encryption**: AES-256-GCM per file with unique nonce per chunk
- **Transport**: TCP for reliable file transfer with chunked streaming
- **Verification**: SHA-256 checksums per chunk + full file verification
- **Resume**: Interrupted transfers can resume from last verified chunk

**Security Model:**
- Passphrase never transmitted — used only for local key derivation
- Each file gets unique encryption context (salt + nonce)
- Forward secrecy: compromise of one session doesn't affect others
- No metadata leakage: file names encrypted in transfer manifest
- MITM resistance: mutual authentication via passphrase-derived keys

**Performance on Reference Hardware (Asus VivoBook X515EA + Android device, 5GHz Wi-Fi):**
- Transfer speed: 20-40 MB/s (limited by Wi-Fi, not crypto)
- CPU usage: < 10% (AES-NI accelerated on i3-1115G4)
- RAM: < 50 MB
- Supports files of any size (streaming, not memory-mapped)

**Use Cases:**
- Air-gapped file transfer between laptop and phone
- Secure document sharing in meetings without cloud
- Backup to local NAS without internet exposure
- Transfer sensitive files in environments where USB is restricted`,
    tags: ['PYTHON', 'AES-256-GCM', 'P2P', 'LAN', 'E2E-ENCRYPTION', 'ZERO-SERVER'],
    icon: '📡',
    githubUrl: 'https://github.com/agiprogrammerch/lan-drop',
    isFlagship: false,
  },
];

export const flagshipProjects = projects.filter(p => p.isFlagship);
export const additionalBuilds = projects.filter(p => !p.isFlagship);