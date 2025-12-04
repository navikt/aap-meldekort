import { describe, expect, it } from 'vitest';
import { render, screen } from 'lib/utils/test/customRender';

import { UtfyllingResponse } from 'lib/types/types';
import { userEvent } from '@testing-library/user-event';
import { Bekreft } from 'components/flyt/steg/bekreft/Bekreft';

const meldekortUtenArbeid: UtfyllingResponse = {
  tilstand: {
    aktivtSteg: 'UTFYLLING',
    svar: {
      harDuJobbet: false,
      dager: [
        { dato: '2024-11-18' },
        { dato: '2024-11-19' },
        { dato: '2024-11-20' },
        { dato: '2024-11-21' },
        { dato: '2024-11-22' },
        { dato: '2024-11-23' },
        { dato: '2024-11-24' },
        { dato: '2024-11-25' },
        { dato: '2024-11-26' },
        { dato: '2024-11-27' },
        { dato: '2024-11-28' },
        { dato: '2024-11-29' },
        { dato: '2024-11-30' },
        { dato: '2024-12-01' },
      ],
    },
  },
  metadata: {
    antallUbesvarteMeldeperioder: 1,
    kanSendesInn: true,
    periode: { fom: '2024-11-04', tom: '2024-11-17' },
    referanse: '123456789',
  },
};

const meldekortMedArbeid: UtfyllingResponse = {
  metadata: {
    antallUbesvarteMeldeperioder: 1,
    kanSendesInn: true,
    periode: { fom: '2024-11-04', tom: '2024-11-17' },
    referanse: '123456789',
  },
  tilstand: {
    aktivtSteg: 'BEKREFT',
    svar: {
      harDuJobbet: true,
      dager: [
        { dato: '2024-11-18', timerArbeidet: 4 },
        { dato: '2024-11-19' },
        { dato: '2024-11-20' },
        { dato: '2024-11-21', timerArbeidet: 5 },
        { dato: '2024-11-22' },
        { dato: '2024-11-23' },
        { dato: '2024-11-24' },
        { dato: '2024-11-25' },
        { dato: '2024-11-26' },
        { dato: '2024-11-27' },
        { dato: '2024-11-28' },
        { dato: '2024-11-29' },
        { dato: '2024-11-30' },
        { dato: '2024-12-01' },
      ],
    },
  },
};

describe('Stemmer opplysningene', () => {
  it('skal ha en overskrift', () => {
    render(<Bekreft utfylling={meldekortUtenArbeid} />);
    const heading = screen.getByRole('heading', { name: 'Se over og send inn meldekort', level: 2 });
    expect(heading).toBeVisible();
  });

  it('skal vise korrekt svar dersom bruker har oppgitt at hen har jobbet ', () => {
    render(<Bekreft utfylling={meldekortMedArbeid} />);
    const jaSvar = screen.getByText('Ja');
    expect(jaSvar).toBeVisible();
  });

  it('skal vise korrekt svar dersom bruker har oppgitt at hen ikke har jobbet ', () => {
    render(<Bekreft utfylling={meldekortUtenArbeid} />);
    const neiSvar = screen.getByText('Nei');
    expect(neiSvar).toBeVisible();
  });

  it('skal ha et felt for å bekrefte at opplysningene stemmer', () => {
    render(<Bekreft utfylling={meldekortUtenArbeid} />);
    const bekreftOption = screen.getByRole('checkbox', { name: 'Jeg bekrefter at jeg har gitt riktige opplysninger.' });
    expect(bekreftOption).toBeVisible();
  });

  it('skal gi en feilmelding dersom feltet for å bekrefte at opplysningene stemmer ikke er huket av', async () => {
    render(<Bekreft utfylling={meldekortUtenArbeid} />);
    const user = userEvent.setup();
    const sendInnKnapp = screen.getByRole('button', { name: 'Send inn' });

    await user.click(sendInnKnapp);

    const feilmelding = screen.getByText('Du må bekrefte at disse opplysningene stemmer.');
    expect(feilmelding).toBeVisible();
  });

  it('skal vise informasjonsboks om når brukeren tidligst kan sende inn meldekort', () => {
    const meldekortIkkeKlarTilInnsending: UtfyllingResponse = {
      tilstand: {
        aktivtSteg: 'BEKREFT',
        svar: {
          harDuJobbet: false,
          dager: [
            { dato: '2024-11-18' },
            { dato: '2024-11-19' },
            { dato: '2024-11-20' },
            { dato: '2024-11-21' },
            { dato: '2024-11-22' },
            { dato: '2024-11-23' },
            { dato: '2024-11-24' },
            { dato: '2024-11-25' },
            { dato: '2024-11-26' },
            { dato: '2024-11-27' },
            { dato: '2024-11-28' },
            { dato: '2024-11-29' },
            { dato: '2024-11-30' },
            { dato: '2024-12-01' },
          ],
        },
      },
      metadata: {
        antallUbesvarteMeldeperioder: 0,
        kanSendesInn: false,
        periode: { fom: '2024-11-18', tom: '2024-12-01' },
        referanse: '123456789',
        tidligsteInnsendingstidspunkt: '2024-12-03',
      },
    };

    render(<Bekreft utfylling={meldekortIkkeKlarTilInnsending} />);
    const infoboks = screen.getByText('Du kan tidligst sende inn meldekortet 3. desember. Kom tilbake senere for å sende inn meldekortet, i mellomtiden lagrer vi svarene dine.');
    expect(infoboks).toBeVisible();
  });

  it('skal vise informasjonsboks om når brukeren tidligst kan sende inn meldekort for julen 2025', () => {
    const meldekortForJulen2025: UtfyllingResponse = {
      tilstand: {
        aktivtSteg: 'BEKREFT',
        svar: {
          harDuJobbet: false,
          dager: [
            { dato: '2025-12-08' },
            { dato: '2025-12-09' },
            { dato: '2025-12-10' },
            { dato: '2025-12-11' },
            { dato: '2025-12-12' },
            { dato: '2025-12-13' },
            { dato: '2025-12-14' },
            { dato: '2025-12-15' },
            { dato: '2025-12-16' },
            { dato: '2025-12-17' },
            { dato: '2025-12-18' },
            { dato: '2025-12-19' },
            { dato: '2025-12-20' },
            { dato: '2025-12-21' },
          ],
        },
      },
      metadata: {
        antallUbesvarteMeldeperioder: 0,
        kanSendesInn: false,
        periode: { fom: '2025-12-08', tom: '2025-12-21' },
        referanse: '123456789',
      },
    };

    render(<Bekreft utfylling={meldekortForJulen2025} />);
    const infoboks = screen.getByText('Du kan tidligst sende inn meldekortet onsdag 17. desember. Kom tilbake senere for å sende inn meldekortet, i mellomtiden lagrer vi svarene dine.');
    expect(infoboks).toBeVisible();
  })

});
