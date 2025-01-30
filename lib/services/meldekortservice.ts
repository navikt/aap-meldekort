import { fetcher } from 'lib/services/fetchProxy';
import {
  HistoriskMeldekort,
  HistoriskMeldekortDetaljer,
  KommendeMeldekort,
  MeldekortKorrigeringRequest,
  MeldekortRequest,
  MeldekortResponse,
  Periode,
} from 'lib/types/types';
import {
  hentHistoriskMeldekortDetaljerMock,
  hentHistoriskMeldekortMock,
  hentKommendeMeldekortMock,
  hentMeldekortMock,
  mockNesteSteg,
} from 'databasemock/databasemock';

const meldeKortBaseUrl = process.env.MELDEKORT_API_BASE_URL;

export const isLocal = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost';

export async function hentKommendeMeldekort(): Promise<KommendeMeldekort> {
  if (isLocal()) {
    return hentKommendeMeldekortMock();
  }

  const url = `${meldeKortBaseUrl}/api/arena/meldekort/neste`;
  return await fetcher<KommendeMeldekort>(url, 'GET');
}

export async function hentInnsendteMeldekort(): Promise<HistoriskMeldekort[]> {
  if (isLocal()) {
    return hentHistoriskMeldekortMock();
  }

  const url = `${meldeKortBaseUrl}/api/arena/meldekort/historisk`;
  return await fetcher<HistoriskMeldekort[]>(url, 'GET');
}

export async function hentHistoriskMeldekortDetaljer(periode: Periode): Promise<HistoriskMeldekortDetaljer[]> {
  if (isLocal()) {
    return hentHistoriskMeldekortDetaljerMock();
  }

  const url = `${meldeKortBaseUrl}/api/arena/meldekort/historisk/meldeperiode`;
  return await fetcher<HistoriskMeldekortDetaljer[]>(url, 'POST', periode);
}

export async function korrigerMeldekort(
  meldekortId: string,
  meldekortKorrigeringRequest: MeldekortKorrigeringRequest
): Promise<boolean> {
  if (isLocal()) {
    return true;
  }

  const url = `${meldeKortBaseUrl}/api/arena/meldekort/${meldekortId}`;
  return fetcher(url, 'POST', meldekortKorrigeringRequest);
}

/**
 * Disse endepunktene brukes for førstegangsregistrering av meldekort
 */

export async function hentMeldekort(referanse: string): Promise<MeldekortResponse> {
  if (isLocal()) {
    return hentMeldekortMock();
  }

  const url = `${meldeKortBaseUrl}/api/arena/skjema/${referanse}`;
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

  const url = `${meldeKortBaseUrl}/api/arena/skjema/${meldekortId}/neste-steg`;
  return fetcher(url, 'POST', meldekortRequest);
}
