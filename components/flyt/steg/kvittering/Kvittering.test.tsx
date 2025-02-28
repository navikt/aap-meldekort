import { Kvittering } from 'components/flyt/steg/kvittering/Kvittering';
import { describe, expect, it } from 'vitest';
import { UtfyllingResponse, KommendeMeldekort } from 'lib/types/types';
import { render, screen } from 'lib/utils/test/customRender';

const meldekort: UtfyllingResponse = {
  metadata: {
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

describe('Kvittering', () => {
  it('viser en suksess-melding', () => {
    render(<Kvittering utfylling={meldekort} />);
    expect(
      screen.getByText('Vi har mottatt meldekortet ditt.')
    ).toBeVisible();
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
    render(<Kvittering utfylling={meldekort} kommendeMeldekort={kommendeMeldekort} />);

    const knapp = screen.getByRole('link', { name: 'Gå tilbake til oversikt' });
    expect(knapp).toBeVisible();
  });
});
