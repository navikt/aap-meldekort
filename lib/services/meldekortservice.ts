import { fetcher } from 'lib/services/fetchProxy';
import { MeldekortRequest, MeldekortResponse, Meldeperiode } from 'lib/types/types';
import { hentMeldekortMock, hentMeldeperioderMock, mockNesteSteg, slettMock } from 'databasemock/meldekort';

const meldeKortBaseUrl = process.env.MELDEKORT_API_BASE_URL;

export const isLocal = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost';

export async function hentMeldeperiode(): Promise<Meldeperiode[]> {
  if (isLocal()) {
    return hentMeldeperioderMock();
  }

  const url = `${meldeKortBaseUrl}/api/arena/meldeperiode`;
  return await fetcher<Meldeperiode[]>(url, 'GET');
}

export async function hentMeldekort(referanse: string): Promise<MeldekortResponse> {
  if (isLocal()) {
    return hentMeldekortMock();
  }

  const url = `${meldeKortBaseUrl}/api/arena/meldekort/${referanse}`;
  return await fetcher<MeldekortResponse>(url, 'GET');
}

export async function gåTilNesteSteg(
  meldekortId: string,
  meldekortRequest: MeldekortRequest
): Promise<MeldekortResponse> {
  if (isLocal()) {
    await mockNesteSteg(meldekortRequest);
    return await hentMeldekortMock();
  }

  const url = `${meldeKortBaseUrl}/api/arena/meldekort/${meldekortId}/neste-steg`;
  return fetcher(url, 'POST', meldekortRequest);
}

export async function lagreMeldekort(
  meldekortId: string,
  meldekortRequest: MeldekortRequest
): Promise<MeldekortResponse | undefined> {
  if (isLocal()) {
    await slettMock();
    return undefined;
  }

  const url = `${meldeKortBaseUrl}/api/arena/meldekort/${meldekortId}/neste-steg`;
  return fetcher(url, 'POST', meldekortRequest);
}
