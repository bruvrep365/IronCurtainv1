import { MemoryRouter } from 'react-router-dom';
import { IronCurtain } from "./iron-curtain.js";
    
export const IronCurtainBasic = () => {
  return (
    <MemoryRouter>
      <IronCurtain />
    </MemoryRouter>
  );
}