import { UtfyllingResponse } from 'lib/types/types';

export const meldekortMedArbeid: UtfyllingResponse = {
  metadata: {
    antallUbesvarteMeldeperioder: 1,
    kanSendesInn: true,
    referanse: '123456789',
    periode: { fom: '2024-11.04', tom: '2024-11-17' },
    visFrist: true,
  },
  tilstand: {
    aktivtSteg: 'KVITTERING',
    svar: {
      harDuJobbet: true,
      harDuHattAvtalteAktiviteter: false,
      dager: [
        {
          dato: '2024-11-06',
          timerArbeidet: 7.5,
        },
        {
          dato: '2024-11-07',
        },
        {
          dato: '2024-11-08',
        },
        {
          dato: '2024-11-09',
        },
        {
          dato: '2024-11-10',
        },
        {
          dato: '2024-11-11',
        },
        {
          dato: '2024-11-12',
        },
        {
          dato: '2024-11-13',
        },
        {
          dato: '2024-11-14',
        },
        {
          dato: '2024-11-15',
        },
        {
          dato: '2024-11-16',
        },
        {
          dato: '2024-11-17',
          timerArbeidet: 5,
        },
        {
          dato: '2024-11-18',
        },
        {
          dato: '2024-11-19',
        },
      ],
    },
  },
};

export const meldekortMedAvtalteAktiviterUtenFravær: UtfyllingResponse = {
  ...meldekortMedArbeid,
  tilstand: {
    ...meldekortMedArbeid.tilstand,
    svar: {
      ...meldekortMedArbeid.tilstand.svar,
      harDuHattAvtalteAktiviteter: true,
      harDuHattFravær: false,
    },
  },
};

export const meldekortMedFravær: UtfyllingResponse = {
  ...meldekortMedArbeid,
  tilstand: {
    ...meldekortMedArbeid.tilstand,
    svar: {
      ...meldekortMedArbeid.tilstand.svar,
      harDuHattAvtalteAktiviteter: true,
      harDuHattFravær: true,
      dager: [
        {
          dato: '2024-11-06',
          timerArbeidet: 7.5,
        },
        {
          dato: '2024-11-07',
          fravær: 'SYKDOM_ELLER_SKADE',
        },
        {
          dato: '2024-11-08',
          fravær: 'OMSORG_FØRSTE_SKOLEDAG_TILVENNING_ELLER_ANNEN_OPPFØLGING_BARN',
        },
        {
          dato: '2024-11-09',
          fravær: 'OMSORG_FØRSTE_SKOLEDAG_TILVENNING_ELLER_ANNEN_OPPFØLGING_BARN',
        },
        {
          dato: '2024-11-10',
        },
        {
          dato: '2024-11-11',
        },
        {
          dato: '2024-11-12',
        },
        {
          dato: '2024-11-13',
        },
        {
          dato: '2024-11-14',
        },
        {
          dato: '2024-11-15',
        },
        {
          dato: '2024-11-16',
        },
        {
          dato: '2024-11-17',
          timerArbeidet: 5,
        },
        {
          dato: '2024-11-18',
          fravær: 'SYKDOM_ELLER_SKADE',
        },
        {
          dato: '2024-11-19',
          fravær: 'SYKDOM_ELLER_SKADE',
        },
      ],
    },
  },
};

export const meldekortMedTreDagerAnnetFravær: UtfyllingResponse = {
  ...meldekortMedArbeid,
  tilstand: {
    ...meldekortMedArbeid.tilstand,
    svar: {
      ...meldekortMedArbeid.tilstand.svar,
      harDuHattAvtalteAktiviteter: true,
      harDuHattFravær: true,
      dager: [
        {
          dato: '2024-11-06',
          timerArbeidet: 7.5,
        },
        {
          dato: '2024-11-07',
          fravær: 'ANNEN',
        },
        {
          dato: '2024-11-08',
          fravær: 'ANNEN',
        },
        {
          dato: '2024-11-09',
          fravær: 'ANNEN',
        },
        {
          dato: '2024-11-10',
          fravær: 'SYKDOM_ELLER_SKADE',
        },
        {
          dato: '2024-11-11',
        },
        {
          dato: '2024-11-12',
        },
        {
          dato: '2024-11-13',
        },
        {
          dato: '2024-11-14',
        },
        {
          dato: '2024-11-15',
          fravær: 'OMSORG_DØDSFALL_I_FAMILIE_ELLER_VENNEKRETS',
        },
        {
          dato: '2024-11-16',
        },
        {
          dato: '2024-11-17',
          timerArbeidet: 5,
        },
        {
          dato: '2024-11-18',
        },
        {
          dato: '2024-11-19',
        },
      ],
    },
  },
};
