import fs from 'fs/promises';

import {
  HistoriskMeldekort,
  HistoriskMeldekortDetaljer,
  KommendeMeldekort,
  MeldekortRequest,
  MeldekortResponse,
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
      nesteMeldekort: {
        meldeperiode: { fom: '2024-11-04', tom: '2024-11-17' },
        meldekortId: 123456,
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
  const skalTilUtfylling = Boolean(
    meldekortRequest?.meldekort?.harDuJobbet ||
      meldekortRequest?.meldekort?.harDuVærtSyk ||
      meldekortRequest?.meldekort?.harDuHattFerie ||
      meldekortRequest?.meldekort?.harDuGjennomførtAvtaltAktivitetKursEllerUtdanning
  );
  const nesteSteg = hentNesteSteg(meldekortRequest.nåværendeSteg, skalTilUtfylling);

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
      tidligsteInnsendingsDato: '2024-11-16',
      steg: 'INTRODUKSJON',
      periode: { fom: '2024-11-04', tom: '2024-11-17' },
    };

    return (await fs.writeFile('.meldekort.cache', JSON.stringify(meldekort))) as unknown as MeldekortResponse;
  }
}

export async function hentHistoriskMeldekortMock(): Promise<HistoriskMeldekort[]> {
  try {
    return JSON.parse(await fs.readFile('.historiskMeldekort.cache', 'utf8')) as unknown as HistoriskMeldekort[];
  } catch (err) {
    const meldekort: HistoriskMeldekort[] = [
      { meldeperiode: { fom: '2024-11-04', tom: '2024-11-17' }, status: 'INNSENDT' },
    ];

    return (await fs.writeFile(
      '.historiskMeldekort.cache',
      JSON.stringify(meldekort)
    )) as unknown as HistoriskMeldekort[];
  }
}

export async function hentHistoriskMeldekortDetaljerMock(): Promise<HistoriskMeldekortDetaljer[]> {
  try {
    return JSON.parse(
      await fs.readFile('.historiskMeldekortDetaljer.cache', 'utf8')
    ) as unknown as HistoriskMeldekortDetaljer[];
  } catch (err) {
    const meldekort: HistoriskMeldekortDetaljer[] = [
      {
        meldekortId: 123456789,
        meldeperiode: { fom: '2024-11-04', tom: '2024-11-17' },
        status: 'INNSENDT',
        innsendtDato: new Date().toString(),
        kanEndres: true,
        type: 'VANLIG',
        bruttoBeløp: 8745,
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
        harDuGjennomførtAvtaltAktivitetKursEllerUtdanning: false,
        harDuJobbet: true,
        harDuVærtSyk: false,
        harDuHattFerie: false,
      },
      // {
      //   meldekortId: 123456789,
      //   meldeperiode: { fom: '2024-11-04', tom: '2024-11-17' },
      //   status: 'INNSENDT',
      //   innsendtDato: subDays(new Date(), 2).toString(),
      //   kanEndres: true,
      //   bruttoBeløp: 8745,
      //   timerArbeidet: [
      //     { dato: '2024-11-04' },
      //     { dato: '2024-11-05' },
      //     { dato: '2024-11-06' },
      //     { dato: '2024-11-07', timer: 5 },
      //     { dato: '2024-11-08' },
      //     { dato: '2024-11-09' },
      //     { dato: '2024-11-10' },
      //     { dato: '2024-11-11' },
      //     { dato: '2024-11-12' },
      //     { dato: '2024-11-13' },
      //     { dato: '2024-11-14' },
      //     { dato: '2024-11-15' },
      //     { dato: '2024-11-16' },
      //     { dato: '2024-11-17' },
      //   ],
      // },
    ];
    return (await fs.writeFile(
      '.historiskMeldekortDetaljer.cache',
      JSON.stringify(meldekort)
    )) as unknown as HistoriskMeldekortDetaljer[];
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
      return skalTilUtfylling ? 'UTFYLLING' : 'STEMMER_OPPLYSNINGENE';
    case 'UTFYLLING':
      return 'STEMMER_OPPLYSNINGENE';
    case 'STEMMER_OPPLYSNINGENE':
      return 'INNSENDING_VANLIG_MELDEKKORT';
    case 'INNSENDING_VANLIG_MELDEKKORT':
      return 'KVITTERING';
    case 'KVITTERING':
      throw new Error('Det finnes ikke et steg etter kvittering');
  }
}
