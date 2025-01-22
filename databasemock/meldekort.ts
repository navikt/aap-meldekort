import fs from 'fs/promises';

import {
  HistoriskMeldekortDetaljerDto,
  HistoriskMeldekortDto,
  KommendeMeldekortDto,
  MeldekortRequest,
  MeldekortResponse,
  Steg,
} from 'lib/types/types';

/*
 * meldeperioder
 * meldekort
 */

export async function hentKommendeMeldekortMock(): Promise<KommendeMeldekortDto> {
  try {
    return JSON.parse(await fs.readFile('.kommendeMeldekort.cache', 'utf8')) as unknown as KommendeMeldekortDto;
  } catch (err) {
    const kommendeMeldekort: KommendeMeldekortDto = {
      nesteMeldekort: {
        meldeperiode: { fom: '2024-11-04', tom: '2024-11-17' },
        meldekortId: '123456',
        tidligsteInnsendingsDato: '2024-11-05',
        kanSendesInn: true,
      },
      antallUbesvarteMeldekort: 1,
    };

    await fs.writeFile('.kommendeMeldekort.cache', JSON.stringify(kommendeMeldekort));
    return kommendeMeldekort;
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
        timerArbeidet: [
          { dato: '2024-11-04' },
          { dato: '2024-11-05' },
          { dato: '2024-11-06' },
          { dato: '2024-11-07' },
          { dato: '2024-11-08' },
          { dato: '2024-11-09' },
          { dato: '2024-11-10' },
          { dato: '2024-11-11' },
          { dato: '2024-11-12' },
          { dato: '2024-11-13' },
          { dato: '2024-11-14' },
          { dato: '2024-11-15' },
          { dato: '2024-11-16' },
          { dato: '2024-11-17' },
        ],
      },
      steg: 'BEKREFT_SVARER_ÆRLIG',
      periode: { fom: '2024-11-04', tom: '2024-11-17' },
    };

    return (await fs.writeFile('.meldekort.cache', JSON.stringify(meldekort))) as unknown as MeldekortResponse;
  }
}

export async function hentHistoriskMeldekortMock(): Promise<HistoriskMeldekortDto[]> {
  try {
    return JSON.parse(await fs.readFile('.historiskMeldekort.cache', 'utf8')) as unknown as HistoriskMeldekortDto[];
  } catch (err) {
    const meldekort: HistoriskMeldekortDto[] = [
      { meldekortId: '123456789', meldeperiode: { fom: '2024-11-04', tom: '2024-11-17' }, status: 'INNSENDT' },
    ];

    return (await fs.writeFile(
      '.historiskMeldekort.cache',
      JSON.stringify(meldekort)
    )) as unknown as HistoriskMeldekortDto[];
  }
}

export async function hentHistoriskMeldekortDetaljerMock(): Promise<HistoriskMeldekortDetaljerDto> {
  try {
    return JSON.parse(
      await fs.readFile('.historiskMeldekortDetaljer.cache', 'utf8')
    ) as unknown as HistoriskMeldekortDetaljerDto;
  } catch (err) {
    const meldekort: HistoriskMeldekortDetaljerDto = {
      meldekortId: '123456789',
      meldeperiode: { fom: '2024-11-04', tom: '2024-11-17' },
      status: 'INNSENDT',
      innsendtDato: new Date().toString(),
      kanEndres: false,
      bruttoBeløp: 8745,
      timerArbeidet: [
        { dato: '2024-11-04' },
        { dato: '2024-11-05' },
        { dato: '2024-11-06' },
        { dato: '2024-11-07' },
        { dato: '2024-11-08' },
        { dato: '2024-11-09' },
        { dato: '2024-11-10' },
        { dato: '2024-11-11' },
        { dato: '2024-11-12' },
        { dato: '2024-11-13' },
        { dato: '2024-11-14' },
        { dato: '2024-11-15' },
        { dato: '2024-11-16' },
        { dato: '2024-11-17' },
      ],
    };
    return (await fs.writeFile(
      '.historiskMeldekortDetaljer.cache',
      JSON.stringify(meldekort)
    )) as unknown as HistoriskMeldekortDetaljerDto;
  }
}

export async function slettMock() {
  await fs.unlink('.kommendeMeldekort.cache');
  await fs.unlink('.meldekort.cache');
}

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
