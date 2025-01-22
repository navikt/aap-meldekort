import { fetcher } from 'lib/services/fetchProxy';
import {
  HistoriskMeldekortDetaljerDto,
  HistoriskMeldekortDto,
  KommendeMeldekortDto,
  MeldekortRequest,
  MeldekortResponse,
} from 'lib/types/types';
import {
  hentHistoriskMeldekortDetaljerMock,
  hentHistoriskMeldekortMock,
  hentKommendeMeldekortMock,
  hentMeldekortMock,
  mockNesteSteg,
  slettMock,
} from 'databasemock/meldekort';

const meldeKortBaseUrl = process.env.MELDEKORT_API_BASE_URL;

export const isLocal = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost';

export async function hentKommendeMeldekort(): Promise<KommendeMeldekortDto> {
  if (isLocal()) {
    return hentKommendeMeldekortMock();
  }

  const url = `${meldeKortBaseUrl}/api/arena/meldekort/neste`;
  return await fetcher<KommendeMeldekortDto>(url, 'GET');
}

export async function hentInnsendteMeldekort(): Promise<HistoriskMeldekortDto[]> {
  if (isLocal()) {
    return hentHistoriskMeldekortMock();
  }

  const url = `${meldeKortBaseUrl}/api/arena/meldekort/historisk`;
  return await fetcher<HistoriskMeldekortDto[]>(url, 'GET');
}

export async function hentInnsendtMeldekortDetjalert(meldekortId: string): Promise<HistoriskMeldekortDetaljerDto> {
  if (isLocal()) {
    return hentHistoriskMeldekortDetaljerMock();
  }

  const url = `${meldeKortBaseUrl}/api/arena/meldekort/historisk/${meldekortId}`;
  return await fetcher<HistoriskMeldekortDetaljerDto>(url, 'GET');
}

export async function korrigerMeldekort() {
  // TODO Legg til logikk for korrigering av meldekort
}

/**
 * Disse endepunktene brukes for førstegangsregistrering av meldekort
 */

export async function hentMeldekort(referanse: string): Promise<MeldekortResponse> {
  if (isLocal()) {
    return hentMeldekortMock();
  }

  const url = `${meldeKortBaseUrl}/api/arena/skjema/meldekort/${referanse}`;
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

  const url = `${meldeKortBaseUrl}/api/arena/skjema/meldekort/${meldekortId}/neste-steg`;
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

  const url = `${meldeKortBaseUrl}/api/arena/skjema/meldekort/${meldekortId}/neste-steg`;
  return fetcher(url, 'POST', meldekortRequest);
}
