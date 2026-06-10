import { useEffect, useRef, useState } from 'react';

interface SovietAudioProps {
  isPlayingAsUSSR: boolean;
  gameActive: boolean;
}

/**
 * SovietAudio component plays Soviet anthem background music when
 * the player is playing as the USSR and the game is active.
 * 
 * Audio source: https://www.youtube.com/watch?v=rIpSNCwQkbY
 * (Soviet National Anthem - instrumental)
 */
export function SovietAudio({ isPlayingAsUSSR, gameActive }: SovietAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const shouldPlay = isPlayingAsUSSR && gameActive;

    if (shouldPlay && !isPlaying) {
      audio.play().catch(() => {
        // Playback may fail due to browser autoplay policies
      });
      setIsPlaying(true);
    } else if (!shouldPlay && isPlaying) {
      audio.pause();
      setIsPlaying(false);
    }
  }, [isPlayingAsUSSR, gameActive, isPlaying]);

  return (
    <audio
      ref={audioRef}
      loop
      volume={0.3}
      style={{ display: 'none' }}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      crossOrigin="anonymous"
    >
      <source
        src="https://ia803402.us.archive.org/28/items/SovietNationalAnthemInstrumental/Soviet%20National%20Anthem%20-%20Instrumental.mp3"
        type="audio/mpeg"
      />
    </audio>
  );
}
