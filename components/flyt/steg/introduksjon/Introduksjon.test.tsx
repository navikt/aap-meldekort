import { render, screen } from 'lib/utils/test/customRender';
import { describe, expect, it } from 'vitest';
import { Introduksjon } from 'components/flyt/steg/introduksjon/Introduksjon';
import { UtfyllingResponse } from 'lib/types/types';

const utfylling: UtfyllingResponse = {
  metadata: {
    antallUbesvarteMeldeperioder: 1,
    kanSendesInn: true,
    periode: {
      fom: '2024-11-18',
      tom: '2024-12-01',
    },
    referanse: '123456789',
    fristForInnsending: '2024-12-09',
    tidligsteInnsendingstidspunkt: '2024-12-02',
    harBrukerVedtakIKelvin: true
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
    render(<Introduksjon utfylling={utfylling} referanse={'1234'} />);
    const heading = screen.getByRole('heading', { name: 'Meldekort for uke 47 og 48' });
    expect(heading).toBeVisible();
  });

  it('skal vise en meldeperioden med dato', () => {
    render(<Introduksjon utfylling={utfylling} referanse={'1234'} />);
    const meldeperiode = screen.getByText('18.11.2024 - 01.12.2024');
    expect(meldeperiode).toBeVisible();
  });

  it('skal ha en lenke til en side som opplyser om viktigheten av å gi riktige opplysninger ', () => {
    render(<Introduksjon utfylling={utfylling} referanse={'1234'} />);
    const link = screen.getByRole('link', { name: 'Les mer om viktigheten av å gi riktige opplysninger' });
    expect(link).toBeVisible();
  });

  it('skal ha en knapp for å gå videre til neste steg', () => {
    render(<Introduksjon utfylling={utfylling} referanse={'1234'} />);
    const button = screen.getByRole('button', { name: 'Neste' });
    expect(button).toBeVisible();
  });

  it('skal ha en lenke tilbake til oversikt siden', () => {
    render(<Introduksjon utfylling={utfylling} referanse={'1234'} />);
    const link = screen.getByRole('link', { name: 'Tilbake til oversikten' });
    expect(link).toBeVisible();
  });

  it('skal vise kulepunkt med informasjon om innsendingsdatoer og utbetaling', () => {
    render(<Introduksjon utfylling={utfylling} referanse={'1234'} />);
    const kulepunkt1 = screen.getByText(
      'Du kan sende dette meldekortet fra 2. desember, og senest 9. desember for å unngå trekk i utbetalingen.'
    );
    const kulepunkt2 = screen.getByText(
      'Du vil få utbetalt AAP cirka 2 til 3 virkedager etter at du har levert meldekortet.'
    );
    expect(kulepunkt1).toBeVisible();
    expect(kulepunkt2).toBeVisible();
  });
});
