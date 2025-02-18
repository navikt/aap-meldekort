import { getAccessTokenOrRedirectToLogin, logError, logInfo } from '@navikt/aap-felles-utils';
import { requestOboToken, validateToken } from '@navikt/oasis';
import { headers } from 'next/headers';
import { isLocal } from './meldekortservice';

const AUDIENCE = process.env.MELDEKORT_AUDIENCE;

const hentLocalToken = async () => {
  // Må hente headers for å tvinge dynamic route ved lokal utvikling
  // TODO: Revurder i next 15
  await headers();

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


export async function fetcher<ResponseBody>(url: string, method: 'GET' | 'POST', body?: Object): Promise<ResponseBody> {
  if (!AUDIENCE) {
    throw new Error('AUDIENCE er ikke satt');
  }

  const oboToken = isLocal() ? await hentLocalToken() : await getOnBehalfOfToken(AUDIENCE, url);

  try {
    const response = await fetch(url, {
      method: method,
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${oboToken}`,
        'Content-Type': 'application/json',
      },
    });

    const responseJson = await response.json();
    logInfo(`respons for ${url} med statuskode ${response.status}} er ` + JSON.stringify(responseJson)); //TODO Fjern denne før vi går i prod
    return responseJson;
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

  const oboToken = await requestOboToken(token, audience);
  if (!oboToken.ok) {
    logError(`Henting av oboToken for ${url} feilet`, oboToken.error);
    throw new Error('Request oboToken failed');
  }
  return oboToken.token;
}
