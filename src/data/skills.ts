export interface Skill {
  icon: string;
  name: string;
  tag: string;
}

export interface SkillCategory {
  label: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    label: 'CYBERSECURITY & FORENSICS',
    skills: [
      { icon: '📡', name: '802.11 WIPS', tag: 'WIRELESS' },
      { icon: '🔬', name: 'Static Malware/APK Triage', tag: 'ANALYSIS' },
      { icon: '🕵️', name: 'Digital Forensics', tag: 'FORENSICS' },
      { icon: '🌐', name: 'OSINT Aggregation', tag: 'INTEL' },
      { icon: '🔐', name: 'Applied Cryptography', tag: 'AES-256-GCM' },
      { icon: '📊', name: 'Statistical Steganalysis', tag: 'DETECTION' },
      { icon: '🐉', name: 'Kali Linux', tag: 'PLATFORM' },
      { icon: '📈', name: 'Wireshark', tag: 'PCAP' },
    ],
  },
  {
    label: 'DSP & SIGNAL PROCESSING',
    skills: [
      { icon: '📻', name: '4-FSK Modulation', tag: 'DSP' },
      { icon: '🎵', name: 'Chirp Synchronization', tag: 'SYNC' },
      { icon: '📊', name: 'FFT / STFT Analysis', tag: 'SPECTRAL' },
      { icon: '🔄', name: 'Phase-Spectrum Coding', tag: 'STEGO' },
      { icon: '🛡️', name: 'Reed-Solomon FEC', tag: 'RS(255,201)' },
      { icon: '🎯', name: 'Goertzel Detection', tag: 'TONE' },
    ],
  },
  {
    label: 'PROGRAMMING & SYSTEMS',
    skills: [
      { icon: '🐍', name: 'Python (NumPy/SciPy)', tag: 'SCIENTIFIC' },
      { icon: '⚡', name: 'TypeScript / Next.js', tag: 'FULLSTACK' },
      { icon: '💻', name: 'Bash', tag: 'SHELL' },
      { icon: '🐧', name: 'Linux Internals', tag: 'KERNEL' },
      { icon: '🔌', name: 'Socket Networking', tag: 'UDP/TCP' },
      { icon: '👁️', name: 'Computer Vision (OpenCV)', tag: 'CV' },
      { icon: '📦', name: 'Git & Packaging', tag: 'CI/CD' },
      { icon: '🌡️', name: 'Thermal/Kernel Tuning', tag: 'PERF' },
    ],
  },
  {
    label: 'LANGUAGES',
    skills: [
      { icon: '🇬🇧', name: 'English', tag: 'CEFR C1' },
      { icon: '🇮🇳', name: 'Hindi', tag: 'NATIVE' },
      { icon: '🇹🇷', name: 'Turkish', tag: 'TÖMER A1' },
      { icon: '🇯🇵', name: 'Japanese', tag: 'JLPT N5' },
    ],
  },
];