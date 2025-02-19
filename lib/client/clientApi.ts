import {
  EndreUtfyllingRequest,
  UtfyllingResponse,
  StartUtfyllingRequest,
  StartUtfyllingResponse,
} from 'lib/types/types';

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
  meldekortRequest: EndreUtfyllingRequest
): Promise<UtfyllingResponse | undefined> {
  return await fetchProxy<UtfyllingResponse>(
    `/api/arena/meldekort/${meldekortId}/neste-steg`,
    'POST',
    meldekortRequest
  );
}

export async function startInnsendingClient(
  startInnsendingRequest: StartUtfyllingRequest
): Promise<StartUtfyllingResponse | undefined> {
  return await fetchProxy<StartUtfyllingResponse>(`/api/meldeperiode/start-innsending`, 'POST', startInnsendingRequest);
}

export async function lagreMeldekortClient(
  meldekortId: string,
  meldekortRequest: EndreUtfyllingRequest
): Promise<UtfyllingResponse | undefined> {
  return await fetchProxy<UtfyllingResponse>(
    `/api/arena/meldekort/${meldekortId}/lagre`,
    'POST',
    meldekortRequest
  );
}

export async function slettMockClient() {
  await fetchProxy('/api/mock/slett', 'GET');
}
