import { getAccessTokenOrRedirectToLogin, logError } from '@navikt/aap-felles-utils';
import { requestOboToken, validateToken } from '@navikt/oasis';
import { headers } from 'next/headers';
import { isFunctionalTest, isLocal } from './meldekortservice';

export const getToken = async (audience: string, url: string): Promise<string> => {
  if (isLocal()) return await hentLocalToken();

  return await getOnBehalfOfToken(audience, url);
};

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

  const oboToken = await requestOboToken(token, audience);
  if (!oboToken.ok) {
    logError(`Henting av oboToken for ${url} feilet`, oboToken.error);
    throw new Error('Request oboToken failed');
  }
  return oboToken.token;
}

const hentLocalToken = async () => {
  if (isFunctionalTest()) {
    return 'functionalTest-token';
  }
  const url = 'http://localhost:8081/token';
  try {
    return fetch(url, { method: 'POST', next: { revalidate: 0 } })
      .then((res) => res.json())
      .then((data) => data?.access_token);
  } catch (err) {
    logError('hentLocalToken feilet', err);
    return Promise.resolve('dummy-token');
  }
};
