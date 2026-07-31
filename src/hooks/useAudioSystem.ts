import { useRef, useEffect, useCallback, useState } from 'react';

interface AudioSystemState {
  audioContext: AudioContext | null;
  pumpNode: OscillatorNode | null;
  gainNode: GainNode | null;
  isPlaying: boolean;
  isUnlocked: boolean;
}

export function useAudioSystem() {
  const stateRef = useRef<AudioSystemState>({
    audioContext: null,
    pumpNode: null,
    gainNode: null,
    isPlaying: false,
    isUnlocked: false,
  });
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const volumeRef = useRef(0.3);

  const unlock = useCallback(() => {
    if (stateRef.current.isUnlocked) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      stateRef.current.audioContext = ctx;
      stateRef.current.isUnlocked = true;
      setIsUnlocked(true);

      // Resume if suspended
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
    } catch (e) {
      console.warn('Audio not available:', e);
    }
  }, []);

  const setPumpState = useCallback((on: boolean) => {
    const s = stateRef.current;
    if (!s.audioContext || !s.isUnlocked || !audioEnabled) return;

    if (on && !s.isPlaying) {
      // Create pump sound
      const ctx = s.audioContext;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volumeRef.current * 0.15, ctx.currentTime + 0.3);

      // Create a rich pump sound using multiple oscillators
      const createOsc = (freq: number, type: OscillatorType, vol: number) => {
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        const g = ctx.createGain();
        g.gain.setValueAtTime(vol, ctx.currentTime);
        osc.connect(g);
        g.connect(gain);
        osc.start();
        return { osc, g };
      };

      // Low rumble (motor vibration)
      const motor1 = createOsc(55, 'sine', 0.4);
      const motor2 = createOsc(110, 'triangle', 0.15);

      // Bubble sounds
      const bubble1 = createOsc(180, 'sine', 0.08);
      bubble1.osc.frequency.setValueAtTime(180, ctx.currentTime);
      bubble1.osc.frequency.linearRampToValueAtTime(160, ctx.currentTime + 0.5);
      bubble1.osc.frequency.linearRampToValueAtTime(190, ctx.currentTime + 1);

      // Air hiss (noise-like)
      const hiss = createOsc(800, 'sawtooth', 0.03);
      const hiss2 = createOsc(1200, 'sawtooth', 0.02);

      gain.connect(ctx.destination);

      s.pumpNode = motor1.osc;
      s.gainNode = gain;
      s.isPlaying = true;

      // Store oscillators for cleanup
      (s as any)._oscillators = [motor1, motor2, bubble1, hiss, hiss2];

    } else if (!on && s.isPlaying) {
      // Fade out
      if (s.gainNode && s.audioContext) {
        s.gainNode.gain.linearRampToValueAtTime(0, s.audioContext.currentTime + 0.5);
        setTimeout(() => {
          const oscs = (s as any)._oscillators as { osc: OscillatorNode; g: GainNode }[] | undefined;
          if (oscs) {
            oscs.forEach(o => {
              try { o.osc.stop(); } catch {}
              try { o.osc.disconnect(); } catch {}
            });
          }
          if (s.gainNode) try { s.gainNode.disconnect(); } catch {}
          s.pumpNode = null;
          s.gainNode = null;
          s.isPlaying = false;
          (s as any)._oscillators = null;
        }, 600);
      }
    }
  }, [audioEnabled]);

  const setVolume = useCallback((vol: number) => {
    volumeRef.current = vol;
    const s = stateRef.current;
    if (s.gainNode && s.isPlaying) {
      s.gainNode.gain.linearRampToValueAtTime(vol * 0.15, s.audioContext!.currentTime + 0.2);
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (!stateRef.current.isUnlocked) {
      unlock();
    }
    setAudioEnabled(prev => {
      const next = !prev;
      if (!next && stateRef.current.isPlaying) {
        setPumpState(false);
      }
      return next;
    });
  }, [unlock, setPumpState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const s = stateRef.current;
      const oscs = (s as any)._oscillators as { osc: OscillatorNode; g: GainNode }[] | undefined;
      if (oscs) {
        oscs.forEach(o => {
          try { o.osc.stop(); } catch {}
        });
      }
      if (s.audioContext) {
        s.audioContext.close().catch(() => {});
      }
    };
  }, []);

  return {
    isUnlocked,
    audioEnabled,
    unlock,
    setPumpState,
    setVolume,
    toggleAudio,
  };
}
