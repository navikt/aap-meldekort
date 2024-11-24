import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Rapporteringskalender } from 'components/rapporteringskalender/Rapporteringskalender';
import { eachDayOfInterval, format } from 'date-fns';

export interface Periode {
  periode: { fraDato: string; tilDato: string };
}

const periode: Periode = {
  periode: { fraDato: '2024-11-18', tilDato: '2024-12-01' },
};

describe('generelt', () => {
  it('skal vise ukenummer på perioden', () => {
    render(<Rapporteringskalender periode={periode} />);
    const ukenummer = screen.getByText('Uke 47 - 48');
    expect(ukenummer).toBeVisible();
  });

  it('skal vise fra dato og til dato for perioden', () => {
    render(<Rapporteringskalender periode={periode} />);
    const datoerForPerioden = screen.getByText('18.11.2024 - 01.12.2024');
    expect(datoerForPerioden).toBeVisible();
  });

  it('skal vise dagene i uken som tekst', () => {
    render(<Rapporteringskalender periode={periode} />);
    const mandag = screen.getByText('Man.');
    expect(mandag).toBeVisible();

    const tirsdag = screen.getByText('Tir.');
    expect(tirsdag).toBeVisible();

    const onsdag = screen.getByText('Ons.');
    expect(onsdag).toBeVisible();

    const torsdag = screen.getByText('Tor.');
    expect(torsdag).toBeVisible();

    const fredag = screen.getByText('Fre.');
    expect(fredag).toBeVisible();

    const lørdag = screen.getByText('Lør.');
    expect(lørdag).toBeVisible();

    const søndag = screen.getByText('Søn.');
    expect(søndag).toBeVisible();
  });
});

describe('input for timer', () => {
  it('skal vise 14 felter for å føre inn timer', () => {
    render(<Rapporteringskalender periode={periode} />);
    for (let i = 0; i < 14; i++) {
      const felt = screen.getByRole('textbox', { name: `dager.${i}.timer` });
      expect(felt).toBeVisible();
    }
  });

  it('skal vise datoen for de 14 feltene', () => {
    render(<Rapporteringskalender periode={periode} />);

    const datoer = eachDayOfInterval({
      start: new Date(periode.periode.fraDato),
      end: new Date(periode.periode.tilDato),
    });

    datoer.forEach((dato) => {
      const datoNummer = format(dato, 'd');
      const tekst = screen.getByText(`${datoNummer}.`);
      expect(tekst).toBeVisible();
    });
  });
});
