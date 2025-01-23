import { MeldekortKorrigeringRequest, MeldekortRequest, MeldekortResponse } from 'lib/types/types';

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
  meldekortId: string,
  meldekortRequest: MeldekortRequest
): Promise<MeldekortResponse | undefined> {
  return await fetchProxy<MeldekortResponse>(
    `/api/arena/meldekort/${meldekortId}/neste-steg`,
    'POST',
    meldekortRequest
  );
}

export async function lagreMeldekortClient(
  meldekortId: string,
  meldekortRequest: MeldekortRequest
): Promise<MeldekortResponse | undefined> {
  return await fetchProxy<MeldekortResponse>(`/api/arena/meldekort/${meldekortId}/lagre`, 'POST', meldekortRequest);
}

export async function slettMockClient() {
  await fetchProxy('/api/mock/slett', 'GET');
}

export async function korrigerMeldekortClient(
  meldekortId: number,
  meldekortKorrigeringRequest: MeldekortKorrigeringRequest
) {
  await fetchProxy(`/api/arena/meldekort/korrigering/${meldekortId}`, 'POST', meldekortKorrigeringRequest);
}
