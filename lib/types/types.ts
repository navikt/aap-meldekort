import { components } from 'lib/types/schema';

export type MeldekortRequest = components['schemas']['no.nav.aap.meldekort.arena.MeldekortRequest'];
export type MeldekortResponse = components['schemas']['no.nav.aap.meldekort.arena.MeldekortResponse'];
// export type Meldekort = components['schemas']['no.nav.aap.meldekort.arena.MeldekortDto'];
export type Meldeperiode = components['schemas']['no.nav.aap.meldekort.arena.MeldeperiodeDto'];

export type Steg = MeldekortResponse['steg'];
