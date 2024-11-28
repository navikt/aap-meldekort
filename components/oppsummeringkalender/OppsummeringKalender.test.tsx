import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { eachDayOfInterval, format } from 'date-fns';
import { PeriodeType } from 'components/rapporteringskalender/Rapporteringskalender';
import { OppsummeringKalender } from 'components/oppsummeringkalender/OppsummeringKalender';

const periode: PeriodeType = {
  fraDato: '2024-11-18',
  tilDato: '2024-12-01',
};

describe('oppsummering kalender', () => {
  it('skal vise ukenummer på perioden', () => {
    render(<OppsummeringKalender periode={periode} />);
    const ukenummer = screen.getByText('Uke 47 - 48');
    expect(ukenummer).toBeVisible();
  });

  it('skal vise fra dato og til dato for perioden', () => {
    render(<OppsummeringKalender periode={periode} />);
    const datoerForPerioden = screen.getByText('18.11.2024 - 01.12.2024');
    expect(datoerForPerioden).toBeVisible();
  });

  it('skal vise dagene i uken som tekst', () => {
    render(<OppsummeringKalender periode={periode} />);
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

  it('skal vise 14 felter som viser timene som  er ført', () => {
    render(<OppsummeringKalender periode={periode} />);
    for (let i = 0; i < 14; i++) {
      const førteTimer = screen.getAllByText('0');
      expect(førteTimer).toHaveLength(14);
    }
  });
  it('skal vise datoen for de 14 feltene', () => {
    render(<OppsummeringKalender periode={periode} />);
    const datoer = eachDayOfInterval({
      start: new Date(periode.fraDato),
      end: new Date(periode.tilDato),
    });
    datoer.forEach((dato) => {
      const datoNummer = format(dato, 'd');
      const tekst = screen.getByText(`${datoNummer}.`);
      expect(tekst).toBeVisible();
    });
  });
});
