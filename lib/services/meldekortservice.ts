import { InnsendingMeldeperiode, Meldeperiode } from 'lib/types';

const meldeKortBaseUrl = process.env.BEHANDLING_API_BASE_URL;

async function fetcher<ResponseBody>(url: string, method: 'GET' | 'POST', body?: Object): Promise<ResponseBody> {
  const response = await fetch(url, { method: method, body: JSON.stringify(body) });
  return await response.json();
}

export async function hentMeldeperioder(): Promise<Meldeperiode[]> {
  const url = `${meldeKortBaseUrl}/api/meldeperioder`;
  return fetcher<Meldeperiode[]>(url, 'GET');
}

export async function hentMeldeperiode(): Promise<Meldeperiode> {
  const url = `${meldeKortBaseUrl}/api/meldeperiode`;
  return fetcher<Meldeperiode>(url, 'GET');
}

export async function sendInnMeldekort(meldeperiode: InnsendingMeldeperiode) {
  const url = `${meldeKortBaseUrl}/api/meldeperioder`;
  return fetcher(url, 'POST', meldeperiode);
}
