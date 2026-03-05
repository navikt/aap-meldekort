import { logError, logInfo } from '@navikt/aap-felles-utils';
import { getToken } from 'lib/services/token';
import { ApiException, FetchResponse } from 'lib/utils/api';

const AUDIENCE = process.env.MELDEKORT_AUDIENCE;

export async function fetcher<ResponseBody>(
  url: string,
  method: 'GET' | 'POST' | 'DELETE',
  body?: Object
): Promise<FetchResponse<ResponseBody>> {
  if (!AUDIENCE) {
    throw new Error('AUDIENCE er ikke satt');
  }

  const oboToken = await getToken(AUDIENCE, url);

  try {
    const response = await fetch(url, {
      method: method,
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${oboToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    logInfo(`${method} for ${url}, status: ${response.status}`);

    if (!response.ok) {
      const apiException: ApiException = await response.json();

      return { type: 'ERROR', apiException, status: response.status };
    }

    const data: ResponseBody = await response.json();

    return { type: 'SUCCESS', data, status: response.status };
  } catch (error) {
    logError(`Klarte ikke å hente ${url}:` + JSON.stringify(error));
    throw new Error('Unable to fetch ' + JSON.stringify(error));
  }
}
