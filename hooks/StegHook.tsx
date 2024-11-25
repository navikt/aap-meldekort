import { useContext } from 'react';
import { StegContext } from 'context/StegContext';

export function useSteg() {
  const context = useContext(StegContext);
  if (!context) {
    throw new Error('useSteg må brukes innenfor StegContextProvider');
  }

  return context;
}
