import { render, screen } from '@testing-library/react';
import { Kvittering } from 'components/steg/kvittering/Kvittering';
import { describe, expect, it } from 'vitest';
import { MeldekortResponse, Meldeperiode } from 'lib/types/types';

const meldekort: MeldekortResponse = {
  periode: { fom: '2024-11-18', tom: '2024-12-01' },
  meldekort: {
    timerArbeidet: [],
  },
  steg: 'KVITTERING',
};

describe('Kvittering', () => {
  it('viser en suksess-melding', () => {
    render(<Kvittering meldekort={meldekort} />);
    expect(
      screen.getByText('Meldekortet ditt er sendt til Nav, du får beskjed hvis vi trenger noe mer fra deg.')
    ).toBeVisible();
  });

  it('har en accordion for å se hva som ble sendt inn', () => {
    render(<Kvittering meldekort={meldekort} />);
    expect(screen.getByText('Se hva du sendte inn')).toBeVisible();
  });

  it('har en knapp som tar deg til "Mine aap"', () => {
    render(<Kvittering meldekort={meldekort} />);
    expect(screen.getByRole('button', { name: 'Gå til Mine AAP' })).toBeVisible();
  });

  it('skal ha en knapp for å kunne sende fylle ut et nytt meldekort dersom det finnes en ubesvart meldeperiode', () => {
    const meldeperiode: Meldeperiode = {
      kanEndres: false,
      klarForInnsending: true,
      meldekortId: 0,
      type: 'VANLIG',
      periode: {
        fom: '2024-11-18',
        tom: '2024-12-01',
      },
    };
    render(<Kvittering meldekort={meldekort} ubesvartMeldeperiode={meldeperiode} />);

    const knapp = screen.getByRole('button', { name: 'Send inn neste periode 18.11.2024 - 01.12.2024' });
    expect(knapp).toBeVisible();
  });
});
