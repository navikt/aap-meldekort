import { render, screen } from '@testing-library/react';
import { KvitteringInnsending } from 'components/flyt/innsending/steg/kvittering/KvitteringInnsending';
import { describe, expect, it } from 'vitest';
import { KommendeMeldekort, MeldekortResponse } from 'lib/types/types';

const meldekort: MeldekortResponse = {
  periode: { fom: '2024-11-18', tom: '2024-12-01' },
  meldekort: {
    dager: [],
  },
  steg: 'KVITTERING',
  tidligsteInnsendingsDato: '2024-11-04',
};

describe('Kvittering', () => {
  it('viser en suksess-melding', () => {
    render(<KvitteringInnsending meldekort={meldekort} />);
    expect(
      screen.getByText('Meldekortet ditt er sendt til Nav, du får beskjed hvis vi trenger noe mer fra deg.')
    ).toBeVisible();
  });

  it('har en accordion for å se hva som ble sendt inn', () => {
    render(<KvitteringInnsending meldekort={meldekort} />);
    expect(screen.getByText('Se hva du sendte inn')).toBeVisible();
  });

  it('skal ha en knapp for å gå tilbake til oversikt siden', () => {
    const kommendeMeldekort: KommendeMeldekort = {
      nesteMeldekort: {
        meldeperiode: { fom: '2024-12-15', tom: '2024-12-01' },
        meldekortId: 987654321,
        tidligsteInnsendingsDato: '',
        kanSendesInn: true,
      },
      antallUbesvarteMeldekort: 1,
    };
    render(<KvitteringInnsending meldekort={meldekort} kommendeMeldekort={kommendeMeldekort} />);

    const knapp = screen.getByRole('link', { name: 'Gå tilbake til oversikt' });
    expect(knapp).toBeVisible();
  });
});
