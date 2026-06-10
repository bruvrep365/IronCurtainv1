import { useEffect, useRef } from 'react';

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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const shouldPlay = isPlayingAsUSSR && gameActive;

    if (shouldPlay) {
      // Attempt to play
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Audio playback failed:', error);
        });
      }
    } else {
      // Pause when conditions not met
      audio.pause();
      audio.currentTime = 0;
    }
  }, [isPlayingAsUSSR, gameActive]);

  return (
    <audio
      ref={audioRef}
      loop
      style={{ display: 'none' }}
      crossOrigin="anonymous"
      preload="auto"
    >
      <source
        src="https://upload.wikimedia.org/wikipedia/commons/transcoded/4/4e/Soviet_Union_National_Anthem.ogg/Soviet_Union_National_Anthem.ogg.mp3"
        type="audio/mpeg"
      />
    </audio>
  );
}
