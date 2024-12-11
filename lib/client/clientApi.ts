import { MeldekortRequest, MeldekortResponse } from 'lib/types/types';

async function fetchProxy<ResponseBody>(
  url: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  body?: object
): Promise<ResponseBody | undefined> {
  try {
    const res = await fetch(url, {
      method,
      body: body && JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      return await res.json();
    } else {
      return undefined;
    }
  } catch (e) {
    throw new Error('Noe gikk galt.' + JSON.stringify(e));
  }
}

export async function gåTilNesteStegClient(
  referanse: string,
  meldekortRequest: MeldekortRequest
): Promise<MeldekortResponse | undefined> {
  return await fetchProxy<MeldekortResponse>(`/api/arena/meldekort/${referanse}/neste-steg`, 'POST', meldekortRequest);
}

export async function lagreMeldekort(
  referanse: string,
  meldekortRequest: MeldekortRequest
): Promise<MeldekortResponse | undefined> {
  return await fetchProxy<MeldekortResponse>(`/api/arena/meldekort/${referanse}/lagre`, 'POST', meldekortRequest);
}
