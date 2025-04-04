import {
  EndreUtfyllingRequest,
  StartUtfyllingRequest,
  StartUtfyllingResponse,
  UtfyllingResponse,
} from 'lib/types/types';

async function clientFetch<ResponseBody>(
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

const baseUrl = '/aap/meldekort';

export async function gåTilNesteStegClient(
  meldekortId: string,
  meldekortRequest: EndreUtfyllingRequest
): Promise<UtfyllingResponse | undefined> {
  return await clientFetch<UtfyllingResponse>(`${baseUrl}/api/${meldekortId}/neste-steg`, 'POST', meldekortRequest);
}

export async function mellomlagreMeldekortClient(
  meldekortId: string,
  meldekortRequest: EndreUtfyllingRequest
): Promise<UtfyllingResponse | undefined> {
  return await clientFetch<UtfyllingResponse>(`${baseUrl}/api/${meldekortId}/lagre`, 'POST', meldekortRequest);
}

export async function slettMeldekortUtfyllingClient(meldekortId: string): Promise<boolean> {
  const res = await fetch(`${baseUrl}/api/${meldekortId}/slett`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.ok;
}

export async function startInnsendingClient(
  startInnsendingRequest: StartUtfyllingRequest
): Promise<StartUtfyllingResponse | undefined> {
  return await clientFetch<StartUtfyllingResponse>(
    `${baseUrl}/api/meldeperiode/start-innsending`,
    'POST',
    startInnsendingRequest
  );
}

export async function startKorrigeringClient(
  startInnsendingRequest: StartUtfyllingRequest
): Promise<StartUtfyllingResponse | undefined> {
  return await clientFetch<StartUtfyllingResponse>(
    `${baseUrl}/api/meldeperiode/start-korrigering`,
    'POST',
    startInnsendingRequest
  );
}
