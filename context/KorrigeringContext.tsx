'use client';

import { createContext, Dispatch, ReactNode, useState } from 'react';
import { HistoriskMeldekortDetaljer } from 'lib/types/types';

type Steg = 'FYLL_TIMER' | 'SE_OVER_TIMER' | 'KVITTERING';

export interface KorrigeringContextType {
  korrigering: Korrigering;
  setKorrigering: Dispatch<Korrigering>;
}

export const KorrigeringContext = createContext<KorrigeringContextType | null>(null);

interface Korrigering {
  steg: Steg;
  endrerMeldekort: boolean;
  meldekort: HistoriskMeldekortDetaljer;
}

interface Props {
  children: ReactNode;
  meldekort: HistoriskMeldekortDetaljer;
}

export function KorrigeringContextProvider(props: Props) {
  const { children } = props;
  const [korrigering, setKorrigering] = useState<Korrigering>({
    steg: 'FYLL_TIMER',
    meldekort: props.meldekort,
    endrerMeldekort: false,
  });

  const context: KorrigeringContextType = {
    korrigering,
    setKorrigering,
  };

  return <KorrigeringContext.Provider value={context}>{children}</KorrigeringContext.Provider>;
}
