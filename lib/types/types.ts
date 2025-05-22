import { components } from 'lib/types/schema';

export type KommendeMeldekort = components['schemas']['no.nav.aap.meldekort.KommendeMeldeperioderDto'];

export type HistoriskMeldeperiode = components['schemas']['no.nav.aap.meldekort.HistoriskMeldeperiodeDto'];
export type HistoriskMeldeperiodeDetaljer = components['schemas']['no.nav.aap.meldekort.PeriodeDetaljerDto'];

export type Periode = components['schemas']['no.nav.aap.meldekort.PeriodeDto'];

export type DagSvar = components['schemas']['no.nav.aap.meldekort.DagSvarDto'];

export type Status = components['schemas']['no.nav.aap.meldekort.HistoriskMeldeperiodeDto']['status'];

export type StartUtfyllingRequest = components['schemas']['no.nav.aap.meldekort.StartUtfyllingRequest'];
export type StartUtfyllingResponse = components['schemas']['no.nav.aap.meldekort.StartUtfyllingResponse'];

export type EndreUtfyllingRequest = components['schemas']['no.nav.aap.meldekort.EndreUtfyllingRequest'];

export type UtfyllingResponse = components['schemas']['no.nav.aap.meldekort.UtfyllingResponseDto'];

export type UtfyllingTilstandDto = components['schemas']['no.nav.aap.meldekort.UtfyllingTilstandDto'];

export type Steg = UtfyllingResponse['tilstand']['aktivtSteg'];

export type MetadataResponse = components['schemas']['no.nav.aap.meldekort.MetadataDto'];
