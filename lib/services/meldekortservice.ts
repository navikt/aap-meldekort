import { fetcher } from 'lib/services/fetchProxy';
import { MeldekortRequest, MeldekortResponse, Meldeperiode } from 'lib/types/types';

const meldeKortBaseUrl = process.env.MELDEKORT_API_BASE_URL;

const isLocal = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost';

/**
 * Disse er fra backend
 */
export async function hentMeldeperiode(): Promise<Meldeperiode> {
  const url = `${meldeKortBaseUrl}/api/arena/meldeperiode`;
  return await fetcher<Meldeperiode>(url, 'GET');
}

export async function hentMeldekort(referanse: string): Promise<MeldekortResponse> {
  const meldekort: MeldekortResponse = {
    meldekort: { timerArbeidet: [], harDuJobbet: undefined, stemmerOpplysningene: undefined, svarerDuSant: undefined },
    steg: 'BEKREFT_SVARER_ÆRLIG',
    periode: {
      fom: '',
      tom: '',
    },
  };

  if (isLocal()) {
    return meldekort;
  }

  const url = `${meldeKortBaseUrl}/api/arena/meldekort/${referanse}`;
  return await fetcher<MeldekortResponse>(url, 'GET');
}

export function gåTilNesteSteg(meldekortId: string, meldekortRequest: MeldekortRequest): Promise<MeldekortResponse> {
  const url = `${meldeKortBaseUrl}/api/arena/meldekort/${meldekortId}/neste-steg`;
  return fetcher(url, 'POST', meldekortRequest);
}

export function lagreMeldekort(meldekortId: string, meldekortRequest: MeldekortRequest): Promise<MeldekortResponse> {
  const url = `${meldeKortBaseUrl}/api/arena/meldekort/${meldekortId}/neste-steg`;
  return fetcher(url, 'POST', meldekortRequest);
}
