'use client';

import { KorrigeringContextProvider } from 'context/KorrigeringContext';
import { HistoriskMeldekortDetaljer } from 'lib/types/types';
import { KorrigeringSteg } from 'components/flyt/korrigering/KorrigeringSteg';

interface Props {
  meldekort: HistoriskMeldekortDetaljer[];
}

export const Korrigering = ({ meldekort }: Props) => {
  return (
    <KorrigeringContextProvider meldekort={meldekort[0]}>
      <KorrigeringSteg />
    </KorrigeringContextProvider>
  );
};
