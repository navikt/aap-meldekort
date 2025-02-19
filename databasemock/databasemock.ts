import fs from 'fs/promises';

import {
  EndreUtfyllingRequest,
  UtfyllingResponse,
  HistoriskMeldeperiode,
  HistoriskMeldeperiodeDetaljer,
  KommendeMeldekort,
  Steg,
} from 'lib/types/types';

/*
 * meldeperioder
 * meldekort
 */

export async function hentKommendeMeldekortMock(): Promise<KommendeMeldekort> {
  try {
    return JSON.parse(await fs.readFile('.kommendeMeldekort.cache', 'utf8')) as unknown as KommendeMeldekort;
  } catch (err) {
    const kommendeMeldekort: KommendeMeldekort = {
      antallUbesvarteMeldeperioder: 1,
      nesteMeldeperiode: {
        meldeperiode: { fom: '2024-11-04', tom: '2024-11-17' },
        innsendingsvindu: { fom: '2024-11-04', tom: '2024-11-04' },
      },
    };

    await fs.writeFile('.kommendeMeldekort.cache', JSON.stringify(kommendeMeldekort));
    return kommendeMeldekort;
  }
}

export async function mockNesteSteg(meldekortRequest: EndreUtfyllingRequest) {
  await fs.writeFile('.meldekort.cache', JSON.stringify({ meldekortRequest }));
}

export async function hentMeldekortMock(): Promise<UtfyllingResponse> {
  try {
    return JSON.parse(await fs.readFile('.meldekort.cache', 'utf8')) as unknown as UtfyllingResponse;
  } catch (err) {
    const meldekort: UtfyllingResponse = {
      metadata: { referanse: '123456789', periode: { fom: '2024-11-04', tom: '2024-11-17' } },
      tilstand: {
        aktivtSteg: 'INTRODUKSJON',
        svar: {
          dager: [
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
      },
    };

    return (await fs.writeFile('.meldekort.cache', JSON.stringify(meldekort))) as unknown as UtfyllingResponse;
  }
}

export async function hentHistoriskMeldekortMock(): Promise<HistoriskMeldeperiode[]> {
  try {
    return JSON.parse(await fs.readFile('.historiskMeldekort.cache', 'utf8')) as unknown as HistoriskMeldeperiode[];
  } catch (err) {
    const meldekort: HistoriskMeldeperiode[] = [
      { meldeperiode: { fom: '2024-11-04', tom: '2024-11-17' }, status: 'KELVIN' },
    ];

    return (await fs.writeFile(
      '.historiskMeldekort.cache',
      JSON.stringify(meldekort)
    )) as unknown as HistoriskMeldeperiode[];
  }
}

export async function hentHistoriskMeldekortDetaljerMock(): Promise<HistoriskMeldeperiodeDetaljer> {
  try {
    return JSON.parse(
      await fs.readFile('.historiskMeldekortDetaljer.cache', 'utf8')
    ) as unknown as HistoriskMeldeperiodeDetaljer;
  } catch (err) {
    const meldekort1: HistoriskMeldeperiodeDetaljer = {
      kanEndres: true,
      periode: { fom: '2024-11-04', tom: '2024-11-17' },
      status: 'KELVIN',
      svar: {
        dager: [
          { dato: '2024-11-04' },
          { dato: '2024-11-05' },
          { dato: '2024-11-06' },
          { dato: '2024-11-07' },
          { dato: '2024-11-08', timerArbeidet: 5 },
          { dato: '2024-11-09' },
          { dato: '2024-11-10' },
          { dato: '2024-11-11' },
          { dato: '2024-11-12', timerArbeidet: 7.5 },
          { dato: '2024-11-13' },
          { dato: '2024-11-14' },
          { dato: '2024-11-15' },
          { dato: '2024-11-16' },
          { dato: '2024-11-17' },
        ],
        harDuJobbet: true,
      },
      type: 'KELVIN',
    };

    return (await fs.writeFile(
      '.historiskMeldekortDetaljer.cache',
      JSON.stringify(meldekort1)
    )) as unknown as HistoriskMeldeperiodeDetaljer;
  }
}

export async function slettMock() {
  await fs.unlink('.kommendeMeldekort.cache');
  await fs.unlink('.meldekort.cache');
  await fs.unlink('.historiskMeldekort.cache');
  await fs.unlink('.historiskMeldekortDetaljer.cache');
}

function hentNesteSteg(nåværendeSteg: Steg, skalTilUtfylling: boolean): Steg {
  switch (nåværendeSteg) {
    case 'INTRODUKSJON':
      return 'SPØRSMÅL';
    case 'SPØRSMÅL':
      return skalTilUtfylling ? 'UTFYLLING' : 'BEKREFT';
    case 'UTFYLLING':
      return 'BEKREFT';
    case 'BEKREFT':
      return 'KVITTERING';
    case 'KVITTERING':
      throw new Error('Det finnes ikke et steg etter kvittering');
  }
}
