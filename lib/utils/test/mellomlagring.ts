import type { FetchMock } from 'vitest-fetch-mock';

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

export function mellomlagringSpion(fetchMock: FetchMock) {
  const kall = () => fetchMock.mock.calls.filter((kall) => hentUrl(kall).includes(LAGRE_SEGMENT));

  return {
    antall: () => kall().length,
    body: (index = 0) => parseBody(kall()[index]),
    sisteBody: () => parseBody(kall().at(-1)),
  };
}
