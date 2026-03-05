import { fetcher } from 'lib/services/fetchProxy';
import {
  mockHentAnsvarligSystem,
  mockHentInnsendteMeldeperioder,
  mockHentKommendeMeldeperioder,
  mockHentUtfylling,
} from 'lib/services/mockData';
import {
  EndreUtfyllingRequest,
  HistoriskMeldeperiode,
  KommendeMeldekort,
  StartUtfyllingRequest,
  StartUtfyllingResponse,
  UtfyllingResponse,
} from 'lib/types/types';
import { FetchResponse } from 'lib/utils/api';

const meldeKortBaseUrl = process.env.MELDEKORT_API_BASE_URL;

export const isLocal = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost';
export const isFunctionalTest = () => process.env.FUNCTIONAL_TEST === 'enabled';

/**
 * Flyt for innsending/korrigering
 */

export async function startInnsending(request: StartUtfyllingRequest): Promise<FetchResponse<StartUtfyllingResponse>> {
  const url = `${meldeKortBaseUrl}/api/start-innsending`;
  return await fetcher<StartUtfyllingResponse>(url, 'POST', request);
}

export async function startKorrigering(request: StartUtfyllingRequest): Promise<FetchResponse<StartUtfyllingResponse>> {
  const url = `${meldeKortBaseUrl}/api/start-korrigering`;
  return await fetcher<StartUtfyllingResponse>(url, 'POST', request);
}

export async function gåTilNesteSteg(
  referanse: string,
  request: EndreUtfyllingRequest
): Promise<FetchResponse<UtfyllingResponse>> {
  const url = `${meldeKortBaseUrl}/api/utfylling/${referanse}/lagre-neste`;
  return fetcher<UtfyllingResponse>(url, 'POST', request);
}

export async function mellomlagreUtfylling(
  referanse: string,
  request: EndreUtfyllingRequest
): Promise<FetchResponse<UtfyllingResponse>> {
  const url = `${meldeKortBaseUrl}/api/utfylling/${referanse}/lagre`;
  return fetcher(url, 'POST', request);
}

export async function hentUtfylling(referanse: string): Promise<FetchResponse<UtfyllingResponse>> {
  if (isFunctionalTest()) {
    return { type: 'SUCCESS', data: mockHentUtfylling, status: 200 };
  }
  const url = `${meldeKortBaseUrl}/api/utfylling/${referanse}`;
  return fetcher<UtfyllingResponse>(url, 'GET');
}

export async function slettUtfylling(referanse: string): Promise<FetchResponse<undefined>> {
  const url = `${meldeKortBaseUrl}/api/utfylling/${referanse}`;
  return fetcher(url, 'DELETE');
}

/**
 * Forside
 */

export async function hentKommendeMeldeperiode(): Promise<FetchResponse<KommendeMeldekort>> {
  if (isFunctionalTest()) {
    return { type: 'SUCCESS', data: mockHentKommendeMeldeperioder, status: 200 };
  }
  const url = `${meldeKortBaseUrl}/api/meldeperiode/kommende`;
  return await fetcher<KommendeMeldekort>(url, 'GET');
}

/**
 * Innsendte meldekort side
 */
export async function hentInnsendteMeldeperioder(): Promise<FetchResponse<HistoriskMeldeperiode[]>> {
  if (isFunctionalTest()) {
    return { type: 'SUCCESS', data: mockHentInnsendteMeldeperioder, status: 200 };
  }
  const url = `${meldeKortBaseUrl}/api/meldeperiode/historiske`;
  return await fetcher<HistoriskMeldeperiode[]>(url, 'GET');
}

/**
 * Redirect til gammel meldekortløsning eller kelvin-meldekort
 */
export async function hentAnsvarligSystem(): Promise<FetchResponse<'AAP' | 'FELLES'>> {
  if (isFunctionalTest()) {
    return { type: 'SUCCESS', data: mockHentAnsvarligSystem, status: 200 };
  }
  const url = `${meldeKortBaseUrl}/api/ansvarlig-system`;
  return await fetcher<'AAP' | 'FELLES'>(url, 'GET');
}
