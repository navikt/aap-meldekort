import { HistoriskMeldeperiode, KommendeMeldekort, UtfyllingResponse } from 'lib/types/types';

export const mockHentUtfylling: UtfyllingResponse = {
  metadata: {
    antallUbesvarteMeldeperioder: 1,
    referanse: 'ref',
    kanSendesInn: true,
    periode: {
      fom: '2026-02-02',
      tom: '2026-02-15',
    },
  },
  tilstand: {
    aktivtSteg: 'INTRODUKSJON',
    svar: {
      dager: [],
    },
  },
};

export const mockHentKommendeMeldeperioder: KommendeMeldekort = {
  antallUbesvarteMeldeperioder: 1,
  nesteMeldeperiode: {
    meldeperiode: {
      fom: '2026-02-02',
      tom: '2026-02-15',
    },
    innsendingsvindu: {
      fom: '2026-02-16',
      tom: '2026-02-23',
    },
  },
};

export const mockHentInnsendteMeldeperioder: HistoriskMeldeperiode[] = [];
export const mockHentAnsvarligSystem = 'AAP';
