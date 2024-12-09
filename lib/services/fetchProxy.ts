import { getAccessTokenOrRedirectToLogin, logError, logInfo } from '@navikt/aap-felles-utils';
import { requestTokenxOboToken, validateToken } from '@navikt/oasis';
import { headers } from 'next/headers';

const AUDIENCE = process.env.MELDEKORT_AUDIENCE;

export async function fetcher<ResponseBody>(url: string, method: 'GET' | 'POST', body?: Object): Promise<ResponseBody> {
  if (!AUDIENCE) {
    throw new Error('AUDIENCE er ikke satt');
  }

  const oboToken = await getOnBehalfOfToken(AUDIENCE, url);

  try {
    const response = await fetch(url, {
      method: method,
      body: JSON.stringify(body),
      headers: { Authorization: `Bearer ${oboToken}` },
    });
    return await response.json();
  } catch (error) {
    logError(`Klarte ikke å hente ${url}:` + JSON.stringify(error));
    throw new Error('Unable to fetch ' + JSON.stringify(error));
  }
}

async function getOnBehalfOfToken(audience: string, url: string) {
  const token = getAccessTokenOrRedirectToLogin(await headers());
  if (!token) {
    logError(`Token for ${url} er undefined`);
    throw new Error('Token is undefined');
  }

  const validation = await validateToken(token);
  if (!validation.ok) {
    logError(`Token for ${url} validerte ikke`);
    throw new Error('Token didnt validate');
  }

  const oboToken = await requestTokenxOboToken(token, audience);
  if (!oboToken.ok) {
    logError(`Henting av oboToken for ${url} feilet`, oboToken.error);
    throw new Error('Request oboToken failed');
  }
  return token;
}
