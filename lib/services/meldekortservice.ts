import { fetcher } from 'lib/services/fetchProxy';
import {
  EndreUtfyllingRequest,
  HistoriskMeldeperiode,
  KommendeMeldekort,
  Periode,
  StartUtfyllingRequest,
  StartUtfyllingResponse,
  UtfyllingResponse,
} from 'lib/types/types';

const meldeKortBaseUrl = process.env.MELDEKORT_API_BASE_URL;

export const isLocal = () => process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost';

/**
 * Flyt for innsending/korrigering
 */

export async function startInnsending(request: StartUtfyllingRequest): Promise<StartUtfyllingResponse> {
  const url = `${meldeKortBaseUrl}/api/start-innsending`;
  return await fetcher<StartUtfyllingResponse>(url, 'POST', request);
}

export async function startKorrigering(request: StartUtfyllingRequest): Promise<StartUtfyllingResponse> {
  const url = `${meldeKortBaseUrl}/api/start-korrigering`;
  return await fetcher<StartUtfyllingResponse>(url, 'POST', request);
}

export async function gåTilNesteSteg(referanse: string, request: EndreUtfyllingRequest): Promise<UtfyllingResponse> {
  const url = `${meldeKortBaseUrl}/api/utfylling/${referanse}/lagre-neste`;
  return fetcher(url, 'POST', request);
}

export async function mellomlagreUtfylling(
  referanse: string,
  request: EndreUtfyllingRequest
): Promise<UtfyllingResponse> {
  const url = `${meldeKortBaseUrl}/api/utfylling/${referanse}/lagre`;
  return fetcher(url, 'POST', request);
}

export async function hentUtfylling(referanse: string): Promise<UtfyllingResponse> {
  const url = `${meldeKortBaseUrl}/api/utfylling/${referanse}`;
  return fetcher<UtfyllingResponse>(url, 'GET');
}

export async function slettUtfylling(referanse: string) {
  const url = `${meldeKortBaseUrl}/api/utfylling/${referanse}`;
  return fetcher(url, 'DELETE');
}

/**
 * Forside
 */

export async function hentKommendeMeldeperiode(): Promise<KommendeMeldekort> {
  const url = `${meldeKortBaseUrl}/api/meldeperiode/kommende`;
  return await fetcher<KommendeMeldekort>(url, 'GET');
}

/**
 * Innsendte meldekort side
 */
export async function hentInnsendteMeldeperioder(): Promise<HistoriskMeldeperiode[]> {
  const url = `${meldeKortBaseUrl}/api/meldeperiode/historiske`;
  return await fetcher<HistoriskMeldeperiode[]>(url, 'GET');
}

export async function hentHistoriskMeldeperiodeDetaljer(periode: Periode): Promise<HistoriskMeldeperiode> {
  const url = `${meldeKortBaseUrl}/api/meldeperiode/detaljer`;
  return await fetcher<HistoriskMeldeperiode>(url, 'POST', periode);
}

/**
 * Redirect til gammel meldekortløsning eller kelvin-meldekort
 */
export async function hentAnsvarligSystem(): Promise<'AAP' | 'FELLES'> {
  const url = `${meldeKortBaseUrl}/api/ansvarlig-system`;
  return await fetcher<'AAP' | 'FELLES'>(url, 'GET');
}
