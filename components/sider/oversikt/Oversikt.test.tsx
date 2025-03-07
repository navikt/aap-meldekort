import { describe, expect, it } from 'vitest';
import { KommendeMeldekort } from 'lib/types/types';
import { render, screen } from 'lib/utils/test/customRender';
import { Oversikt } from 'components/sider/oversikt/Oversikt';

const kommendeMeldekort: KommendeMeldekort = {
  antallUbesvarteMeldeperioder: 1,
  nesteMeldeperiode: {
    meldeperiode: { fom: '2025-02-17', tom: '2025-03-03' },
    innsendingsvindu: { fom: '2025-02-17', tom: '2025-03-03' },
  },
};

describe('Oversikt', () => {
  it('skal vise en tekst om at det ikke finnes en meldeperiode som er klar for utfylling dersom det ikke finnes ', () => {
    render(<Oversikt harInnsendteMeldeperioder={false} />);
    const text = screen.getByText(
      'Du har ingen meldekort å sende inn nå. Vi sender deg en melding når det er klart for utfylling.'
    );
    expect(text).toBeVisible();
  });

  it('skal ikke vise navigering til innsendte meldekort dersom der ikke finnes noen innesndte meldeperioder', () => {
    render(<Oversikt harInnsendteMeldeperioder={false} />);

    const link = screen.queryByRole('link', { name: /se og endre meldekort/i });
    expect(link).not.toBeInTheDocument();
  });

  it('skal vise en button til neste utfylling dersom det finnes', () => {
    render(<Oversikt harInnsendteMeldeperioder={false} kommendeMeldeperiode={kommendeMeldekort} />);
    const button = screen.getByText('Send meldekort for uke 8 - 10');
    expect(button).toBeVisible();
  });

  it('skal vise en lenke til tidligere innsendte meldeperioder dersom det finnes', () => {
    render(<Oversikt harInnsendteMeldeperioder={true} kommendeMeldeperiode={kommendeMeldekort} />);
    const link = screen.getByRole('link', { name: /se og endre meldekort/i });
    expect(link).toBeVisible();
  });
});
