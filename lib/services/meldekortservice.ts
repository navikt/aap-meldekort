import { fetcher } from 'lib/services/fetchProxy';
import { InnsendingMeldeperiode, Meldeperiode } from 'lib/types';

const meldeKortBaseUrl = process.env.BEHANDLING_API_BASE_URL;

const isLocal = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost';
const isDev = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev';

export async function hentMeldeperioder(): Promise<Meldeperiode[]> {
  if (isLocal() || isDev()) {
    return [
      {
        referanse: 'hetf3-gekdt5-joeh6-jdjfk7',
        periode: { fom: '2024-11-11', tom: '2024-11-24' },
      },
    ];
  }
  const url = `${meldeKortBaseUrl}/api/meldeperioder`;
  return fetcher<Meldeperiode[]>(url, 'GET');
}

export async function hentMeldeperiode(): Promise<Meldeperiode> {
  if (isLocal() || isDev()) {
    return {
      referanse: 'hetf3-gekdt5-joeh6-jdjfk7',
      periode: { fom: '2024-11-11', tom: '2024-11-24' },
    };
  }
  const url = `${meldeKortBaseUrl}/api/meldeperiode`;
  return fetcher<Meldeperiode>(url, 'GET');
}

export async function sendInnMeldekort(meldeperiode: InnsendingMeldeperiode) {
  const url = `${meldeKortBaseUrl}/api/meldeperioder`;
  return fetcher(url, 'POST', meldeperiode);
}

/**
 * Disse er fra backend
 */

// export function hentMeldekort(): Promise<MeldekortResponse> {
//   const url = `${meldeKortBaseUrl}/api/arena/meldekort`;
//   return fetcher(url, 'GET');
// }
//
// export function gåTilNesteSteg(request: MeldekortRequest): Promise<MeldekortResponse> {
//   const url = `${meldeKortBaseUrl}/api/arena/meldekort/neste-steg`;
//   return fetcher(url, 'POST', request);
// }
//
// export function lagreMeldekort(request: MeldekortRequest): Promise<MeldekortResponse> {
//   const url = `${meldeKortBaseUrl}/api/arena/meldekort/neste-steg`;
//   return fetcher(url, 'POST', request);
// }
