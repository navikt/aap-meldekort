import { useContext } from 'react';
import { StegContext } from 'context/StegContext';

export function useSteg() {
  return useContext(StegContext);
}
