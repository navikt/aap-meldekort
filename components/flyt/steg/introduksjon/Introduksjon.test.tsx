import { render, screen } from 'lib/utils/test/customRender';
import { describe, expect, it } from 'vitest';
import { Introduksjon } from 'components/flyt/steg/introduksjon/Introduksjon';
import { UtfyllingResponse } from 'lib/types/types';

const meldekort: UtfyllingResponse = {
  metadata: {
    periode: {
      fom: '2024-11-18',
      tom: '2024-12-01',
    },
    referanse: '123456789',
  },
  tilstand: {
    aktivtSteg: 'INTRODUKSJON',
    svar: {
      dager: [],
    },
  },
};

describe('generelt', () => {
  it('skal vise en heading med meldeperioden', () => {
    render(<Introduksjon utfylling={meldekort} referanse={'1234'} />);
    const heading = screen.getByRole('heading', { name: 'Meldekort for uke 47 - 48' });
    expect(heading).toBeVisible();
  });

  it('skal vise en meldeperioden med dato', () => {
    render(<Introduksjon utfylling={meldekort} referanse={'1234'} />);
    const meldeperiode = screen.getByText('18.11.2024 - 01.12.2024');
    expect(meldeperiode).toBeVisible();
  });

  it('skal ha en lenke til en side som opplyser om viktigheten av å gi riktige opplysninger ', () => {
    render(<Introduksjon utfylling={meldekort} referanse={'1234'} />);
    const link = screen.getByRole('link', { name: 'Les mer om viktigheten av å gi riktige opplysninger' });
    expect(link).toBeVisible();
  });

  it('skal ha en knapp for å gå videre til neste steg', () => {
    render(<Introduksjon utfylling={meldekort} referanse={'1234'} />);
    const button = screen.getByRole('button', { name: 'Neste' });
    expect(button).toBeVisible();
  });
});
