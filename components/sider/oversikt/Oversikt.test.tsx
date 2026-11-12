import { describe, expect, it } from 'vitest';
import { KommendeMeldekort } from 'lib/types/types';
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

describe('Oversikt', () => {
  it('skal vise en tekst om at det ikke finnes en meldeperiode som er klar for utfylling dersom det ikke finnes ', () => {
    render(<Oversikt harInnsendteMeldeperioder={false} />);
    const text = screen.getByText('Du har ingen meldekort å sende inn.');
    expect(text).toBeVisible();
  });

  it('skal ikke vise navigering til innsendte meldekort dersom der ikke finnes noen innesndte meldeperioder', () => {
    render(<Oversikt harInnsendteMeldeperioder={false} />);

    const link = screen.queryByRole('link', { name: /se og endre meldekort/i });
    expect(link).not.toBeInTheDocument();
  });

  it('skal vise en button til neste utfylling dersom det finnes', () => {
    render(<Oversikt harInnsendteMeldeperioder={false} kommendeMeldeperiode={kommendeMeldekort} />);
    const button = screen.getByText('Du har 1 meldekort å sende inn');
    expect(button).toBeVisible();
  });

  it('skal vise en lenke til tidligere innsendte meldeperioder dersom det finnes', () => {
    render(<Oversikt harInnsendteMeldeperioder={true} kommendeMeldeperiode={kommendeMeldekort} />);
    const link = screen.getByRole('link', { name: /se og endre meldekort/i });
    expect(link).toBeVisible();
  });

  it('skal vise en informasjonsboks dersom meldekort ikke er klar til innsending, men kan fylles ut', () => {
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
      />
    );

    const alert = screen.getByText(
      'Du kan fylle ut meldekortet nå, men det kan tidligst sendes inn mandag 17. februar.'
    );
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
      />
    );

    const alert = screen.queryByText(
      'Du kan fylle ut meldekortet nå, men det kan tidligst sendes inn mandag 17. februar.'
    );
    expect(alert).not.toBeInTheDocument();
  });

  describe('julevarsel', () => {
    const FLAGG_PÅ = { flags: { InformerOmTidligMeldedag16Des26IMeldekortflaten: true } };
    const lagKommende = (fom: string, tom: string): KommendeMeldekort => ({
      antallUbesvarteMeldeperioder: 0,
      nesteMeldeperiode: {
        meldeperiode: { fom: '2026-12-07', tom },
        innsendingsvindu: { fom, tom: '2026-12-28' },
      },
    });
    const julTekst =
      'Du kan fylle ut meldekortet nå. Denne perioden kan du sende inn allerede fra onsdag 16. desember for å få utbetaling før jul.';
    const normalTekst = 'Du kan fylle ut meldekortet nå, men det kan tidligst sendes inn onsdag 16. desember.';

    it('viser julevarsel når flagget er på og innsending åpner før normal dato', () => {
      render(
        <Oversikt harInnsendteMeldeperioder={false} kommendeMeldeperiode={lagKommende('2026-12-16', '2026-12-20')} />,
        FLAGG_PÅ
      );
      expect(screen.getByText(julTekst)).toBeVisible();
    });

    it('viser vanlig varsel når flagget er av', () => {
      render(
        <Oversikt harInnsendteMeldeperioder={false} kommendeMeldeperiode={lagKommende('2026-12-16', '2026-12-20')} />
      );
      expect(screen.getByText(normalTekst)).toBeVisible();
    });

    it('viser vanlig varsel når innsending ikke åpner før normal dato', () => {
      render(
        <Oversikt harInnsendteMeldeperioder={false} kommendeMeldeperiode={lagKommende('2026-12-16', '2026-12-15')} />,
        FLAGG_PÅ
      );
      expect(screen.getByText(normalTekst)).toBeVisible();
      expect(screen.queryByText(julTekst)).not.toBeInTheDocument();
    });
  });
});
