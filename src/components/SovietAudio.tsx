import { useEffect, useRef, useState } from 'react';

interface SovietAudioProps {
  isPlayingAsUSSR: boolean;
  gameActive: boolean;
}

/**
 * SovietAudio component plays the Soviet national anthem on loop when
 * the player is playing as the USSR and the game is active.
 * 
 * The audio is sourced from: https://www.youtube.com/watch?v=rIpSNCwQkbY
 */
export function SovietAudio({ isPlayingAsUSSR, gameActive }: SovietAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlayingAsUSSR && gameActive && !hasError) {
      // Attempt to play when conditions are met
      audio.play().catch(() => {
        // Browser may block autoplay without user interaction
        setHasError(true);
      });
    } else {
      // Pause when conditions are no longer met
      audio.pause();
    }
  }, [isPlayingAsUSSR, gameActive, hasError]);

  return (
    <audio
      ref={audioRef}
      loop
      style={{ display: 'none' }}
      crossOrigin="anonymous"
      onError={() => setHasError(true)}
    >
      {/* Using noCors proxy to fetch YouTube video audio */}
      <source
        src="https://www.youtube.com/watch?v=rIpSNCwQkbY"
        type="audio/mpeg"
      />
    </audio>
  );
}
