'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

interface TerminalLine {
  type: 'prompt' | 'output' | 'blank';
  prompt?: string;
  text?: string;
  className?: string;
}

const BOOT_LINES: TerminalLine[] = [
  { type: 'blank' },
  { type: 'prompt', prompt: 'arush@voidmatrix:~$', text: ' cat /etc/profile.dossier' },
  { type: 'output', className: 'green', text: '═══════════════════════════════════════════════' },
  { type: 'output', className: 'cyan', text: '  ARUSH SHAKYA — ENGINEERING DOSSIER' },
  { type: 'output', className: 'green', text: '═══════════════════════════════════════════════' },
  { type: 'output', text: '' },
  { type: 'output', className: 'cyan', text: '  Name:        Arush Shakya' },
  { type: 'output', className: 'cyan', text: '  Role:        Cybersecurity & DSP Engineering Student' },
  { type: 'output', className: 'cyan', text: '  Location:    Agra, India' },
  { type: 'output', className: 'cyan', text: '  Academics:   Class 11 — Physics, Chemistry, Mathematics, CS' },
  { type: 'output', className: 'cyan', text: '  Achievement: SilverZone CS Olympiad — GOLD MEDAL' },
  { type: 'output', className: 'cyan', text: '  Target 2028: B.Tech Computer Science & Engineering' },
  { type: 'output', text: '' },
  { type: 'output', className: 'green', text: '  ─── REFERENCE HARDWARE BENCHMARK ───' },
  { type: 'output', text: '' },
  { type: 'output', className: 'cyan', text: '  Device:      Asus VivoBook X515EA' },
  { type: 'output', className: 'cyan', text: '  CPU:         Intel Core i3-1115G4 (2C/4T, up to 4.10 GHz)' },
  { type: 'output', className: 'cyan', text: '  RAM:         8 GB DDR4' },
  { type: 'output', className: 'cyan', text: '  GPU:         Intel UHD Graphics (128 MB VRAM)' },
  { type: 'output', className: 'cyan', text: '  Storage:     500 GB HDD' },
  { type: 'output', className: 'cyan', text: '  Thermal:     < 40°C sustained (tuned Linux)' },
  { type: 'output', text: '' },
  { type: 'output', className: 'green', text: '  ─── ENGINEERING STANDARD ───' },
  { type: 'output', text: '' },
  { type: 'output', className: 'cyan', text: '  Paid APIs:   $0' },
  { type: 'output', className: 'cyan', text: '  Cloud Deps:  ZERO' },
  { type: 'output', className: 'cyan', text: '  AI/ML:       ZERO (100% deterministic)' },
  { type: 'output', className: 'cyan', text: '  Telemetry:   ZERO' },
  { type: 'output', className: 'cyan', text: '  Peak RAM:    < 1 GB ceiling' },
  { type: 'output', text: '' },
  { type: 'output', className: 'green', text: '  ─── FLAGSHIP PROJECTS ───' },
  { type: 'output', text: '' },
  { type: 'output', className: 'cyan', text: '  [1] echobaud    — Air-gapped acoustic modem (4-FSK, AES-256-GCM)' },
  { type: 'output', className: 'cyan', text: '  [2] phaseveil   — Phase-spectrum stego + IPD covert channel' },
  { type: 'output', className: 'cyan', text: '  [3] osint-center — Browser OSINT dashboard (6,800+ live cams)' },
  { type: 'output', className: 'cyan', text: '  [4] tensorgate  — Static triage + 802.11 WIPS + alerts' },
  { type: 'output', text: '' },
  { type: 'output', className: 'green', text: '  ─── LANGUAGES ───' },
  { type: 'output', text: '' },
  { type: 'output', className: 'cyan', text: '  English  — CEFR C1' },
  { type: 'output', className: 'cyan', text: '  Hindi    — Native Speaker' },
  { type: 'output', className: 'cyan', text: '  Turkish  — TÖMER A1 (CEFR A1)' },
  { type: 'output', className: 'cyan', text: '  Japanese — JLPT N5' },
  { type: 'output', text: '' },
  { type: 'output', className: 'green', text: '═══════════════════════════════════════════════' },
  { type: 'output', className: 'purple', text: '  System ready. Type "help" for commands.' },
  { type: 'output', className: 'green', text: '═══════════════════════════════════════════════' },
  { type: 'blank' },
];

const COMMANDS = {
  help: {
    description: 'List all available commands',
    usage: 'help',
    output: [
      'Available commands:',
      '',
      '  help                    — Show this help message',
      '  whoami                  — Display identity summary',
      '  cat /etc/profile.dossier — Display full engineering dossier',
      '  ls                      — List all projects',
      '  ls projects             — List flagship projects with status',
      '  inspect <name>          — Show technical specs for a project',
      '  cat <name>              — Alias for inspect',
      '  open <slug>             — Navigate to project deep-dive page',
      '  bench                   — Show hardware benchmark readout',
      '  neofetch                — Alias for bench',
      '  skills                  — Display categorized skills matrix',
      '  languages               — Display language proficiencies',
      '  achievements            — Display awards and milestones',
      '  contact                 — Display GitHub and email contact',
      '  clear                   — Clear terminal screen',
      '',
      'Project names for inspect/cat/open:',
      '  echobaud, phaseveil, osint-center, tensorgate,',
      '  cyber-virtual-mouse, lan-drop',
    ],
  },
  whoami: {
    description: 'Display identity summary',
    usage: 'whoami',
    output: [
      'Arush Shakya',
      'Cybersecurity & DSP Engineering Student',
      'Agra, India',
      'SilverZone CS Olympiad — Gold Medalist',
      'Class 11 — Physics, Chemistry, Mathematics, Computer Science',
      'Target: B.Tech CSE 2028',
    ],
  },
  'cat /etc/profile.dossier': {
    description: 'Display full engineering dossier',
    usage: 'cat /etc/profile.dossier',
    output: [
      '═══════════════════════════════════════════════',
      '  ARUSH SHAKYA — ENGINEERING DOSSIER',
      '═══════════════════════════════════════════════',
      '',
      '  Name:        Arush Shakya',
      '  Role:        Cybersecurity & DSP Engineering Student',
      '  Location:    Agra, India',
      '  Academics:   Class 11 — Physics, Chemistry, Mathematics, CS',
      '  Achievement: SilverZone CS Olympiad — GOLD MEDAL',
      '  Target 2028: B.Tech Computer Science & Engineering',
      '',
      '  ─── REFERENCE HARDWARE BENCHMARK ───',
      '',
      '  Device:      Asus VivoBook X515EA',
      '  CPU:         Intel Core i3-1115G4 (2C/4T, up to 4.10 GHz)',
      '  RAM:         8 GB DDR4',
      '  GPU:         Intel UHD Graphics (128 MB VRAM)',
      '  Storage:     500 GB HDD',
      '  Thermal:     < 40°C sustained (tuned Linux)',
      '',
      '  ─── ENGINEERING STANDARD ───',
      '',
      '  Paid APIs:   $0',
      '  Cloud Deps:  ZERO',
      '  AI/ML:       ZERO (100% deterministic)',
      '  Telemetry:   ZERO',
      '  Peak RAM:    < 1 GB ceiling',
      '',
      '  ─── FLAGSHIP PROJECTS ───',
      '',
      '  [1] echobaud    — Air-gapped acoustic modem (4-FSK, AES-256-GCM)',
      '  [2] phaseveil   — Phase-spectrum stego + IPD covert channel',
      '  [3] osint-center — Browser OSINT dashboard (6,800+ live cams)',
      '  [4] tensorgate  — Static triage + 802.11 WIPS + alerts',
      '',
      '  ─── LANGUAGES ───',
      '',
      '  English  — CEFR C1',
      '  Hindi    — Native Speaker',
      '  Turkish  — TÖMER A1 (CEFR A1)',
      '  Japanese — JLPT N5',
      '',
      '═══════════════════════════════════════════════',
    ],
  },
  ls: {
    description: 'List all projects',
    usage: 'ls [projects]',
    output: [
      'FLAGSHIP PROJECTS:',
      '  echobaud           [ACTIVE]  Air-gapped acoustic modem',
      '  phaseveil          [ACTIVE]  Phase-spectrum steganography',
      '  osint-center       [ACTIVE]  Browser OSINT dashboard',
      '  tensorgate         [DEV]     Defensive cybersecurity suite',
      '',
      'ADDITIONAL BUILDS:',
      '  cyber-virtual-mouse  [EXP]  Webcam hand-tracking cursor',
      '  lan-drop             [EXP]  E2E encrypted P2P file transfer',
      '',
      'Type "inspect <name>" for details or "open <slug>" to visit project page.',
    ],
  },
  'ls projects': {
    description: 'List flagship projects with status',
    usage: 'ls projects',
    output: [
      'FLAGSHIP PROJECTS:',
      '  echobaud           [ACTIVE]  Air-gapped acoustic modem',
      '  phaseveil          [ACTIVE]  Phase-spectrum steganography',
      '  osint-center       [ACTIVE]  Browser OSINT dashboard',
      '  tensorgate         [DEV]     Defensive cybersecurity suite',
      '',
      'ADDITIONAL BUILDS:',
      '  cyber-virtual-mouse  [EXP]  Webcam hand-tracking cursor',
      '  lan-drop             [EXP]  E2E encrypted P2P file transfer',
      '',
      'Type "inspect <name>" for details or "open <slug>" to visit project page.',
    ],
  },
  bench: {
    description: 'Show hardware benchmark readout',
    usage: 'bench',
    output: [
      '═══════════════════════════════════════════════',
      '  HARDWARE BENCHMARK — ASUS VIVOBOOK X515EA',
      '═══════════════════════════════════════════════',
      '',
      '  CPU:         Intel Core i3-1115G4',
      '               2 Cores / 4 Threads @ up to 4.10 GHz',
      '  RAM:         8 GB DDR4',
      '  GPU:         Intel UHD Graphics (128 MB VRAM)',
      '  Storage:     500 GB HDD',
      '  Thermal:     < 40°C sustained (tuned Linux)',
      '',
      '  ─── SOFTWARE CONSTRAINTS ───',
      '',
      '  Peak RAM:    < 1 GB (all projects)',
      '  Paid APIs:   $0',
      '  Cloud Deps:  ZERO',
      '  AI/ML:       ZERO (100% deterministic)',
      '  Telemetry:   ZERO',
      '',
      '  ─── VERIFIED WORKLOADS ───',
      '',
      '  echobaud:    41 MB peak RSS (full DSP pipeline)',
      '  phaseveil:   111 MB peak RSS (benchmark suite)',
      '  osint-center: ~300 MB browser (all layers active)',
      '  tensorgate:  < 1 GB (design target)',
      '',
      '═══════════════════════════════════════════════',
    ],
  },
  neofetch: {
    description: 'Alias for bench',
    usage: 'neofetch',
    output: [
      '═══════════════════════════════════════════════',
      '  HARDWARE BENCHMARK — ASUS VIVOBOOK X515EA',
      '═══════════════════════════════════════════════',
      '',
      '  CPU:         Intel Core i3-1115G4',
      '               2 Cores / 4 Threads @ up to 4.10 GHz',
      '  RAM:         8 GB DDR4',
      '  GPU:         Intel UHD Graphics (128 MB VRAM)',
      '  Storage:     500 GB HDD',
      '  Thermal:     < 40°C sustained (tuned Linux)',
      '',
      '  ─── SOFTWARE CONSTRAINTS ───',
      '',
      '  Peak RAM:    < 1 GB (all projects)',
      '  Paid APIs:   $0',
      '  Cloud Deps:  ZERO',
      '  AI/ML:       ZERO (100% deterministic)',
      '  Telemetry:   ZERO',
      '',
      '═══════════════════════════════════════════════',
    ],
  },
  skills: {
    description: 'Display categorized skills matrix',
    usage: 'skills',
    output: [
      '═══════════════════════════════════════════════',
      '  SKILLS MATRIX',
      '═══════════════════════════════════════════════',
      '',
      '  CYBERSECURITY & FORENSICS:',
      '    802.11 WIPS, Static Malware/APK Triage, Digital Forensics,',
      '    OSINT Aggregation, Applied Cryptography (AES-256-GCM),',
      '    Statistical Steganalysis, Kali Linux, Wireshark',
      '',
      '  DSP & SIGNAL PROCESSING:',
      '    4-FSK Modulation, Chirp Synchronization, FFT/STFT Analysis,',
      '    Phase-Spectrum Coding, Reed-Solomon FEC, Goertzel Detection',
      '',
      '  PROGRAMMING & SYSTEMS:',
      '    Python (NumPy/SciPy), TypeScript/Next.js, Bash, Linux Internals,',
      '    Socket Networking (UDP/TCP), Computer Vision (OpenCV),',
      '    Git & Packaging, Thermal/Kernel Tuning',
      '',
      '  LANGUAGES:',
      '    English  — CEFR C1',
      '    Hindi    — Native Speaker',
      '    Turkish  — TÖMER A1 (CEFR A1)',
      '    Japanese — JLPT N5',
      '',
      '═══════════════════════════════════════════════',
    ],
  },
  languages: {
    description: 'Display language proficiencies',
    usage: 'languages',
    output: [
      '═══════════════════════════════════════════════',
      '  LANGUAGE PROFICIENCIES',
      '═══════════════════════════════════════════════',
      '',
      '  English  — CEFR C1 (Advanced)',
      '  Hindi    — Native Speaker',
      '  Turkish  — TÖMER A1 (CEFR A1)',
      '  Japanese — JLPT N5',
      '',
      '═══════════════════════════════════════════════',
    ],
  },
  achievements: {
    description: 'Display awards and milestones',
    usage: 'achievements',
    output: [
      '═══════════════════════════════════════════════',
      '  ACHIEVEMENTS & MILESTONES',
      '═══════════════════════════════════════════════',
      '',
      '  🏆 SilverZone Computer Science Olympiad — GOLD MEDAL',
      '  🎓 Class 11 — Physics, Chemistry, Mathematics, Computer Science',
      '  🎯 Target: B.Tech Computer Science & Engineering (2028)',
      '  💻 Open-source engineering milestones:',
      '     • echobaud — Production-grade acoustic modem',
      '     • phaseveil — Research-grade steganography engine',
      '     • osint-center — Full-stack OSINT dashboard',
      '     • tensorgate — Defensive cybersecurity suite (WIP)',
      '  🔧 All projects: $0 paid APIs, zero cloud, <1GB RAM, deterministic',
      '',
      '═══════════════════════════════════════════════',
    ],
  },
  contact: {
    description: 'Display contact information',
    usage: 'contact',
    output: [
      '═══════════════════════════════════════════════',
      '  CONTACT',
      '═══════════════════════════════════════════════',
      '',
      '  GitHub:  https://github.com/agiprogrammer',
      '  Email:   agiprogrammer@gmail.com',
      '',
      '  (Click links in footer to copy email)',
      '',
      '═══════════════════════════════════════════════',
    ],
  },
  clear: {
    description: 'Clear terminal screen',
    usage: 'clear',
    output: [],
    special: 'clear',
  },
};

const PROJECT_SPECS: Record<string, string[]> = {
  echobaud: [
    '═══════════════════════════════════════════════',
    '  PROJECT: ECHOBAUD',
    '═══════════════════════════════════════════════',
    '',
    '  Air-gapped acoustic modem for encrypted text/file transfer',
    '  via speakers and microphone. Zero Wi-Fi, Bluetooth, internet,',
    '  or cables. Pure Python 3.10+, deterministic DSP.',
    '',
    '  ─── ARCHITECTURE ───',
    '',
    '  SEND:  TEXT/FILE → AES-256-GCM → FRAME+CRC32 → RS(255,201) → 4-FSK+CHIRP',
    '  RECV:  CAPTURE → SYNC(CHIRP) → GOERTZEL(4-FSK) → RS DEC → DEFRAME+AES',
    '',
    '  ─── DSP SPECIFICATIONS ───',
    '',
    '  Sample Rate:     44,100 Hz',
    '  Modulation:      4-FSK (2 bits/symbol)',
    '  Symbol Duration: 20 ms (882 samples)',
    '  Baud Rate:       50 baud',
    '  Raw Bit Rate:    100 bps',
    '  Audible Tones:   1200, 1900, 2600, 3300 Hz (700 Hz spacing)',
    '  Ultrasonic:      17500, 18167, 18833, 19500 Hz (667 Hz spacing)',
    '  Chirp Preamble:  1000→4000 Hz (audible) / 17000→20000 Hz (ultra), 100ms',
    '  Sync Detection:  Normalized XCorr (FFT), threshold 0.25/0.30',
    '  Demodulation:    Goertzel algorithm (4 tones)',
    '  Squelch:         0.015 (audible) / 0.020 (ultrasonic) adaptive',
    '',
    '  ─── FEC & CRYPTO ───',
    '',
    '  Reed-Solomon:    RS(255, 201) over GF(256), poly 0x11D',
    '  Parity:          54 bytes (corrects 27 byte errors/codeword)',
    '  Encryption:      AES-256-GCM + PBKDF2-HMAC-SHA256 (100k iter)',
    '  Salt:            16 bytes random per message',
    '  Nonce:           12 bytes random per message',
    '  Tag:             16 bytes (appended to ciphertext)',
    '  Frame Format:    MAGIC(0xEB90) | VER_FLAGS | CHUNK_ID | TOTAL_CH | PAYLOAD_LEN | PAYLOAD(188B) | CRC32',
    '',
    '  ─── BENCHMARKS (Audible) ───',
    '',
    '  SNR +20dB:  Corr 0.995, 0/255 errors, ✅ PASS, 41.3 MB RAM',
    '  SNR +15dB:  Corr 0.984, 0/255 errors, ✅ PASS, 41.3 MB RAM',
    '  SNR +10dB:  Corr 0.952, 0/255 errors, ✅ PASS, 41.3 MB RAM',
    '  SNR +5dB:   Corr 0.867, 0/255 errors, ✅ PASS, 41.3 MB RAM',
    '  SNR 0dB:    Corr 0.704, 0/255 errors, ✅ PASS, 41.3 MB RAM',
    '  SNR -5dB:   Corr 0.497, 0/255 errors, ✅ PASS, 41.3 MB RAM',
    '',
    '  Throughput: ~4.9 bps (188 bytes / 20.5 sec frame)',
    '  Peak RAM:   < 42 MB (well under 150 MB target)',
    '',
    '  ─── CLI USAGE ───',
    '',
    '  echobaud send --text "Hello"',
    '  echobaud send --file doc.pdf --wav-out transfer.wav',
    '  echobaud listen --wav-in message.wav',
    '  echobaud --passphrase "secret" send --text "Classified"',
    '  echobaud --mode ultrasonic send --text "Silent"',
    '  echobaud benchmark',
    '',
    '  ─── REPOSITORY ───',
    '',
    '  GitHub: https://github.com/agiprogrammer/echobaud',
    '',
    '═══════════════════════════════════════════════',
  ],
  phaseveil: [
    '═══════════════════════════════════════════════',
    '  PROJECT: PHASEVEIL',
    '═══════════════════════════════════════════════',
    '',
    '  Covert-channel · audio-spectrum steganography ·',
    '  statistical steganalysis engine. Research-grade,',
    '  fully deterministic Python.',
    '',
    '  ─── THREE CAPABILITIES ───',
    '',
    '  1. AUDIO PHASE STEGANOGRAPHY:',
    '     Hide AES-256-GCM payloads in phase spectrum of 16-bit PCM WAV.',
    '     8-PSK on mid-band bins (1000–6000 Hz), K=4 delta-preserving chunks.',
    '     SNR 33–35 dB, PSNR 44–46 dB, ~180 B/s capacity.',
    '',
    '  2. NETWORK TIMING COVERT CHANNEL:',
    '     Transmit bits via UDP/TCP inter-packet delays on 127.0.0.1 loopback.',
    '     Bit 0 = 20ms gap, Bit 1 = 60ms gap. 40ms separation vs ±8ms jitter.',
    '     Adaptive decoding via 16-bit alternating preamble.',
    '',
    '  3. DETERMINISTIC STEGANALYSIS (ZERO ML):',
    '     Audio: per-carrier z-scores of phase quantization to π/4 grid.',
    '     Timing: bimodal separation, Shannon entropy, lag-1 ACF, KS-test.',
    '     Fixed weights: audio=0.7z+0.3H, timing=0.45B+0.25H+0.20L+0.10KS.',
    '     Verdict: SUSPICIOUS iff score ≥ 0.5.',
    '',
    '  ─── CHOSEN PARAMETERS ───',
    '',
    '  FFT Segment N:     2048 (46ms hop, 21.5Hz bins @44.1kHz)',
    '  Embedding Band:    1000–6000 Hz',
    '  Constellation:     M=8 (3 bits/bin, 3× energy efficiency vs 2-PSK)',
    '  Chunk K:           4 segments',
    '  Bin Window:        [0.3,1.0]×band median, 3% dead-band',
    '  Boundary Ladder:   7 multipliers, 0.2% stability margin',
    '  Reliability Floor: max(1%, 20×σ_q) — erasures only where phase lost',
    '  FEC:               RS(255,191), nsym=64 (32 errors/64 erasures)',
    '  Crypto:            AES-256-GCM, 200k PBKDF2, 16B salt, 12B nonce',
    '  Timing:            bit0=20ms, bit1=60ms, preamble=16 alternating bits',
    '  Detector Threshold: 0.50 (calibrated TP/FP sweep)',
    '',
    '  ─── BENCHMARKS ───',
    '',
    '  Audio Round-trip:  Plaintext SNR 33.69dB, AES SNR 32.58dB',
    '  Capacity:          1s→172B, 2s→356B, 3s→588B, 5s→926B (44.1kHz)',
    '  Timing:            12/12 jitter trials (±3–8ms) recover, ±8ms PASS',
    '  Detector Audio:    TP 6/6, FP 0/6 (clean 0.000 vs covert 0.700)',
    '  Detector Timing:   TP 6/6, Poisson FP 0/6, Gaussian FP 0/6 (0.10 vs 0.55)',
    '  Peak RSS:          111.2 MB (budget 150 MB)',
    '  Robustness:        27/27 lossless round-trips, 9 cover classes × 3 seeds',
    '  Test Suite:        136 passed in ~95s (includes live loopback UDP/TCP)',
    '',
    '  ─── CLI USAGE ───',
    '',
    '  phaseveil audio hide --in cover.wav --out stego.wav --text "hello"',
    '  phaseveil audio extract --in stego.wav --passphrase "secret"',
    '  phaseveil timing send --host 127.0.0.1 --port 9999 --text "hello"',
    '  phaseveil timing listen --host 127.0.0.1 --port 9999 --save-trace trace.json',
    '  phaseveil analyze audio --in sample.wav',
    '  phaseveil analyze timing --trace trace.json',
    '  phaseveil benchmark',
    '',
    '  ─── REPOSITORY ───',
    '',
    '  GitHub: https://github.com/agiprogrammer/phaseveil',
    '',
    '═══════════════════════════════════════════════',
  ],
  'osint-center': [
    '═══════════════════════════════════════════════',
    '  PROJECT: OSINT CENTER (VOID//MATRIX v4)',
    '═══════════════════════════════════════════════',
    '',
    '  Browser-based OSINT dashboard: live aircraft, earthquakes,',
    '  disasters, conflict zones, maritime traffic, attack telemetry,',
    '  satellites, and LIVE camera video from ~6,800 public cameras.',
    '  100% FREE. No API keys, no accounts, no npm install, no build.',
    '',
    '  ─── DATA PANELS ───',
    '',
    '  OVERVIEW:      BBC, Al Jazeera, Guardian, DW, NPR RSS (local parse)',
    '  AIR TRAFFIC:   OpenSky Network + hexdb.io/adsb.lol enrichment',
    '                 (30-day cache, military markers, full details)',
    '  CYBER:         SANS ISC/DShield + abuse.ch Feodo',
    '                 60 live attack origins, geolocated, pulsing pins',
    '                 Targeted services + botnet C2 indicators',
    '  DISASTERS:     USGS earthquakes (PAGER, MMI/CDI, tsunami) + NASA EONET',
    '  CCTV:          Live-Environment-Streams HLS index (6,832 streams)',
    '                 60 curated (country×network round-robin), 800 markers',
    '                 Proxy rewrites HLS playlists for no-CORS playback',
    '                 TfL JamCams fallback (London, 2s snapshots)',
    '  MARITIME:      Digitraffic AIS (Baltic) — real vessels with full details',
    '                 MMSI MID→flag, ITU types, military/gov markers',
    '  INTEL FEEDS:   Same RSS as OVERVIEW, full list',
    '  SATELLITES:    CelesTrak TLEs + satellite.js SGP4 propagation',
    '',
    '  ─── ARCHITECTURE ───',
    '',
    '  Server:    Python 3 stdlib (serve.py) — HTTP + /proxy + HLS rewrite',
    '  Frontend:  Vanilla ES modules (type="module") — no bundler',
    '  Map:       Leaflet 1.9+ with markercluster, preferCanvas',
    '  Video:     hls.js (live watchdog) + native HLS (Safari)',
    '  Offline:   download_istanbul_map.py — 39,706 tiles, 277 MB, z0-19',
    '  Vendored:  Leaflet, markercluster, satellite.js, hls.js in js/vendor/',
    '',
    '  ─── FREE-TIER ETIQUETTE ───',
    '',
    '  Flights:     5 min refresh (288/day) — OpenSky anonymous cap ~400',
    '  Ships:       5 min — Digitraffic (Baltic only)',
    '  Quakes:      5 min — USGS M2.5+ 24h',
    '  Disasters:   10 min — NASA EONET',
    '  Cyber C2:    15 min — abuse.ch Feodo',
    '  Cyber Attacks: 15 min — SANS ISC/DShield',
    '  News:        2.5 min — 5 RSS feeds',
    '  Satellites:  5 min — CelesTrak',
    '  CCTV:        30 min — ~6MB camera index',
    '  OpenSky OAuth: Optional — drops to 2 min (auto-fallback)',
    '',
    '  ─── RUN ───',
    '',
    '  cd "OSINT Center"',
    '  python3 serve.py        # http://127.0.0.1:8000',
    '  Login: agiprogrammer / Hacker@11 (themed client-side gate)',
    '',
    '  ─── REPOSITORY ───',
    '',
    '  GitHub: https://github.com/agiprogrammer/osint-center',
    '',
    '═══════════════════════════════════════════════',
  ],
  tensorgate: [
    '═══════════════════════════════════════════════',
    '  PROJECT: TENSORGATE',
    '═══════════════════════════════════════════════',
    '',
    '  Modular Defensive Cybersecurity, Digital Forensics &',
    '  Authorized Vulnerability Assessment Suite.',
    '  NEVER a "hacking framework" — defensive/forensics/authorized-lab ONLY.',
    '',
    '  ─── CORE MODULES ───',
    '',
    '  1. ZERO-EXECUTION STATIC MALWARE/APK TRIAGE:',
    '     Windows PE, Linux ELF, Android APK — header parse, entropy,',
    '     permissions, IOC extraction. ZERO execution, no VMs.',
    '',
    '  2. 802.11 WIPS & ROUTER ANOMALY MONITOR:',
    '     Monitor/AP-mode Wi-Fi dongle → deauth floods, rogue APs,',
    '     spoofed management frames. Passive IDS default; authorized-lab',
    '     active isolation (no legitimate client inspection).',
    '',
    '  3. DETERMINISTIC REAL-TIME ALERT PIPELINE:',
    '     ntfy.sh + Telegram Bot. Zero cloud, zero AI inference.',
    '     Pure rule-based deterministic engine.',
    '',
    '  4. SUB-1GB PACKAGING & SUPPLY-CHAIN MANAGER:',
    '     Refactored ~2.5–3GB → <1GB via automated package manager.',
    '     2 external free tools with manual download + SHA-256 verify.',
    '',
    '  ─── VERIFIED FOOTPRINT ───',
    '',
    '  Peak RAM:        < 1 GB (strict ceiling)',
    '  GPU:             Integrated (128 MB VRAM) sufficient',
    '  AI/ML Models:    ZERO — 100% deterministic rules',
    '  Paid APIs:       $0',
    '  Scope:           Defensive monitoring, forensics, authorized lab ONLY',
    '',
    '  ─── CLI USAGE ───',
    '',
    '  tensorgate triage --file sample.apk --output report.json',
    '  tensorgate wips start --interface wlan0 --mode passive',
    '  tensorgate wips start --interface wlan0 --mode active --authorized-lab',
    '  tensorgate deps check / install / verify',
    '  tensorgate alert test --channel ntfy --topic tensorgate-alerts',
    '  tensorgate --version',
    '  tensorgate status',
    '',
    '  ─── REPOSITORY ───',
    '',
    '  GitHub: https://github.com/agiprogrammer/tensorgate',
    '  Status: Active Development — Public v1.0 Targeting Mid-2027',
    '',
    '═══════════════════════════════════════════════',
  ],
  'cyber-virtual-mouse': [
    '═══════════════════════════════════════════════',
    '  PROJECT: CYBER VIRTUAL MOUSE',
    '═══════════════════════════════════════════════',
    '',
    '  CPU-efficient webcam hand-tracking cursor controller',
    '  optimized for low-end integrated laptop webcams.',
    '',
    '  ─── APPROACH ───',
    '',
    '  Classical CV pipeline (NO deep learning):',
    '  Background subtraction → Contour analysis → Convex hull defects →',
    '  Fingertip detection → Gesture mapping → Cursor control',
    '',
    '  ─── GESTURES ───',
    '',
    '  Index finger extended:  Move cursor',
    '  Pinch (thumb+index):    Left click',
    '  Fist:                   Right click',
    '  Open palm:              Neutral (no action)',
    '',
    '  ─── PERFORMANCE (Reference: Asus VivoBook X515EA) ───',
    '',
    '  Webcam:        Built-in 720p/30fps',
    '  CPU Usage:     ~15-25% single core (i3-1115G4)',
    '  RAM:           < 100 MB',
    '  Latency:       30-50ms end-to-end',
    '  Smoothing:     Exponential moving average',
    '  Calibration:   Adaptive lighting routine',
    '',
    '  ─── LIMITATIONS ───',
    '',
    '  Requires reasonable lighting',
    '  Single-hand tracking only',
    '  Precision lower than physical mouse',
    '  Intended for accessibility/presentation use',
    '',
    '  ─── REPOSITORY ───',
    '',
    '  GitHub: https://github.com/agiprogrammer/cyber-virtual-mouse',
    '  Status: Experimental Research Prototype',
    '',
    '═══════════════════════════════════════════════',
  ],
  'lan-drop': [
    '═══════════════════════════════════════════════',
    '  PROJECT: ENCRYPTED LAN DROP',
    '═══════════════════════════════════════════════',
    '',
    '  Zero-server E2E encrypted P2P file transfer over local Wi-Fi.',
    '  No central server, no internet, no accounts.',
    '',
    '  ─── ARCHITECTURE ───',
    '',
    '  Discovery:   UDP broadcast/multicast for peer discovery on LAN',
    '  Key Exchange: PBKDF2-HMAC-SHA256 (100k iter) from shared passphrase',
    '  Encryption:  AES-256-GCM per file, unique nonce per chunk',
    '  Transport:   TCP with chunked streaming',
    '  Verification: SHA-256 per chunk + full file',
    '  Resume:      Interrupted transfers resume from last verified chunk',
    '',
    '  ─── SECURITY MODEL ───',
    '',
    '  Passphrase never transmitted (local key derivation only)',
    '  Each file: unique encryption context (salt + nonce)',
    '  Forward secrecy: session compromise ≠ other sessions',
    '  No metadata leakage: filenames encrypted in manifest',
    '  MITM resistance: mutual auth via passphrase-derived keys',
    '',
    '  ─── PERFORMANCE (Reference: VivoBook X515EA + Android, 5GHz) ───',
    '',
    '  Transfer Speed:  20-40 MB/s (Wi-Fi limited, not crypto)',
    '  CPU Usage:       < 10% (AES-NI accelerated on i3-1115G4)',
    '  RAM:             < 50 MB',
    '  File Size:       Any (streaming, not memory-mapped)',
    '',
    '  ─── USE CASES ───',
    '',
    '  Air-gapped laptop ↔ phone transfer',
    '  Secure document sharing without cloud',
    '  Backup to local NAS without internet exposure',
    '  Transfer sensitive files where USB restricted',
    '',
    '  ─── REPOSITORY ───',
    '',
    '  GitHub: https://github.com/agiprogrammer/lan-drop',
    '  Status: Experimental Research Prototype',
    '',
    '═══════════════════════════════════════════════',
  ],
};

const QUICK_COMMANDS = [
  'help',
  'ls projects',
  'bench',
  'inspect echobaud',
  'inspect phaseveil',
  'inspect osint-center',
  'inspect tensorgate',
  'languages',
  'clear',
];

export default function Hero() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [inputValue, setInputValue] = useState('');
  const [isBooting, setIsBooting] = useState(true);
  const [bootLineIndex, setBootLineIndex] = useState(0);

  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  useEffect(() => {
    if (!isBooting) return;

    const bootInterval = setInterval(() => {
      if (bootLineIndex < BOOT_LINES.length) {
        setLines((prev) => [...prev, BOOT_LINES[bootLineIndex]]);
        setBootLineIndex((prev) => prev + 1);
      } else {
        setIsBooting(false);
        clearInterval(bootInterval);
      }
    }, 30);

    return () => clearInterval(bootInterval);
  }, [isBooting, bootLineIndex]);

  const executeCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    // Add to history
    setHistory((prev) => [...prev.slice(-49), trimmed]);
    setHistoryIndex(-1);

    // Add command line
    setLines((prev) => [
      ...prev,
      { type: 'prompt', prompt: 'arush@voidmatrix:~$', text: ` ${trimmed}` },
    ]);

    // Parse command
    const parts = trimmed.split(' ');
    const baseCmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    let output: TerminalLine[] = [];

    if (baseCmd === 'help') {
      output = COMMANDS.help.output.map((line) => ({ type: 'output', text: line }));
    } else if (baseCmd === 'whoami') {
      output = COMMANDS.whoami.output.map((line) => ({ type: 'output', className: 'cyan', text: line }));
    } else if (trimmed === 'cat /etc/profile.dossier') {
      output = COMMANDS['cat /etc/profile.dossier'].output.map((line) => ({
        type: 'output',
        className: line.startsWith('═') || line.startsWith('  ───') ? 'green' : line.startsWith('  ') ? 'cyan' : '',
        text: line,
      }));
    } else if (baseCmd === 'ls') {
      if (args === 'projects' || args === 'project') {
        output = COMMANDS['ls projects'].output.map((line) => ({ type: 'output', className: line.startsWith('  ') ? 'cyan' : 'green', text: line }));
      } else {
        output = COMMANDS.ls.output.map((line) => ({ type: 'output', className: line.startsWith('  ') ? 'cyan' : 'green', text: line }));
      }
    } else if (baseCmd === 'inspect' || baseCmd === 'cat') {
      const projectName = args.toLowerCase();
      const spec = PROJECT_SPECS[projectName];
      if (spec) {
        output = spec.map((line) => ({
          type: 'output',
          className: line.startsWith('═') || line.startsWith('  ───') ? 'green' : line.startsWith('  ') ? 'cyan' : '',
          text: line,
        }));
      } else {
        output = [{ type: 'output', className: 'error', text: `bash: inspect: '${projectName}': no such project — type 'ls' for available projects` }];
      }
    } else if (baseCmd === 'open') {
      const slug = args.toLowerCase();
      if (PROJECT_SPECS[slug]) {
        output = [{ type: 'output', className: 'green', text: `Opening /projects/${slug}...` }];
        // Navigate using Next.js router
        window.location.href = `/projects/${slug}`;
        return;
      } else {
        output = [{ type: 'output', className: 'error', text: `bash: open: '${slug}': no such project — type 'ls' for available projects` }];
      }
    } else if (baseCmd === 'bench' || baseCmd === 'neofetch') {
      output = COMMANDS.bench.output.map((line) => ({
        type: 'output',
        className: line.startsWith('═') || line.startsWith('  ───') ? 'green' : line.startsWith('  ') ? 'cyan' : '',
        text: line,
      }));
    } else if (baseCmd === 'skills') {
      output = COMMANDS.skills.output.map((line) => ({
        type: 'output',
        className: line.startsWith('═') || line.startsWith('  ') ? 'cyan' : 'green',
        text: line,
      }));
    } else if (baseCmd === 'languages') {
      output = COMMANDS.languages.output.map((line) => ({
        type: 'output',
        className: line.startsWith('═') ? 'green' : line.startsWith('  ') ? 'cyan' : '',
        text: line,
      }));
    } else if (baseCmd === 'achievements') {
      output = COMMANDS.achievements.output.map((line) => ({
        type: 'output',
        className: line.startsWith('═') || line.startsWith('  ') ? 'cyan' : 'green',
        text: line,
      }));
    } else if (baseCmd === 'contact') {
      output = COMMANDS.contact.output.map((line) => ({
        type: 'output',
        className: line.startsWith('═') ? 'green' : line.startsWith('  ') ? 'cyan' : '',
        text: line,
      }));
    } else if (baseCmd === 'clear') {
      setLines([]);
      return;
    } else {
      output = [{ type: 'output', className: 'error', text: `bash: ${trimmed}: command not found — type 'help' for available commands.` }];
    }

    if (output.length > 0) {
      setLines((prev) => [...prev, ...output, { type: 'blank' }]);
    } else {
      setLines((prev) => [...prev, { type: 'blank' }]);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInputValue(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion for known commands
      const commands = ['help', 'whoami', 'cat', 'ls', 'inspect', 'open', 'bench', 'neofetch', 'skills', 'languages', 'achievements', 'contact', 'clear'];
      const matches = commands.filter((c) => c.startsWith(inputValue.toLowerCase()));
      if (matches.length === 1) {
        setInputValue(matches[0] + ' ');
      } else if (matches.length > 1) {
        // Show matches
        setLines((prev) => [...prev, { type: 'output', text: matches.join('  ') }, { type: 'blank' }, { type: 'prompt', prompt: 'arush@voidmatrix:~$', text: ` ${inputValue}` }]);
      }
    }
  };

  const handleQuickCommand = (cmd: string) => {
    executeCommand(cmd);
  };

  return (
    <div className="hero-wrap" id="hero">
      <div className="hero-grid">
        <div className="hero-left">
          <div className="hero-badge">CYBERSECURITY & DSP ENGINEERING STUDENT</div>
          <h1 className="hero-title">
            ARUSH<br /><span className="green">SHAKYA</span>
          </h1>
          <p className="hero-role">{'// DETERMINISTIC SYSTEMS • DSP • CRYPTOGRAPHY'}</p>
          <p className="hero-desc">
            Independent systems builder engineering offline-first{' '}
            <span className="highlight">security</span>,{' '}
            <span className="highlight">acoustic communication</span>, and{' '}
            <span className="highlight">statistical analysis</span> tools from scratch. Built to run deterministically
            on modest everyday hardware — zero paid APIs, zero third-party telemetry, and zero AI bloat.
          </p>
          <div className="hero-cta">
            <Link href="#projects" className="btn-primary">VIEW PROJECTS</Link>
            <Link href="#skills" className="btn-secondary">SKILL TREE</Link>
          </div>
        </div>
        <div className="hero-terminal">
          <div className="terminal-window">
            <div className="terminal-bar">
              <div className="t-dot r" aria-hidden="true" />
              <div className="t-dot y" aria-hidden="true" />
              <div className="t-dot g" aria-hidden="true" />
              <span className="terminal-title">arush@voidmatrix:~</span>
            </div>
            <div className="terminal-body" ref={terminalRef} role="log" aria-live="polite" aria-label="Terminal output">
              {lines.map((line, i) => (
                <div key={i} className="t-line">
                  {line.type === 'prompt' && (
                    <>
                      <span className="t-prompt">{line.prompt}</span>
                      <span className="t-cmd">{line.text}</span>
                    </>
                  )}
                  {line.type === 'output' && (
                    <span className={`t-out ${line.className || ''}`}>{line.text}</span>
                  )}
                  {line.type === 'blank' && <div style={{ height: '0.5rem' }} />}
                </div>
              ))}
              {!isBooting && (
                <div className="t-line">
                  <span className="t-prompt">arush@voidmatrix:~$</span>
                  <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                    <input
                      ref={inputRef}
                      type="text"
                      className="t-cmd"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoComplete="off"
                      spellCheck={false}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'var(--text)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.82rem',
                        lineHeight: '2',
                        flex: 1,
                      }}
                      aria-label="Terminal input"
                    />
                    <span className="t-cursor" aria-hidden="true" />
                  </form>
                </div>
              )}
            </div>
          </div>
          <div className="quick-commands" role="group" aria-label="Quick commands">
            {QUICK_COMMANDS.map((cmd) => (
              <button
                key={cmd}
                type="button"
                className="quick-command"
                onClick={() => handleQuickCommand(cmd)}
                aria-label={`Run command: ${cmd}`}
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}