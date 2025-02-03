import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { eachDayOfInterval, format } from 'date-fns';
import { OppsummeringKalender } from 'components/oppsummeringkalender/OppsummeringKalender';

const periode = { fom: '2024-11-18', tom: '2024-12-01' };
const timerArbeider = [
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
];

describe('oppsummering kalender', () => {
  it('skal vise ukenummer på perioden', () => {
    render(<OppsummeringKalender timerArbeidet={timerArbeider} periode={periode} />);
    const ukenummer = screen.getByText('Uke 47 - 48');
    expect(ukenummer).toBeVisible();
  });

  it('skal vise fra dato og til dato for perioden', () => {
    render(<OppsummeringKalender timerArbeidet={timerArbeider} periode={periode} />);
    const datoerForPerioden = screen.getByText('18.11.2024 - 01.12.2024');
    expect(datoerForPerioden).toBeVisible();
  });

  it('skal vise dagene i uken som tekst', () => {
    render(<OppsummeringKalender timerArbeidet={timerArbeider} periode={periode} />);
    const mandag = screen.getByText('ma.');
    expect(mandag).toBeVisible();

    const tirsdag = screen.getByText('ti.');
    expect(tirsdag).toBeVisible();

    const onsdag = screen.getByText('on.');
    expect(onsdag).toBeVisible();

    const torsdag = screen.getByText('to.');
    expect(torsdag).toBeVisible();

    const fredag = screen.getByText('fr.');
    expect(fredag).toBeVisible();

    const lørdag = screen.getByText('lø.');
    expect(lørdag).toBeVisible();

    const søndag = screen.getByText('sø.');
    expect(søndag).toBeVisible();
  });

  it('skal vise 14 felter som viser timene som  er ført', () => {
    render(<OppsummeringKalender timerArbeidet={timerArbeider} periode={periode} />);
    for (let i = 0; i < 14; i++) {
      const førteTimer = screen.getAllByText('0t');
      expect(førteTimer).toHaveLength(14);
    }
  });
  it('skal vise datoen for de 14 feltene', () => {
    render(<OppsummeringKalender timerArbeidet={timerArbeider} periode={periode} />);
    const datoer = eachDayOfInterval({
      start: new Date(periode.fom),
      end: new Date(periode.tom),
    });
    datoer.forEach((dato) => {
      const datoNummer = format(dato, 'd');
      const tekst = screen.getByText(`${datoNummer}.`);
      expect(tekst).toBeVisible();
    });
  });
});
