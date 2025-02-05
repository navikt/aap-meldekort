import { beforeEach, describe, expect, it } from 'vitest';
import { HarDuArbeidet } from 'components/flyt/innsending/steg/harduarbeidet/HarDuArbeidet';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MeldekortResponse } from 'lib/types/types';

const periode: MeldekortResponse = {
  periode: {
    fom: '2024-11-18',
    tom: '2024-12-01',
  },
  meldekort: {
    timerArbeidet: [],
  },
  steg: 'JOBBET_I_MELDEPERIODEN',
};

const user = userEvent.setup();

describe('Periode', () => {
  beforeEach(() => render(<HarDuArbeidet meldekort={periode} referanse={'1234'} />));

  it('Skal ha en heading', () => {
    const heading = screen.getByRole('heading', { name: 'Arbeid i uke 47 og 48', level: 2 });
    expect(heading).toBeVisible();
  });

  it('skal vise startdato og sluttdato for perioden', () => {
    const tekst = screen.getByText('18.11.2024 - 01.12.2024');
    expect(tekst).toBeVisible();
  });

  it('skal vise korrekt tekst på neste knapp', () => {
    const nesteStegKnapp = screen.getByRole('button', { name: 'Neste' });
    expect(nesteStegKnapp).toBeVisible();
  });

  it('skal ha et felt for om bruker har arbeidet i perioden', () => {
    const felt = screen.getByRole('group', { name: 'Har du arbeidet i perioden?' });
    expect(felt).toBeVisible();
  });

  it('skal ha Ja og Nei som options', () => {
    const jaOption = screen.getByRole('radio', { name: 'Ja' });
    expect(jaOption).toBeVisible();

    const neiOption = screen.getByRole('radio', { name: 'Nei' });
    expect(neiOption).toBeVisible();
  });

  it('skal vise en feilmelding dersom feltet ikke er besvart', async () => {
    const fullførKnapp = screen.getByRole('button', { name: 'Neste' });
    await user.click(fullførKnapp);
    const feilmelding = screen.getByText('Du må svare på om du har arbeidet i perioden');
    expect(feilmelding).toBeVisible();
  });

  it('skal ha en lenke for å gå tilbake til forrige steg', () => {
    const tilbakeLenke = screen.getByRole('link', { name: 'Tilbake' });
    expect(tilbakeLenke).toBeVisible();
  });
});
