'use client';

import { useEffect, useRef } from 'react';

export default function EchobaudCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array>();
  const modeRef = useRef<'audible' | 'ultrasonic'>('audible');
  const isPlayingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = 200;
    };

    resize();
    window.addEventListener('resize', resize);

    // Listen for modulation events
    const handleModulate = (e: CustomEvent) => {
      modeRef.current = e.detail.mode;
      playToneSequence(e.detail.text, e.detail.mode);
    };

    const handleSpectrogram = (e: CustomEvent) => {
      // Just show the spectrogram for the text
      modeRef.current = 'audible';
      playToneSequence(e.detail.text, 'audible');
    };

    window.addEventListener('echobaud-modulate', handleModulate as EventListener);
    window.addEventListener('echobaud-spectrogram', handleSpectrogram as EventListener);

    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current) {
        // Draw idle state
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(0,255,65,0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 40) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 40) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(canvas.width, i);
          ctx.stroke();
        }
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const bufferLength = dataArrayRef.current.length;
      const barWidth = canvas.width / bufferLength;

      for (let i = 0; i < bufferLength; i++) {
        const value = dataArrayRef.current[i];
        const percent = value / 255;
        const barHeight = canvas.height * percent * 2;
        const x = i * barWidth;
        const y = canvas.height - barHeight;

        // Green gradient based on intensity
        const hue = 120; // Green
        const saturation = 100;
        const lightness = 30 + percent * 50;
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        ctx.fillRect(x, y, Math.max(1, barWidth), barHeight);
      }

      // Draw frequency labels
      ctx.fillStyle = 'rgba(0,255,65,0.5)';
      ctx.font = '10px "Share Tech Mono", monospace';
      ctx.fillText(`${modeRef.current === 'audible' ? 'AUDIBLE' : 'ULTRASONIC'} MODE`, 10, 20);
      ctx.fillText(`FFT Size: ${analyserRef.current.fftSize}`, 10, 40);

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('echobaud-modulate', handleModulate as EventListener);
      window.removeEventListener('echobaud-spectrogram', handleSpectrogram as EventListener);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      // Clean up audio resources
      if (analyserRef.current) {
        analyserRef.current.disconnect();
        analyserRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  const playToneSequence = async (text: string, mode: 'audible' | 'ultrasonic') => {
    try {
      // Clean up previous audio context if exists
      if (audioContextRef.current) {
        if (analyserRef.current) {
          analyserRef.current.disconnect();
        }
        audioContextRef.current.close();
      }

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

      const audioContext = audioContextRef.current;
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Create analyser for visualization
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.3;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      analyserRef.current = analyser;
      analyser.connect(audioContext.destination);

      // Tone frequencies
      const tones = mode === 'audible'
        ? [1200, 1900, 2600, 3300]
        : [17500, 18167, 18833, 19500];

      const symbolDuration = 0.02; // 20ms
      const sampleRate = audioContext.sampleRate;

      // Convert text to 2-bit symbols (simplified)
      const symbols: number[] = [];
      for (const char of text) {
        const code = char.charCodeAt(0);
        symbols.push((code >> 6) & 3);
        symbols.push((code >> 4) & 3);
        symbols.push((code >> 2) & 3);
        symbols.push(code & 3);
      }

      // Chirp preamble
      const chirpStart = mode === 'audible' ? 1000 : 17000;
      const chirpEnd = mode === 'audible' ? 4000 : 20000;
      const chirpDuration = 0.1;

      const playChirp = (startFreq: number, endFreq: number, duration: number, when: number) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(analyser);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(startFreq, when);
        osc.frequency.exponentialRampToValueAtTime(endFreq, when + duration);

        gain.gain.setValueAtTime(0.3, when);
        gain.gain.exponentialRampToValueAtTime(0.01, when + duration);

        osc.start(when);
        osc.stop(when + duration);
      };

      const playTone = (freq: number, duration: number, when: number) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(analyser);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, when);

        // Raised cosine taper
        gain.gain.setValueAtTime(0, when);
        gain.gain.linearRampToValueAtTime(0.3, when + duration * 0.1);
        gain.gain.linearRampToValueAtTime(0.3, when + duration * 0.9);
        gain.gain.linearRampToValueAtTime(0, when + duration);

        osc.start(when);
        osc.stop(when + duration);
      };

      let when = audioContext.currentTime + 0.1;

      // Play chirp preamble
      playChirp(chirpStart, chirpEnd, chirpDuration, when);
      when += chirpDuration + 0.01;

      // Play symbols
      for (const symbol of symbols) {
        if (when > audioContext.currentTime + 30) break; // Limit to 30 seconds
        playTone(tones[symbol], symbolDuration, when);
        when += symbolDuration;
      }

      isPlayingRef.current = true;
    } catch (error) {
      console.error('Audio playback failed:', error);
    }
  };

  return <canvas ref={canvasRef} className="sandbox-canvas" id="echobaud-canvas" aria-label="EchoBaud FFT spectrogram" />;
}