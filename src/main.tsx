import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { IronCurtain } from './iron-curtain';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <IronCurtain />
  </BrowserRouter>
);
