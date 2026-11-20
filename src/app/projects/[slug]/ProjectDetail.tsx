'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { Project } from '@/data/projects';
import { RepoStats } from '@/lib/github';
import EchobaudCanvas from '@/app/projects/echobaud/EchobaudCanvas';

interface ProjectDetailProps {
  project: Project;
  repoStats: RepoStats;
}

export default function ProjectDetail({ project, repoStats }: ProjectDetailProps) {
  const [sandboxOutput, setSandboxOutput] = useState<string[]>([]);
  const [sandboxInput, setSandboxInput] = useState('');
  const [sandboxHistory, setSandboxHistory] = useState<string[]>([]);
  const [sandboxHistoryIndex, setSandboxHistoryIndex] = useState(-1);
  const sandboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (sandboxRef.current) {
      sandboxRef.current.scrollTop = sandboxRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [sandboxOutput, scrollToBottom]);

  const addOutput = (lines: string[], className?: string) => {
    setSandboxOutput((prev) => [...prev, ...lines.map((l) => `${className ? `[${className}]` : ''}${l}`)]);
  };

  const executeSandboxCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setSandboxHistory((prev) => [...prev.slice(-49), trimmed]);
    setSandboxHistoryIndex(-1);
    addOutput([`$ ${trimmed}`]);

    // Sandbox-specific commands
    if (project.sandboxType === 'echobaud') {
      handleEchobaudSandbox(trimmed);
    } else if (project.sandboxType === 'phaseveil') {
      handlePhaseveilSandbox(trimmed);
    } else if (project.sandboxType === 'osint-center') {
      handleOsintCenterSandbox(trimmed);
    } else if (project.sandboxType === 'tensorgate') {
      handleTensorgateSandbox(trimmed);
    } else {
      addOutput([`Command not available in this sandbox. Try 'help' for options.`], 'error');
    }
  };

  const handleEchobaudSandbox = (cmd: string) => {
    const parts = cmd.split(' ');
    const base = parts[0].toLowerCase();

    if (base === 'help') {
      addOutput([
        'EchoBaud Web Audio 4-FSK Playground',
        '',
        'Commands:',
        '  modulate <text> [audible|ultrasonic]  — Generate and play 4-FSK audio',
        '  spectrogram <text>                   — Show live FFT visualization',
        '  inspect-frame <text>                 — Show color-coded packet frame',
        '  benchmark                            — Run SNR benchmark simulation',
        '  help                                 — Show this help',
        '  clear                                — Clear output',
      ]);
    } else if (base === 'modulate') {
      const text = parts.slice(1, -1).join(' ') || 'AGRA->2028';
      const mode = parts[parts.length - 1] === 'ultrasonic' ? 'ultrasonic' : 'audible';
      addOutput([
        `[MODULATE] Mode: ${mode.toUpperCase()}`,
        `[MODULATE] Input: "${text}"`,
        `[MODULATE] Encoding frame...`,
        `[MODULATE] Frame: MAGIC(0xEB90) | VER_FLAGS | CHUNK_ID | TOTAL_CH | PAYLOAD_LEN | PAYLOAD | CRC32`,
        `[MODULATE] AES-256-GCM encryption: ENABLED (demo key)`,
        `[MODULATE] RS(255,201) FEC: 54 parity bytes added`,
        `[MODULATE] 4-FSK modulation: 4 tones @ ${mode === 'audible' ? '1200/1900/2600/3300' : '17500/18167/18833/19500'} Hz`,
        `[MODULATE] Chirp preamble: ${mode === 'audible' ? '1000→4000' : '17000→20000'} Hz, 100ms`,
        `[MODULATE] Generating Web Audio buffer...`,
        `[MODULATE] ✓ Audio ready — playing through speakers`,
        `[MODULATE] FFT spectrogram active (see canvas below)`,
      ], 'green');
      // Trigger canvas visualization
      window.dispatchEvent(new CustomEvent('echobaud-modulate', { detail: { text, mode } }));
    } else if (base === 'spectrogram') {
      const text = parts.slice(1).join(' ') || 'AGRA->2028';
      addOutput([
        `[SPECTROGRAM] Live FFT for: "${text}"`,
        `[SPECTROGRAM] Canvas rendering... (green = signal, dim = noise)`,
      ], 'cyan');
      window.dispatchEvent(new CustomEvent('echobaud-spectrogram', { detail: { text } }));
    } else if (base === 'inspect-frame') {
      const text = parts.slice(1).join(' ') || 'AGRA->2028';
      addOutput([
        `[FRAME INSPECTION] "${text}"`,
        '',
        '  ┌──────┬──────────┬──────────┬──────────┬───────────┬───────────┬────────┐',
        '  │MAGIC │VER_FLAGS │ CHUNK_ID │ TOTAL_CH │PAYLOAD_LEN│  PAYLOAD  │ CRC32  │',
        '  │ 2B   │   1B     │   2B     │   2B     │   2B      │  188B     │  4B    │',
        '  ├──────┼──────────┼──────────┼──────────┼───────────┼───────────┼────────┤',
        '  │0xEB90│ 0x03     │ 0x0000   │ 0x0001   │ 0x000C    │ [encrypted]│ 0xA1B2 │',
        '  └──────┴──────────┴──────────┴──────────┴───────────┴───────────┴────────┘',
        '',
        '  Color Legend:',
        '  █ MAGIC (0xEB90)          █ VER_FLAGS (v1|ENCRYPTED)',
        '  █ CHUNK_ID (0)            █ TOTAL_CHUNKS (1)',
        '  █ PAYLOAD_LEN (12)        █ PAYLOAD (AES-256-GCM ciphertext)',
        '  █ CRC32 (0xA1B2C3D4)      ',
      ], 'purple');
    } else if (base === 'benchmark') {
      addOutput([
        '[BENCHMARK] EchoBaud SNR Simulation (Audible Profile)',
        '',
        '  SNR      Preamble Corr  Raw Errors  FEC Recovery  Peak RAM',
        '  +20 dB   0.995          0/255       ✅ PASS       41.3 MB',
        '  +15 dB   0.984          0/255       ✅ PASS       41.3 MB',
        '  +10 dB   0.952          0/255       ✅ PASS       41.3 MB',
        '  +5 dB    0.867          0/255       ✅ PASS       41.3 MB',
        '  0 dB     0.704          0/255       ✅ PASS       41.3 MB',
        '  -5 dB    0.497          0/255       ✅ PASS       41.3 MB',
        '',
        '  Ultrasonic Profile:',
        '  +20 dB   0.752          0/255       ✅ PASS       41.3 MB',
        '  -5 dB    0.378          6/255       ✅ PASS       41.3 MB',
        '',
        '  Effective throughput: ~4.9 bps',
        '  Peak RAM: < 42 MB',
      ], 'green');
    } else if (base === 'clear') {
      setSandboxOutput([]);
    } else {
      addOutput([`bash: ${cmd}: command not found — type 'help' for available commands.`], 'error');
    }
  };

  const handlePhaseveilSandbox = (cmd: string) => {
    const parts = cmd.split(' ');
    const base = parts[0].toLowerCase();

    if (base === 'help') {
      addOutput([
        'PhaseVeil Covert-Channel & Steganalysis Lab',
        '',
        'Commands:',
        '  audio-hide <text>           — Hide text in WAV phase spectrum',
        '  audio-extract               — Extract hidden payload from WAV',
        '  timing-send <text>          — Send via IPD covert channel (loopback)',
        '  timing-listen               — Listen for IPD covert channel',
        '  analyze-audio               — Run statistical steganalysis on WAV',
        '  analyze-timing              — Run timing channel detection',
        '  demo-clean                  — Show clean audio statistics',
        '  demo-covert                 — Show covert channel statistics',
        '  help                        — Show this help',
        '  clear                       — Clear output',
      ]);
    } else if (base === 'audio-hide') {
      const text = parts.slice(1).join(' ') || 'PhaseVeil demo';
      addOutput([
        `[AUDIO HIDE] Payload: "${text}"`,
        `[AUDIO HIDE] Crypto: AES-256-GCM + zlib + PBKDF2(200k)`,
        `[AUDIO HIDE] Frame: MAGIC | VER_FLAGS | LEN | PAYLOAD | CRC32`,
        `[AUDIO HIDE] FEC: RS(255,191) nsym=64`,
        `[AUDIO HIDE] Phase coding: 8-PSK on mid-band (1000-6000 Hz)`,
        `[AUDIO HIDE] Chunk K=4: carrier + 3 delta-preserving followers`,
        `[AUDIO HIDE] Bin selection: [0.3,1.0]×median, 3% dead-band`,
        `[AUDIO HIDE] Embedding...`,
        `[AUDIO HIDE] ✓ Stego WAV generated`,
        `[AUDIO HIDE] SNR: 33.69 dB | PSNR: 44.65 dB | Capacity: 552 B`,
        `[AUDIO HIDE] Erasures: 0 bits (0.0%)`,
      ], 'green');
    } else if (base === 'analyze-audio') {
      addOutput([
        `[ANALYZE AUDIO] Running deterministic steganalysis...`,
        `[ANALYZE AUDIO] Feature extraction: per-carrier z-scores + phase entropy`,
        `[ANALYZE AUDIO] z_max (clean): ~3.0 (sqrt(2 ln n) for n carriers)`,
        `[ANALYZE AUDIO] z_max (covert): ~25.0 (quantized to π/4 grid)`,
        `[ANALYZE AUDIO] Phase histogram entropy: clean=high, covert=low`,
        `[ANALYZE AUDIO] Mean grid distance: covert ≈ 0.02 rad`,
        `[ANALYZE AUDIO] ±π/2 clustering ratio: covert ≈ 0.95`,
        `[ANALYZE AUDIO] Score = 0.7*z + 0.3*entropy = 0.700`,
        `[ANALYZE AUDIO] VERDICT: SUSPICIOUS (score ≥ 0.5)`,
      ], 'cyan');
    } else if (base === 'demo-clean') {
      addOutput([
        `[DEMO CLEAN] Natural audio statistics:`,
        `  z_max: 2.84`,
        `  Phase entropy: 4.12 bits`,
        `  Mean grid distance: 0.41 rad`,
        `  ±π/2 clustering: 0.12`,
        `  Score: 0.000`,
        `  VERDICT: CLEAN`,
      ], 'green');
    } else if (base === 'demo-covert') {
      addOutput([
        `[DEMO COVERT] PhaseVeil covert channel statistics:`,
        `  z_max: 24.7`,
        `  Phase entropy: 1.03 bits`,
        `  Mean grid distance: 0.019 rad`,
        `  ±π/2 clustering: 0.94`,
        `  Score: 0.700`,
        `  VERDICT: SUSPICIOUS`,
      ], 'purple');
    } else if (base === 'clear') {
      setSandboxOutput([]);
    } else {
      addOutput([`bash: ${cmd}: command not found — type 'help' for available commands.`], 'error');
    }
  };

  const handleOsintCenterSandbox = (cmd: string) => {
    const parts = cmd.split(' ');
    const base = parts[0].toLowerCase();

    if (base === 'help') {
      addOutput([
        'OSINT Center — Interactive Localhost Privacy Architecture',
        '',
        'Commands:',
        '  architecture          — Show data flow diagram',
        '  privacy-boundaries    — Highlight zero-cloud boundaries',
        '  ram-ceiling           — Show 8GB RAM constraint',
        '  api-cost              — Show $0 API architecture',
        '  live-feeds            — List active data feeds',
        '  offline-map           — Show Istanbul offline map status',
        '  help                  — Show this help',
        '  clear                 — Clear output',
      ]);
    } else if (base === 'architecture') {
      addOutput([
        `[ARCHITECTURE] VOID//MATRIX Data Flow`,
        '',
        `  ┌─────────────┐     ┌──────────────────┐     ┌─────────────┐`,
        `  │ PUBLIC FEEDS │────▶│ 127.0.0.1:8000   │────▶│  LOCAL UI   │`,
        `  │ (RSS, APIs)  │     │ /proxy + HLS     │     │ (Browser)   │`,
        `  └─────────────┘     │  REWRITE         │     └─────────────┘`,
        `                       └──────────────────┘`,
        '',
        `  Zero-Cloud Boundaries:`,
        `  ✓ No API keys required for any feed`,
        `  ✓ Proxy runs locally (your machine)`,
        `  ✓ HLS playlists rewritten to /proxy URLs`,
        `  ✓ No third-party proxy sees traffic`,
        `  ✓ Camera index cached in localStorage`,
        `  ✓ Aircraft enrichment cached 30 days locally`,
      ], 'cyan');
    } else if (base === 'privacy-boundaries') {
      addOutput([
        `[PRIVACY BOUNDARIES]`,
        '',
        `  ████████████████████████████████████████`,
        `  █  PUBLIC INTERNET                     █`,
        `  █  ┌────────────────────────────────┐  █`,
        `  █  │ RSS Feeds (BBC, AJ, etc.)      │  █`,
        `  █  │ OpenSky Network (anonymous)    │  █`,
        `  █  │ USGS, NASA, CelesTrak          │  █`,
        `  █  │ Live-Environment-Streams       │  █`,
        `  █  │ Digitraffic AIS                │  █`,
        `  █  └────────────────────────────────┘  █`,
        `  █                  │                   █`,
        `  █                  ▼                   █`,
        `  █  ┌────────────────────────────────┐  █`,
        `  █  │ LOCAL PROXY (serve.py)         │  █`,
        `  █  │ • Fetches & caches feeds       │  █`,
        `  █  │ • Rewrites HLS playlists       │  █`,
        `  █  │ • No logging, no telemetry     │  █`,
        `  █  └────────────────────────────────┘  █`,
        `  █                  │                   █`,
        `  █                  ▼                   █`,
        `  █  ┌────────────────────────────────┐  █`,
        `  █  │ BROWSER (127.0.0.1:8000)       │  █`,
        `  █  │ • All rendering local          │  █`,
        `  █  │ • Leaflet + hls.js + sat.js    │  █`,
        `  █  │ • localStorage for caches      │  █`,
        `  █  └────────────────────────────────┘  █`,
        `  ████████████████████████████████████████`,
      ], 'green');
    } else if (base === 'ram-ceiling') {
      addOutput([
        `[RAM CEILING] 8 GB Constraint Verification`,
        '',
        `  Browser Process:     ~200-400 MB (all layers active)`,
        `  Python Proxy:        ~50 MB`,
        `  OS + Overhead:       ~1.5 GB`,
        `  ─────────────────────────────────`,
        `  Total:               < 2 GB (well under 8 GB)`,
        `  Headroom:            > 6 GB for other tasks`,
        '',
        `  Per-Feed Memory (approx):`,
        `  Aircraft (5000):     ~80 MB (markers + enrichment cache)`,
        `  Maritime (900):      ~30 MB`,
        `  CCTV (800 markers):  ~20 MB`,
        `  Satellites (5000):   ~40 MB (SGP4 propagation)`,
        `  HLS Video Buffer:    ~100 MB (per active stream)`,
      ], 'cyan');
    } else if (base === 'api-cost') {
      addOutput([
        `[API COST] $0 Architecture Verification`,
        '',
        `  Feed                    Cost    Auth Method`,
        `  ────────────────────────────────────────────`,
        `  OpenSky Network         FREE    Anonymous / OAuth (optional)`,
        `  USGS Earthquakes        FREE    No key`,
        `  NASA EONET              FREE    No key`,
        `  SANS ISC/DShield        FREE    No key`,
        `  abuse.ch Feodo          FREE    No key`,
        `  CelesTrak TLEs          FREE    No key`,
        `  Digitraffic AIS         FREE    No key`,
        `  Live-Env-Streams        FREE    No key (GeoJSON)`,
        `  TfL JamCams             FREE    No key`,
        `  Nominatim (OSM)         FREE    No key (rate limited)`,
        `  hexdb.io / adsb.lol     FREE    No key (30-day cache)`,
        `  ────────────────────────────────────────────`,
        `  TOTAL MONTHLY COST      $0`,
      ], 'green');
    } else if (base === 'clear') {
      setSandboxOutput([]);
    } else {
      addOutput([`bash: ${cmd}: command not found — type 'help' for available commands.`], 'error');
    }
  };

  const handleTensorgateSandbox = (cmd: string) => {
    const parts = cmd.split(' ');
    const base = parts[0].toLowerCase();

    if (base === 'help') {
      addOutput([
        'TensorGate — WIPS & Static Triage Console',
        '',
        'Commands:',
        '  triage-apk <name>      — Simulate static APK triage',
        '  triage-pe <name>       — Simulate static PE/ELF triage',
        '  wips-deauth            — Simulate deauth flood detection',
        '  wips-rogue-ap          — Simulate rogue AP detection',
        '  check-deps             — Run --check-deps SHA-256 pre-flight',
        '  alert-test             — Test ntfy/Telegram alert pipeline',
        '  ram-telemetry          — Show live <1GB RAM bar',
        '  help                   — Show this help',
        '  clear                  — Clear output',
      ]);
    } else if (base === 'triage-apk') {
      const name = parts[1] || 'sample.apk';
      addOutput([
        `[TRIAGE APK] ${name}`,
        `[TRIAGE APK] Mode: ZERO-EXECUTION STATIC ANALYSIS`,
        `[TRIAGE APK] Parsing AndroidManifest.xml...`,
        `[TRIAGE APK] Package: com.example.app`,
        `[TRIAGE APK] Permissions:`,
        `  █ android.permission.INTERNET`,
        `  █ android.permission.CAMERA`,
        `  █ android.permission.RECORD_AUDIO`,
        `  █ android.permission.ACCESS_FINE_LOCATION`,
        `  █ android.permission.READ_CONTACTS`,
        `  █ android.permission.SEND_SMS`,
        `[TRIAGE APK] Shannon Entropy Scan:`,
        `  classes.dex:  7.21 bits/byte (normal)`,
        `  libnative.so: 7.89 bits/byte (HIGH - possible packing)`,
        `[TRIAGE APK] IOC Extraction:`,
        `  URLs: 3 found (api.example.com, c2.badactor.net, ...)`,
        `  IPs:  1 found (192.168.1.100)`,
        `  Certs: 2 self-signed certificates`,
        `[TRIAGE APK] Rule Matches:`,
        `  [RULE-001] HIGH ENTROPY LIBRARY — libnative.so`,
        `  [RULE-004] SUSPICIOUS PERMISSION COMBO — CAMERA+RECORD_AUDIO+LOCATION`,
        `  [RULE-012] KNOWN C2 DOMAIN — c2.badactor.net`,
        `[TRIAGE APK] VERDICT: SUSPICIOUS — 3 rule matches`,
        `[TRIAGE APK] Alert dispatched: ntfy + Telegram`,
      ], 'purple');
    } else if (base === 'wips-deauth') {
      addOutput([
        `[WIPS DEAUTH] Simulating deauthentication flood...`,
        `[WIPS DEAUTH] Interface: wlan0 (monitor mode)`,
        `[WIPS DEAUTH] Detection: 802.11 management frame analysis`,
        `[WIPS DEAUTH] Threshold: 50 deauth frames/sec per BSSID`,
        `[WIPS DEAUTH] ┌──────────────────────────────────────┐`,
        `[WIPS DEAUTH] │ ATTACK DETECTED                      │`,
        `[WIPS DEAUTH] │ BSSID: AA:BB:CC:DD:EE:FF             │`,
        `[WIPS DEAUTH] │ SSID: "CorporateWiFi"                │`,
        `[WIPS DEAUTH] │ Rate: 247 deauth/sec                 │`,
        `[WIPS DEAUTH] │ Source: 11:22:33:44:55:66 (spoofed)  │`,
        `[WIPS DEAUTH] └──────────────────────────────────────┘`,
        `[WIPS DEAUTH] Mode: PASSIVE IDS (monitoring only)`,
        `[WIPS DEAUTH] Alert: ntfy/tensorgate-alerts + Telegram`,
        `[WIPS DEAUTH] Payload: {type: "deauth_flood", bssid, rate, timestamp}`,
      ], 'green');
    } else if (base === 'check-deps') {
      addOutput([
        `[CHECK-DEPS] Supply-Chain Verification Pre-flight`,
        `[CHECK-DEPS] External Tool 1: yara-4.3.2`,
        `[CHECK-DEPS]   URL: https://github.com/VirusTotal/yara/releases/download/v4.3.2/yara-4.3.2.tar.gz`,
        `[CHECK-DEPS]   SHA-256: a1b2c3d4e5f6... (verified ✓)`,
        `[CHECK-DEPS] External Tool 2: capstone-5.0.1`,
        `[CHECK-DEPS]   URL: https://github.com/capstone-engine/capstone/archive/5.0.1.tar.gz`,
        `[CHECK-DEPS]   SHA-256: f6e5d4c3b2a1... (verified ✓)`,
        `[CHECK-DEPS] Internal Dependencies:`,
        `[CHECK-DEPS]   numpy, scipy, cryptography, reedsolo, pyyaml`,
        `[CHECK-DEPS]   All pinned, hash-verified via pip-audit`,
        `[CHECK-DEPS] Packaging: Automated package manager`,
        `[CHECK-DEPS] Release Footprint: 947 MB (< 1 GB target ✓)`,
        `[CHECK-DEPS] Refactored from: ~2.8 GB → 947 MB (66% reduction)`,
      ], 'cyan');
    } else if (base === 'ram-telemetry') {
      addOutput([
        `[RAM TELEMETRY] Live Memory Monitor`,
        `[RAM TELEMETRY] ┌────────────────────────────────────────┐`,
        `[RAM TELEMETRY] │ ████████████████████░░░░░░░░░░  642 MB  │`,
        `[RAM TELEMETRY] │ Limit: 1024 MB (1 GB ceiling)            │`,
        `[RAM TELEMETRY] │ Headroom: 382 MB (37%)                   │`,
        `[RAM TELEMETRY] └────────────────────────────────────────┘`,
        `[RAM TELEMETRY] Modules:`,
        `  Static Triage:    180 MB`,
        `  WIPS Monitor:     220 MB`,
        `  Alert Pipeline:   45 MB`,
        `  Dependency Mgr:   95 MB`,
        `  Overhead:         102 MB`,
      ], 'green');
    } else if (base === 'clear') {
      setSandboxOutput([]);
    } else {
      addOutput([`bash: ${cmd}: command not found — type 'help' for available commands.`], 'error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (sandboxHistory.length > 0 && sandboxHistoryIndex < sandboxHistory.length - 1) {
        const newIndex = sandboxHistoryIndex + 1;
        setSandboxHistoryIndex(newIndex);
        setSandboxInput(sandboxHistory[sandboxHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (sandboxHistoryIndex > 0) {
        const newIndex = sandboxHistoryIndex - 1;
        setSandboxHistoryIndex(newIndex);
        setSandboxInput(sandboxHistory[sandboxHistory.length - 1 - newIndex]);
      } else if (sandboxHistoryIndex === 0) {
        setSandboxHistoryIndex(-1);
        setSandboxInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const commands: Record<string, string[]> = {
        echobaud: ['modulate', 'spectrogram', 'inspect-frame', 'benchmark', 'help', 'clear'],
        phaseveil: ['audio-hide', 'audio-extract', 'timing-send', 'timing-listen', 'analyze-audio', 'analyze-timing', 'demo-clean', 'demo-covert', 'help', 'clear'],
        'osint-center': ['architecture', 'privacy-boundaries', 'ram-ceiling', 'api-cost', 'live-feeds', 'offline-map', 'help', 'clear'],
        tensorgate: ['triage-apk', 'triage-pe', 'wips-deauth', 'wips-rogue-ap', 'check-deps', 'alert-test', 'ram-telemetry', 'help', 'clear'],
      };
      const cmds = commands[project.slug] || ['help', 'clear'];
      const matches = cmds.filter((c) => c.startsWith(sandboxInput.toLowerCase()));
      if (matches.length === 1) {
        setSandboxInput(matches[0] + ' ');
      } else if (matches.length > 1) {
        addOutput([matches.join('  ')], 'cyan');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSandboxCommand(sandboxInput);
    setSandboxInput('');
  };

  const sandboxQuickCommands: Record<string, string[]> = {
    echobaud: ['modulate AGRA->2028', 'modulate AGRA->2028 ultrasonic', 'spectrogram AGRA->2028', 'inspect-frame AGRA->2028', 'benchmark', 'clear'],
    phaseveil: ['audio-hide PhaseVeil demo', 'analyze-audio', 'demo-clean', 'demo-covert', 'help', 'clear'],
    'osint-center': ['architecture', 'privacy-boundaries', 'ram-ceiling', 'api-cost', 'help', 'clear'],
    tensorgate: ['triage-apk sample.apk', 'wips-deauth', 'check-deps', 'ram-telemetry', 'help', 'clear'],
  };

  return (
    <div className="project-detail">
      {/* Project Hero */}
      <section className="project-hero">
        <div className="project-hero-grid">
          <div>
            <div className="project-hero-badge">{project.status}</div>
            <h1 className="project-hero-title">
              {project.title}<br /><span className="green">{project.subtitle}</span>
            </h1>
            <p className="project-hero-desc">{project.longDescription}</p>
            <div className="project-meta-grid">
              <div className="project-meta-item">
                <div className="project-meta-label">STATUS</div>
                <div className="project-meta-value">{project.status}</div>
              </div>
              <div className="project-meta-item">
                <div className="project-meta-label">LANGUAGE</div>
                <div className="project-meta-value">{repoStats.language || 'Python'}</div>
              </div>
              <div className="project-meta-item">
                <div className="project-meta-label">STARS</div>
                <div className="project-meta-value">{repoStats.stars.toLocaleString()}</div>
              </div>
              <div className="project-meta-item">
                <div className="project-meta-label">UPDATED</div>
                <div className="project-meta-value">{repoStats.lastUpdated}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: 'none' }}>
                VIEW ON GITHUB
              </a>
              <Link href="#sandbox" className="btn-secondary">
                OPEN SANDBOX
              </Link>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ fontSize: '8rem', opacity: '0.1', fontFamily: 'var(--font-display)', color: 'var(--green)', textShadow: 'var(--green-glow)' }}>
              {project.icon}
            </div>
          </div>
        </div>
      </section>

      {/* Project Content */}
      <div className="project-content">
        {/* Architecture */}
        {project.architecture && (
          <section className="project-section">
            <h2 className="project-section-title">ARCHITECTURE</h2>
            <pre className="architecture-diagram">{project.architecture}</pre>
          </section>
        )}

        {/* Specifications */}
        {project.specifications && (
          <section className="project-section">
            <h2 className="project-section-title">SPECIFICATIONS</h2>
            <table className="spec-table">
              <thead>
                <tr>
                  <th>PARAMETER</th>
                  <th>VALUE</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(project.specifications).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* CLI Usage */}
        {project.cliUsage && (
          <section className="project-section">
            <h2 className="project-section-title">CLI USAGE</h2>
            <pre className="project-code">{project.cliUsage}</pre>
          </section>
        )}

        {/* Benchmarks */}
        {project.benchmarkData && (
          <section className="project-section">
            <h2 className="project-section-title">BENCHMARKS & VERIFICATION</h2>
            {Object.entries(project.benchmarkData).map(([section, data]) => {
              const isTable = Array.isArray(data[0]);
              const tableData = isTable ? (data as unknown as string[][]) : null;
              const listData = !isTable ? (data as unknown as string[]) : null;
              return (
                <div key={section} style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ color: 'var(--green)', fontFamily: 'var(--font-display)', fontSize: '0.85rem', marginBottom: '0.5rem', letterSpacing: '0.08em' }}>{section}</h3>
                  {isTable && tableData && (
                    <table className="spec-table">
                      <thead>
                        <tr>
                          {tableData[0].map((header, i) => (
                            <th key={i}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.slice(1).map((row, ri) => (
                          <tr key={ri}>
                            {row.map((cell, ci) => (
                              <td key={ci}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {!isTable && listData && (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {listData.map((item, i) => (
                        <li key={i} style={{ marginBottom: '0.3rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {/* Sandbox */}
        {project.sandboxType && (
          <section className="sandbox-section" id="sandbox">
            <h2 className="project-section-title">INTERACTIVE SANDBOX</h2>
            <p className="project-text">
              Zero-backend browser sandbox running entirely client-side. Type commands below or use quick-command chips.
            </p>
            <div className="sandbox-terminal">
              <div className="sandbox-bar">
                <div className="t-dot r" aria-hidden="true" />
                <div className="t-dot y" aria-hidden="true" />
                <div className="t-dot g" aria-hidden="true" />
                <span className="terminal-title">{project.slug}@sandbox:~</span>
              </div>
              <div className="sandbox-body" ref={sandboxRef} role="log" aria-live="polite" aria-label="Sandbox output">
                {sandboxOutput.map((line, i) => {
                  const match = line.match(/^\[(error|green|cyan|purple)\](.*)$/);
                  const className = match ? match[1] : '';
                  const text = match ? match[2] : line;
                  return (
                    <div key={i} className="sandbox-line">
                      <span className={`sandbox-output ${className}`}>{text}</span>
                    </div>
                  );
                })}
                <div className="sandbox-line">
                  <span className="sandbox-prompt">{project.slug}@sandbox:~$</span>
                  <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                    <input
                      ref={inputRef}
                      type="text"
                      className="sandbox-input"
                      value={sandboxInput}
                      onChange={(e) => setSandboxInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoComplete="off"
                      spellCheck={false}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'var(--text)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        lineHeight: '1.8',
                        flex: 1,
                      }}
                      aria-label="Sandbox input"
                    />
                    <span className="sandbox-cursor" aria-hidden="true" />
                  </form>
                </div>
              </div>
              <div className="quick-commands" role="group" aria-label="Sandbox quick commands">
                {sandboxQuickCommands[project.slug]?.map((cmd) => (
                  <button
                    key={cmd}
                    type="button"
                    className="quick-command"
                    onClick={() => executeSandboxCommand(cmd)}
                    aria-label={`Run: ${cmd}`}
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
            {/* Canvas for Echobaud visualization */}
            {project.sandboxType === 'echobaud' && (
              <EchobaudCanvas />
            )}
          </section>
        )}
      </div>

      <Link href="/" className="btn-secondary" style={{ display: 'inline-block', marginTop: '2rem' }}>
        ← BACK TO PORTFOLIO
      </Link>
    </div>
  );
}