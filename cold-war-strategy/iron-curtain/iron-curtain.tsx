import { Routes, Route } from 'react-router-dom';
import { GameApp } from './game-app.js';
import './index.css';

/**
 * IronCurtain is the root application component for the Iron Curtain
 * Cold War grand strategy simulation. It mounts the full game experience
 * at the root route.
 */
export function IronCurtain() {
  return (
    <Routes>
      <Route path="/" element={<GameApp />} />
    </Routes>
  );
}
