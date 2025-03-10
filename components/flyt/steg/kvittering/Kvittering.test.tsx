import { Kvittering } from 'components/flyt/steg/kvittering/Kvittering';
import { describe, expect, it } from 'vitest';
import { KommendeMeldekort, UtfyllingResponse } from 'lib/types/types';
import { render, screen } from 'lib/utils/test/customRender';

const meldekort: UtfyllingResponse = {
  metadata: {
    kanSendesInn: true,
    periode: { fom: '2024-11-18', tom: '2024-12-01' },
    referanse: '123456789',
  },
  tilstand: {
    svar: {
      dager: [],
    },
    aktivtSteg: 'KVITTERING',
  },
};

const kommendeMeldekort: KommendeMeldekort = {
  antallUbesvarteMeldeperioder: 0,
  nesteMeldeperiode: {
    meldeperiode: { fom: '2024-12-02', tom: '2024-12-15' },
    innsendingsvindu: { fom: '2024-12-15', tom: '2024-12-23' },
  },
};

describe('Kvittering', () => {
  it('viser en suksess-melding', () => {
    render(<Kvittering utfylling={meldekort} />);
    expect(screen.getByText('Vi har mottatt meldekortet ditt.')).toBeVisible();
  });

  it('har en accordion for å se hva som ble sendt inn', () => {
    render(<Kvittering utfylling={meldekort} />);
    expect(screen.getByText('Se hva du sendte inn')).toBeVisible();
  });

  it('skal ha en knapp for å gå tilbake til oversikt siden', () => {
    const kommendeMeldekort: KommendeMeldekort = {
      nesteMeldeperiode: {
        meldeperiode: { fom: '2024-12-15', tom: '2024-12-01' },
        innsendingsvindu: { fom: '2024-12-15', tom: '2024-12-01' },
      },
      antallUbesvarteMeldeperioder: 1,
    };
    render(<Kvittering utfylling={meldekort} kommendeMeldeperiode={kommendeMeldekort} />);

    const knapp = screen.getByRole('link', { name: 'Gå tilbake til oversikt' });
    expect(knapp).toBeVisible();
  });

  it('skal vise en knapp for å fylle ut neste meldekort dersom det finnes et', () => {
    render(<Kvittering utfylling={meldekort} kommendeMeldeperiode={kommendeMeldekort} />);

    const nesteMeldeperiodeKnapp = screen.getByRole('button', { name: 'Gå til neste meldekort' });
    expect(nesteMeldeperiodeKnapp).toBeVisible();
  });

  it('skal ikke vise en knapp for å fylle ut neste meldekort dersom dersom kommendeMeldekort er null', () => {
    render(<Kvittering utfylling={meldekort} kommendeMeldeperiode={kommendeMeldekort} />);

    const nesteMeldeperiodeKnapp = screen.queryByRole('button', { name: 'Gå til neste meldekort' });
    expect(nesteMeldeperiodeKnapp).not.toBeInTheDocument();
  });
});
