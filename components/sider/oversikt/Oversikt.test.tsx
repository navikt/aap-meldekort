import { describe, expect, it } from 'vitest';
import { KommendeMeldekort, MetadataResponse } from 'lib/types/types';
import { render, screen } from 'lib/utils/test/customRender';
import { Oversikt } from 'components/sider/oversikt/Oversikt';

const kommendeMeldekort: KommendeMeldekort = {
  antallUbesvarteMeldeperioder: 1,
  manglerOpplysninger: { fom: '2025-02-17', tom: '2025-03-03' },
  nesteMeldeperiode: {
    meldeperiode: { fom: '2025-02-17', tom: '2025-03-03' },
    innsendingsvindu: { fom: '2025-02-17', tom: '2025-03-03' },
  },
};

const metadata: MetadataResponse = {
  brukerHarSakUnderBehandling: false,
  brukerHarVedtakIKelvin: false,
};

describe('Oversikt', () => {
  it('skal vise en tekst om at det ikke finnes en meldeperiode som er klar for utfylling dersom det ikke finnes ', () => {
    render(<Oversikt harInnsendteMeldeperioder={false} metadata={metadata} />);
    const text = screen.getByText('Du har ingen meldekort å sende inn enda.');
    expect(text).toBeVisible();
  });

  it('skal ikke vise navigering til innsendte meldekort dersom der ikke finnes noen innesndte meldeperioder', () => {
    render(<Oversikt harInnsendteMeldeperioder={false} metadata={metadata} />);

    const link = screen.queryByRole('link', { name: /se og endre meldekort/i });
    expect(link).not.toBeInTheDocument();
  });

  it('skal vise en button til neste utfylling dersom det finnes', () => {
    render(<Oversikt harInnsendteMeldeperioder={false} kommendeMeldeperiode={kommendeMeldekort} metadata={metadata} />);
    const button = screen.getByText('Du har 1 meldekort å sende inn');
    expect(button).toBeVisible();
  });

  it('skal vise en lenke til tidligere innsendte meldeperioder dersom det finnes', () => {
    render(<Oversikt harInnsendteMeldeperioder={true} kommendeMeldeperiode={kommendeMeldekort} metadata={metadata} />);
    const link = screen.getByRole('link', { name: /se og endre meldekort/i });
    expect(link).toBeVisible();
  });

  it('skal vise en informasjonsboks dersom det er ingen meldekort som er klar til innsending, men kan fylles ut', () => {
    render(
      <Oversikt
        harInnsendteMeldeperioder={false}
        kommendeMeldeperiode={{
          antallUbesvarteMeldeperioder: 0,
          nesteMeldeperiode: {
            meldeperiode: { fom: '2025-02-17', tom: '2025-03-03' },
            innsendingsvindu: { fom: '2025-02-17', tom: '2025-03-03' },
          },
        }}
        metadata={metadata}
      />
    );

    const alert = screen.getByText('Du kan fylle ut meldekortet nå, men det kan tidligst sendes inn 17. februar.');
    expect(alert).toBeVisible();
  });

  it('skal ikke vise en informasjonsboks dersom det er meldekort som er klar til innsending', () => {
    render(
      <Oversikt
        harInnsendteMeldeperioder={false}
        kommendeMeldeperiode={{
          antallUbesvarteMeldeperioder: 1,
          manglerOpplysninger: { fom: '2025-02-17', tom: '2025-03-03' },
          nesteMeldeperiode: {
            meldeperiode: { fom: '2025-02-17', tom: '2025-03-03' },
            innsendingsvindu: { fom: '2025-02-17', tom: '2025-03-03' },
          },
        }}
        metadata={metadata}
      />
    );

    const alert = screen.queryByText('Du kan fylle ut meldekortet nå, men det kan tidligst sendes inn 17. februar.');
    expect(alert).not.toBeInTheDocument();
  });

  it('viser informasjonsboks om at man enda ikke har fått AAP når bruker har en sak under behandling', () => {
    render(
      <Oversikt
        harInnsendteMeldeperioder={false}
        metadata={{ brukerHarVedtakIKelvin: false, brukerHarSakUnderBehandling: true }}
      />
    );

    expect(screen.getByText('Søknaden er under behandling, og du har ikke fått vedtak om AAP.')).toBeVisible();
  });

  it('når bruker har en søknad til behandling, og meldekort som kan sendes inn sier knappen at man kan sende inn meldekort', () => {
    render(
      <Oversikt
        harInnsendteMeldeperioder={false}
        kommendeMeldeperiode={kommendeMeldekort}
        metadata={{ brukerHarVedtakIKelvin: false, brukerHarSakUnderBehandling: true }}
      />
    );

    expect(screen.getByText('Du kan sende inn 1 meldekort')).toBeVisible();
  });
});
