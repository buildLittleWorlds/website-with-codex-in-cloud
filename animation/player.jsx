import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Player} from '@remotion/player';
import {Tentacle} from './Tentacle';

const mount = document.getElementById('tentacle-animation');

const TentaclePlayer = () => {
  const player = useRef(null);
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [height, setHeight] = useState(() => Math.round(260 * mount.clientHeight / mount.clientWidth));

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const {width, height: viewportHeight} = entry.contentRect;
      if (width > 0 && viewportHeight > 0) setHeight(Math.round(260 * viewportHeight / width));
    });
    observer.observe(mount);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPaused(preference.matches);
    preference.addEventListener('change', onChange);
    return () => preference.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (paused || document.hidden) player.current?.pause();
    else player.current?.play();
    const onVisibilityChange = () => {
      if (document.hidden || paused) player.current?.pause();
      else player.current?.play();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [paused]);

  return (
    <>
      <div className="tentacle-art" aria-hidden="true" inert>
        <Player
          ref={player}
          component={Tentacle}
          durationInFrames={240}
          fps={30}
          compositionWidth={260}
          compositionHeight={height}
          autoPlay={!paused}
          initiallyMuted
          loop
          controls={false}
          clickToPlay={false}
          doubleClickToFullscreen={false}
          spaceKeyToPlayOrPause={false}
          style={{width: '100%', height: '100%'}}
        />
      </div>
      <button
        className="tentacle-toggle"
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-label={paused ? 'Play tentacle animation' : 'Pause tentacle animation'}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          {paused ? <path d="M8 5L19 12L8 19Z" fill="currentColor" /> : <path d="M8 5V19M16 5V19" fill="none" stroke="currentColor" strokeWidth="3" />}
        </svg>
        <span>{paused ? 'Play' : 'Pause'}</span>
      </button>
    </>
  );
};

if (mount) createRoot(mount).render(<TentaclePlayer />);
