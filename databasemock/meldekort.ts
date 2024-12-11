import fs from 'fs/promises';

import { MeldekortRequest, MeldekortResponse, Meldeperiode, Steg } from 'lib/types/types';

/*
 * meldeperioder
 * meldekort
 */

export async function hentMeldeperioderMock(): Promise<Meldeperiode[]> {
  try {
    return JSON.parse(await fs.readFile('.meldeperioder.cache', 'utf8')) as unknown as Meldeperiode[];
  } catch (err) {
    const meldeperioder: Meldeperiode[] = [
      {
        meldekortId: 123456789,
        periode: { fom: '2024-11-04', tom: '2024-11-17' },
        status: 'KLAR_FOR_INNSENDING',
      },
      {
        meldekortId: 123456789,
        periode: { fom: '2024-11-18', tom: '2024-12-01' },
        status: 'KLAR_FOR_INNSENDING',
      },
    ];

    await fs.writeFile('.meldeperioder.cache', JSON.stringify(meldeperioder));
    return meldeperioder;
  }
}

export async function mockNesteSteg(meldekortRequest: MeldekortRequest) {
  const nesteSteg = hentNesteSteg(meldekortRequest.nåværendeSteg);

  const meldekort = await hentMeldekortMock();

  await fs.writeFile(
    '.meldekort.cache',
    JSON.stringify({ ...meldekort, steg: nesteSteg, meldekort: meldekortRequest.meldekort })
  );
}

export async function hentMeldekortMock(): Promise<MeldekortResponse> {
  try {
    return JSON.parse(await fs.readFile('.meldekort.cache', 'utf8')) as unknown as MeldekortResponse;
  } catch (err) {
    const meldekort: MeldekortResponse = {
      meldekort: {
        timerArbeidet: [],
      },
      steg: 'BEKREFT_SVARER_ÆRLIG',
      periode: { fom: '2024-11-04', tom: '2024-11-17' },
    };

    return (await fs.writeFile('.meldekort.cache', JSON.stringify(meldekort))) as unknown as MeldekortResponse;
  }
}

export const slettMeldekort = async () => {
  await fs.unlink('.meldekort.cache');
  return;
};

function hentNesteSteg(nåværendeSteg: Steg): Steg {
  switch (nåværendeSteg) {
    case 'BEKREFT_SVARER_ÆRLIG':
      return 'JOBBET_I_MELDEPERIODEN';
    case 'JOBBET_I_MELDEPERIODEN':
      return 'TIMER_ARBEIDET';
    case 'TIMER_ARBEIDET':
      return 'KVITTERING';
    case 'KVITTERING':
      throw new Error('Det finnes ikke et steg etter kvittering');
  }
}
