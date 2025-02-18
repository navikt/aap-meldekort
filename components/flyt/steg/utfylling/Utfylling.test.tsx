import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from 'lib/utils/test/customRender';
import { Utfylling } from 'components/flyt/steg/utfylling/Utfylling';
import { MeldekortResponse } from 'lib/types/types';

const meldeperiode: MeldekortResponse = {
  periode: { fom: '2024-11-18', tom: '2024-12-01' },
  meldekort: {
    dager: [
      { dato: '2024-11-18' },
      { dato: '2024-11-19' },
      { dato: '2024-11-20' },
      { dato: '2024-11-21' },
      { dato: '2024-11-22' },
      { dato: '2024-11-23' },
      { dato: '2024-11-24' },
      { dato: '2024-11-25' },
      { dato: '2024-11-26' },
      { dato: '2024-11-27' },
      { dato: '2024-11-28' },
      { dato: '2024-11-29' },
      { dato: '2024-11-30' },
      { dato: '2024-12-01' },
    ],
    harDuJobbet: true,
  },
  steg: 'UTFYLLING',
  tidligsteInnsendingsDato: '2024-11-18',
};

describe('Utfylling', () => {
  beforeEach(() => render(<Utfylling meldekort={meldeperiode} referanse={'1'} />));

  it('skal ha en heading', () => {
    const heading = screen.getByRole('heading', { name: 'Fyll ut meldekortet', level: 2 });
    expect(heading).toBeVisible();
  });

  it('skal ha en tekst som forklarer utfylling', () => {
    const tekst = screen.getByText(
      'Fyll inn timene du har arbeidet i perioden. Timer skrives med desimal til nærmeste halvtime. 7 timer og 30 min = 7,5 timer. 30 min = 0,50 timer'
    );

    expect(tekst).toBeVisible();
  });

  it('skal ha en readmore som forklarer hva som skal fylles ut', () => {
    const readMore = screen.getByText('Les mer om hva som skal fylles ut');
    expect(readMore).toBeVisible();
  });

  it('skal vise en rapporteringskalender', () => {
    const rapporteringskalender = screen.getByRole('heading', { name: 'Uke 47', level: 3 });
    expect(rapporteringskalender).toBeVisible();
  });

  it('skal vise en oppsummering av hvor mye som har blitt jobbet', () => {
    const oppsummering = screen.getByText('Sammenlagt for perioden');
    expect(oppsummering).toBeVisible();
  });

  it('skal vise korrekt tekst på neste steg knapp', () => {
    const knapp = screen.getByRole('button', { name: 'Neste' });
    expect(knapp).toBeVisible();
  });
});

describe('rapporteringskalender', () => {
  it('skal vise ukenummer på perioden', () => {
    render(<Utfylling meldekort={meldeperiode} referanse={'1'} />);
    const ukenummer = screen.getByText('Uke 47');
    expect(ukenummer).toBeVisible();
  });

  it('skal vise fra dato og til dato for perioden', () => {
    render(<Utfylling meldekort={meldeperiode} referanse={'1'} />);
    const datoerForPerioden = screen.getByText('18.11.2024 - 24.11.2024');
    expect(datoerForPerioden).toBeVisible();
  });
});

it('skal ha en lenke for å gå tilbake til forrige steg', () => {
  render(<Utfylling meldekort={meldeperiode} referanse={'1'} />);
  const tilbakeLenke = screen.getByRole('link', { name: 'Tilbake' });
  expect(tilbakeLenke).toBeVisible();
});
