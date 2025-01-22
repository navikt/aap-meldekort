import { components } from 'lib/types/schema';

export type MeldekortRequest = components['schemas']['no.nav.aap.meldekort.arena.MeldekortRequest'];
export type MeldekortResponse = components['schemas']['no.nav.aap.meldekort.arena.MeldekortResponse'];
// export type Meldekort = components['schemas']['no.nav.aap.meldekort.arena.MeldekortDto'];
export type Meldeperiode = components['schemas']['no.nav.aap.meldekort.arena.MeldeperiodeDto'];

export type Steg = MeldekortResponse['steg'];

export type Periode = components['schemas']['no.nav.aap.meldekort.arena.MeldeperiodeDto']['periode'];
export type Timer = components['schemas']['no.nav.aap.meldekort.arena.MeldekortResponse']['meldekort']['timerArbeidet'];

export interface KommendeMeldekortDto {
  antallUbesvarteMeldekort: number;
  nesteMeldekort: NesteMeldekortDto;
}

export interface NesteMeldekortDto {
  meldeperiode: Periode;
  meldekortId: string;
  tidligsteInnsendingsDato: string;
  kanSendesInn: Boolean;
}

export interface HistoriskMeldekortDto {
  meldeperiode: Periode;
  meldekortId: string;
  status: string;
}

export interface HistoriskMeldekortDetaljerDto {
  meldeperiode: Periode;
  meldekortId: string;
  status: string;
  bruttoBeløp?: number;
  innsendtDato: string;
  kanEndres: Boolean;
  timerArbeidet: { dato: string; timer?: number }[];
}
