import {
  EndreUtfyllingRequest,
  StartUtfyllingRequest,
  StartUtfyllingResponse,
  UtfyllingResponse,
} from 'lib/types/types';
import { FetchResponse } from 'lib/utils/api';

async function clientFetch<ResponseBody>(
  url: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  body?: object
): Promise<FetchResponse<ResponseBody>> {
  try {
    const res = await fetch(url, {
      method,
      body: body && JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await res.json();
  } catch {
    return {
      type: 'ERROR',
      status: 500,
      apiException: {
        message: 'En ukjent feil oppsto. Prøv igjen senere.',
      },
    };
  }
}

const baseUrl = '/aap/meldekort';

export async function gåTilNesteStegClient(
  meldekortId: string,
  meldekortRequest: EndreUtfyllingRequest
): Promise<FetchResponse<UtfyllingResponse>> {
  return await clientFetch<UtfyllingResponse>(`${baseUrl}/api/${meldekortId}/neste-steg`, 'POST', meldekortRequest);
}

export async function mellomlagreMeldekortClient(
  meldekortId: string,
  meldekortRequest: EndreUtfyllingRequest
): Promise<FetchResponse<UtfyllingResponse>> {
  return await clientFetch<UtfyllingResponse>(`${baseUrl}/api/${meldekortId}/lagre`, 'POST', meldekortRequest);
}

export async function slettMeldekortUtfyllingClient(meldekortId: string): Promise<FetchResponse<boolean>> {
  const res = await fetch(`${baseUrl}/api/${meldekortId}/slett`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await res.json();
}

export async function startInnsendingClient(
  startInnsendingRequest: StartUtfyllingRequest
): Promise<FetchResponse<StartUtfyllingResponse>> {
  return await clientFetch<StartUtfyllingResponse>(
    `${baseUrl}/api/meldeperiode/start-innsending`,
    'POST',
    startInnsendingRequest
  );
}

export async function startKorrigeringClient(
  startInnsendingRequest: StartUtfyllingRequest
): Promise<FetchResponse<StartUtfyllingResponse>> {
  return await clientFetch<StartUtfyllingResponse>(
    `${baseUrl}/api/meldeperiode/start-korrigering`,
    'POST',
    startInnsendingRequest
  );
}
