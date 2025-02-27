import { beforeEach, describe, expect, it } from 'vitest';
import { Spørsmål } from 'components/flyt/steg/spørsmål/Spørsmål';
import { render, screen, within } from 'lib/utils/test/customRender';
import { userEvent } from '@testing-library/user-event';
import { UtfyllingResponse } from 'lib/types/types';

const periode: UtfyllingResponse = {
  tilstand: {
    aktivtSteg: 'SPØRSMÅL',
    svar: {
      dager: [],
    },
  },
  metadata: {
    periode: {
      fom: '2024-11-18',
      tom: '2024-12-01',
    },
    referanse: '123456789',
  },
};

const user = userEvent.setup();

describe('Periode', () => {
  beforeEach(() => render(<Spørsmål utfylling={periode} referanse={'1234'} />));

  it('Skal ha en heading', () => {
    const heading = screen.getByRole('heading', { name: 'Fyll ut meldekort', level: 2 });
    expect(heading).toBeVisible();
  });

  it('skal vise dato og uker for perioden', () => {
    const tekst = screen.getByText('Uke 47 - 48 (18.11.2024 - 01.12.2024)');
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
    const felt = screen.getByRole('group', { name: 'Har du arbeidet i perioden?' });
    const jaOption = within(felt).getByRole('radio', { name: 'Ja' });
    expect(jaOption).toBeVisible();

    const neiOption = within(felt).getByRole('radio', { name: 'Nei' });
    expect(neiOption).toBeVisible();
  });

  it('skal vise en feilmelding dersom feltet ikke er besvart', async () => {
    const fullførKnapp = screen.getByRole('button', { name: 'Neste' });
    await user.click(fullførKnapp);
    const feilmelding = screen.getByText('Du må svare på om du har arbeidet i perioden');
    expect(feilmelding).toBeVisible();
  });
});
