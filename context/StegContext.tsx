'use client';

import { createContext, Dispatch, ReactNode, useState } from 'react';

interface EtEllerannet {
  steg: Steg;
  setSteg: Dispatch<Steg>;
}

type Steg = 'INTRO' | 'UTFYLLING' | 'PERIODE' | 'OPPSUMMERING';

export const StegContext = createContext<EtEllerannet>(undefined as unknown as EtEllerannet);

interface Props {
  children: ReactNode;
}

export function StegContextProvider({ children }: Props) {
  const [steg, setSteg] = useState<Steg>('INTRO');

  const context: EtEllerannet = {
    steg,
    setSteg,
  };

  return <StegContext.Provider value={context}>{children}</StegContext.Provider>;
}
