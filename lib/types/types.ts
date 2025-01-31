import { components } from 'lib/types/schema';

export type MeldekortRequest = components['schemas']['no.nav.aap.meldekort.arena.MeldekortRequest'];
export type MeldekortResponse = components['schemas']['no.nav.aap.meldekort.arena.MeldekortResponse'];

export type Steg = MeldekortResponse['steg'];
export type KommendeMeldekort = components['schemas']['no.nav.aap.meldekort.arena.KommendeMeldekortDto'];

export type NesteMeldekort = components['schemas']['no.nav.aap.meldekort.arena.NesteMeldekortDto'];

export type MeldekortKorrigeringRequest =
  components['schemas']['no.nav.aap.meldekort.arena.MeldekortKorrigeringRequest'];

export type HistoriskMeldekort = components['schemas']['no.nav.aap.meldekort.arena.HistoriskMeldekortDto'];

export type HistoriskMeldekortDetaljer =
  components['schemas']['no.nav.aap.meldekort.arena.HistoriskMeldekortDetaljerDto'];

export type Periode = components['schemas']['no.nav.aap.meldekort.arena.PeriodeDto'];
export type TimerArbeidet = components['schemas']['no.nav.aap.meldekort.arena.TimerArbeidetDto'];

export type Status = components['schemas']['no.nav.aap.meldekort.arena.HistoriskMeldekortDto']['status'];

export type HistoriskMeldekortType =
  components['schemas']['no.nav.aap.meldekort.arena.HistoriskMeldekortDetaljerDto']['type'];
