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
    periode: { fom: '2024-11-04', tom: '2024-11-17' },
    referanse: '123456789',
  },
};

const meldekortMedArbeid: UtfyllingResponse = {
  metadata: {
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
  it('skal ha en lenke som fører tilbake til oversikt siden', () => {
    render(<Bekreft utfylling={meldekortMedArbeid} referanse={'1234'} />);
    const tilbakeLenke = screen.getByRole('link', { name: 'Tilbake' });
    expect(tilbakeLenke).toBeVisible();
  });

  it('skal ha en overskrift', () => {
    render(<Bekreft referanse={'123'} utfylling={meldekortUtenArbeid} />);
    const heading = screen.getByRole('heading', { name: 'Se over og send inn meldekort', level: 2 });
    expect(heading).toBeVisible();
  });

  it('skal vise perioden med datoer', () => {
    render(<Bekreft referanse={'123'} utfylling={meldekortUtenArbeid} />);
    const datoer = screen.getByText('04.11.2024 - 17.11.2024');
    expect(datoer).toBeVisible();
  });

  it('skal vise korrekt svar dersom bruker har oppgitt at hen har jobbet ', () => {
    render(<Bekreft referanse={'123'} utfylling={meldekortMedArbeid} />);
    const jaSvar = screen.getByText('Ja');
    expect(jaSvar).toBeVisible();
  });

  it('skal vise korrekt svar dersom bruker har oppgitt at hen ikke har jobbet ', () => {
    render(<Bekreft referanse={'123'} utfylling={meldekortUtenArbeid} />);
    const neiSvar = screen.getByText('Nei');
    expect(neiSvar).toBeVisible();
  });

  it('skal ha en lenke tilbake til steget for om du har arbeidet i perioden', () => {
    render(<Bekreft referanse={'123'} utfylling={meldekortUtenArbeid} />);
    const link = screen.getByRole('link', { name: 'Endre om du har arbeidet i perioden' });
    expect(link).toBeVisible();
  });

  it('skal ha en lenke tilbake til steget hvor bruker fyller inn timer', () => {
    render(<Bekreft referanse={'123'} utfylling={meldekortMedArbeid} />);
    const link = screen.getByRole('link', { name: 'Endre antall timer arbeidet' });
    expect(link).toBeVisible();
  });

  it('skal ha et felt for å bekrefte at opplysningene stemmer', () => {
    render(<Bekreft referanse={'123'} utfylling={meldekortUtenArbeid} />);
    const bekreftOption = screen.getByRole('checkbox', { name: 'Jeg bekrefter at disse opplysningene stemmer' });
    expect(bekreftOption).toBeVisible();
  });

  it('skal gi en feilmelding dersom feltet for å bekrefte at opplysningene stemmer ikke er huket av', async () => {
    render(<Bekreft referanse={'123'} utfylling={meldekortUtenArbeid} />);
    const user = userEvent.setup();
    const sendInnKnapp = screen.getByRole('button', { name: 'Send inn' });

    await user.click(sendInnKnapp);

    const feilmelding = screen.getByText('Du må bekrefte at disse opplysningene stemmer');
    expect(feilmelding).toBeVisible();
  });
});
