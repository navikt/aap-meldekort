import { FetchMock } from 'vitest-fetch-mock';

/**
 * Mellomlagring går mot `${baseUrl}/api/${referanse}/lagre`. Vi filtrerer på selve
 * `/lagre`-segmentet slik at hjelperen kan brukes uavhengig av hvilken referanse
 * testen bruker.
 */
const LAGRE_SEGMENT = '/lagre';

function hentUrl(kall: Parameters<typeof fetch>): string {
  const input = kall[0];
  return input instanceof Request ? input.url : String(input);
}

function parseBody(kall: Parameters<typeof fetch> | undefined): unknown {
  const body = kall?.[1]?.body;
  if (typeof body !== 'string') {
    return undefined;
  }
  return JSON.parse(body);
}

/**
 * Lar tester se hvilke mellomlagringskall som faktisk ble gjort.
 *
 * Skillet mellom «ubesvart» og «Nei» er ikke synlig i payloaden – begge gir
 * `harDuJobbet: false`. Det eneste signalet er om kallet skjer i det hele tatt,
 * og derfor er `antall()` den viktigste assertion-en her.
 */
export function mellomlagringSpion(fetchMock: FetchMock) {
  const kall = () => fetchMock.mock.calls.filter((kall) => hentUrl(kall).includes(LAGRE_SEGMENT));

  return {
    antall: () => kall().length,
    body: (index = 0) => parseBody(kall()[index]),
    sisteBody: () => parseBody(kall().at(-1)),
  };
}
