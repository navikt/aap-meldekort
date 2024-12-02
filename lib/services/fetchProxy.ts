import { getAccessTokenOrRedirectToLogin } from '@navikt/aap-felles-utils';
import { requestTokenxOboToken, validateToken } from '@navikt/oasis';
import { headers } from 'next/headers';

const AUDIENCE = process.env.MELDEKORT_AUDIENCE;

export async function fetcher<ResponseBody>(url: string, method: 'GET' | 'POST', body?: Object): Promise<ResponseBody> {
  if (!AUDIENCE) {
    throw new Error('AUDIENCE er ikke satt');
  }

  const oboToken = await getOnBehalfOfToken(AUDIENCE);
  try {
    const response = await fetch(url, {
      method: method,
      body: JSON.stringify(body),
      headers: { Authorization: `Bearer ${oboToken}` },
    });
    return await response.json();
  } catch (error) {
    throw new Error('Unable to fetch ' + JSON.stringify(error));
  }
}

async function getOnBehalfOfToken(audience: string) {
  const token = getAccessTokenOrRedirectToLogin(await headers());
  if (!token) {
    throw new Error('Token is undefined');
  }

  const validation = await validateToken(token);
  if (!validation.ok) {
    throw new Error('Token didnt validate');
  }

  const oboToken = await requestTokenxOboToken(token, audience);
  if (!oboToken.ok) {
    throw new Error('Request oboToken failed');
  }
  return oboToken.token;
}
