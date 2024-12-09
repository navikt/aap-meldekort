import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { eachDayOfInterval, format } from 'date-fns';
import { OppsummeringKalender } from 'components/oppsummeringkalender/OppsummeringKalender';

import { MeldekortResponse } from 'lib/types/types';

const meldekort: MeldekortResponse = {
  periode: { fom: '2024-11-18', tom: '2024-12-01' },
  meldekort: {
    timerArbeidet: [],
  },
  steg: 'TIMER_ARBEIDET',
};

describe('oppsummering kalender', () => {
  it('skal vise ukenummer på perioden', () => {
    render(<OppsummeringKalender meldekort={meldekort} />);
    const ukenummer = screen.getByText('Uke 47 - 48');
    expect(ukenummer).toBeVisible();
  });

  it('skal vise fra dato og til dato for perioden', () => {
    render(<OppsummeringKalender meldekort={meldekort} />);
    const datoerForPerioden = screen.getByText('18.11.2024 - 01.12.2024');
    expect(datoerForPerioden).toBeVisible();
  });

  it('skal vise dagene i uken som tekst', () => {
    render(<OppsummeringKalender meldekort={meldekort} />);
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
    render(<OppsummeringKalender meldekort={meldekort} />);
    for (let i = 0; i < 14; i++) {
      const førteTimer = screen.getAllByText('0');
      expect(førteTimer).toHaveLength(14);
    }
  });
  it('skal vise datoen for de 14 feltene', () => {
    render(<OppsummeringKalender meldekort={meldekort} />);
    const datoer = eachDayOfInterval({
      start: new Date(meldekort.periode.fom),
      end: new Date(meldekort.periode.tom),
    });
    datoer.forEach((dato) => {
      const datoNummer = format(dato, 'd');
      const tekst = screen.getByText(`${datoNummer}.`);
      expect(tekst).toBeVisible();
    });
  });
});
