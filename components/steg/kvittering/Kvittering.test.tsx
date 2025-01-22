import { render, screen } from '@testing-library/react';
import { Kvittering } from 'components/steg/kvittering/Kvittering';
import { describe, expect, it } from 'vitest';
import { KommendeMeldekortDto, MeldekortResponse } from 'lib/types/types';

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

  it('skal ha en knapp for å gå tilbake til oversikt siden', () => {
    const kommendeMeldekort: KommendeMeldekortDto = {
      nesteMeldekort: {
        meldeperiode: { fom: '2024-12-15', tom: '2024-12-01' },
        meldekortId: '987654321',
        tidligsteInnsendingsDato: '',
        kanSendesInn: true,
      },
      antallUbesvarteMeldekort: 1,
    };
    render(<Kvittering meldekort={meldekort} kommendeMeldekort={kommendeMeldekort} />);

    const knapp = screen.getByRole('link', { name: 'Gå tilbake til oversikt' });
    expect(knapp).toBeVisible();
  });
});
