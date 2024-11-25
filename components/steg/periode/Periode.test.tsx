import { beforeEach, describe, expect, it } from 'vitest';
import { renderWithStegContext } from 'lib/utils/TestUtil';
import { Periode } from 'components/steg/periode/Periode';
import { PeriodeType } from 'components/rapporteringskalender/Rapporteringskalender';
import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

const periode: PeriodeType = {
  periode: { fraDato: '2024-11-18', tilDato: '2024-12-01' },
};

const user = userEvent.setup();

describe('Periode', () => {
  beforeEach(() => renderWithStegContext(<Periode periode={periode} />));

  it('Skal ha en heading', () => {
    const heading = screen.getByRole('heading', { name: 'Nåværende periode', level: 2 });
    expect(heading).toBeVisible();
  });

  it('skal vise ukenummer, startdato og sluttdato for perioden', () => {
    const tekst = screen.getByText('Uke 47 - 48 (18.11.2024 - 01.12.2024)');
    expect(tekst).toBeVisible();
  });

  it('skal ha en read more komponent for forklaring på hva som skal fylles ut', () => {
    const readMore = screen.getByText('Les mer om hva som skal fylles ut');
    expect(readMore).toBeVisible();
  });

  it('skal vise korrekt tekst på neste knapp', () => {
    const nesteStegKnapp = screen.getByRole('button', { name: 'Til utfylling' });
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
    const fullførKnapp = screen.getByRole('button', { name: 'Til utfylling' });
    await user.click(fullførKnapp);
    const feilmelding = screen.getByText('Du må svare på om du har arbeidet i perioden');
    expect(feilmelding).toBeVisible();
  });
});
