import { components } from 'lib/types/schema';

export type MeldekortRequest = components['schemas']['no.nav.aap.meldekort.MeldekortRequest'];
export type MeldekortResponse = components['schemas']['no.nav.aap.meldekort.MeldekortResponse'];

export type Steg = MeldekortResponse['steg'];
export type KommendeMeldekort = components['schemas']['no.nav.aap.meldekort.KommendeMeldekortDto'];


export type NesteMeldekort = components['schemas']['no.nav.aap.meldekort.NesteMeldekortDto'];

export type MeldekortKorrigeringRequest = components['schemas']['no.nav.aap.meldekort.MeldekortKorrigeringRequest'];

export type HistoriskMeldekort = components['schemas']['no.nav.aap.meldekort.HistoriskMeldekortDto'];

export type HistoriskMeldekortDetaljer = components['schemas']['no.nav.aap.meldekort.HistoriskMeldekortDetaljerDto'];

export type Periode = components['schemas']['no.nav.aap.meldekort.PeriodeDto'];

export type DagerInfo = components['schemas']['no.nav.aap.meldekort.DagerInfoDto'];

export type Status = components['schemas']['no.nav.aap.meldekort.HistoriskMeldekortDto']['status'];

export type HistoriskMeldekortType =
  components['schemas']['no.nav.aap.meldekort.HistoriskMeldekortDetaljerDto']['type'];
