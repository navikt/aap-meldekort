import { Kvittering } from 'components/flyt/steg/kvittering/Kvittering';
import { describe, expect, it, vi } from 'vitest';
import { KommendeMeldekort, UtfyllingResponse } from 'lib/types/types';
import { render, screen } from 'lib/utils/test/customRender';

const meldekort: UtfyllingResponse = {
  metadata: {
    antallUbesvarteMeldeperioder: 1,
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
  antallUbesvarteMeldeperioder: 1,
  nesteMeldeperiode: {
    meldeperiode: { fom: '2024-12-02', tom: '2024-12-15' },
    innsendingsvindu: { fom: '2024-12-15', tom: '2024-12-23' },
  },
};

// TODO hadde vært fint å slippe en ekstra implementasjon av mock for next/navigation
const mocks = vi.hoisted(() => {
  return {
    useParams: vi.fn().mockReturnValue({ referanse: '123', innsendingtype: 'innsending' }),
  };
});

vi.mock('next/navigation', () => {
  return {
    useParams: mocks.useParams,
    useRouter: vi.fn().mockReturnValue({ prefetch: () => null }),
  };
});

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

  it('skal vise en knapp for å fylle ut neste meldekort dersom det finnes et og antall ubesvarte meldeperioder er over 0', () => {
    render(<Kvittering utfylling={meldekort} kommendeMeldeperiode={kommendeMeldekort} />);

    const nesteMeldeperiodeKnapp = screen.getByRole('button', { name: 'Gå til neste meldekort' });
    expect(nesteMeldeperiodeKnapp).toBeVisible();
  });

  it('skal ikke vise en knapp for å fylle ut neste meldekort dersom dersom kommendeMeldekort er null', () => {
    render(<Kvittering utfylling={meldekort} />);

    const nesteMeldeperiodeKnapp = screen.queryByRole('button', { name: 'Gå til neste meldekort' });
    expect(nesteMeldeperiodeKnapp).not.toBeInTheDocument();
  });

  it('viser et punkt med informasjon om at bruker kan endre meldekortet ved første innsending', () => {
    render(<Kvittering utfylling={meldekort} />);
    expect(screen.getByText('Du kan endre opplysningene hvis du oppdager at du har ført feil.')).toBeVisible();
  });

  it('viser et punkt med informasjon om når utbetaling vil skje når bruker har vedtak i Kelvin', () => {
    const meldekortMedVedtak: UtfyllingResponse = {
      ...meldekort,
      metadata: { ...meldekort.metadata, harBrukerVedtakIKelvin: true },
    };
    render(<Kvittering utfylling={meldekortMedVedtak} />);
    expect(screen.getByText('Du vil få utbetalt AAP om cirka 2 til 3 virkedager.')).toBeVisible();
  });

  it('viser ikke en punktliste med informasjon om at bruker kan endre meldekortet ved korrigering', () => {
    mocks.useParams.mockReturnValueOnce({ referanse: '123', InnsendingType: 'korrigering' });

    render(<Kvittering utfylling={meldekort} />);
    expect(
      screen.queryByText('Du kan endre opplysningene hvis du oppdager at du har ført feil.')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Du vil få utbetalt AAP om ca 2 til 3 virkedager.')).not.toBeInTheDocument();
  });
});
