import { useState, useEffect } from 'react';

interface AudioSettings {
  autoPlay: boolean;
  volume: number;
  playbackRate: number;
  continuousPlay: boolean;
}

export function useAudioSettings() {
  const [settings, setSettings] = useState<AudioSettings>({
    autoPlay: false,
    volume: 1,
    playbackRate: 1,
    continuousPlay: true
  });

  useEffect(() => {
    // Carregar configurações do localStorage
    const saved = localStorage.getItem('minicurso-audio-settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading audio settings:', e);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<AudioSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('minicurso-audio-settings', JSON.stringify(updated));
  };

  return { settings, updateSettings };
}