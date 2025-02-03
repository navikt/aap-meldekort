import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Utfylling } from 'components/flyt/innsending/steg/timerarbeidet/Utfylling';
import { userEvent } from '@testing-library/user-event';
import { eachDayOfInterval, format } from 'date-fns';
import { MeldekortResponse } from 'lib/types/types';
import { nb } from 'date-fns/locale/nb';

const meldeperiode: MeldekortResponse = {
  periode: { fom: '2024-11-18', tom: '2024-12-01' },
  meldekort: {
    timerArbeidet: [
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
  },
  steg: 'TIMER_ARBEIDET',
};

const user = userEvent.setup();

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

  it('skal vise dagene i uken som tekst', () => {
    render(<Utfylling meldekort={meldeperiode} referanse={'1'} />);
    const mandag = screen.getAllByText('ma.')[0];
    expect(mandag).toBeVisible();

    const tirsdag = screen.getAllByText('ti.')[0];
    expect(tirsdag).toBeVisible();

    const onsdag = screen.getAllByText('on.')[0];
    expect(onsdag).toBeVisible();

    const torsdag = screen.getAllByText('to.')[0];
    expect(torsdag).toBeVisible();

    const fredag = screen.getAllByText('fr.')[0];
    expect(fredag).toBeVisible();

    const lørdag = screen.getAllByText('lø.')[0];
    expect(lørdag).toBeVisible();

    const søndag = screen.getAllByText('sø.')[0];
    expect(søndag).toBeVisible();
  });

  it('skal vise 14 felter for å føre inn timer', () => {
    render(<Utfylling meldekort={meldeperiode} referanse={'1'} />);
    for (let i = 0; i < 14; i++) {
      const labelTekst = finnLabeltekst(meldeperiode.meldekort.timerArbeidet[i].dato);
      const felt = screen.getByRole('textbox', { name: labelTekst });
      expect(felt).toBeVisible();
    }
  });
  it('skal vise datoen for de 14 feltene', () => {
    render(<Utfylling meldekort={meldeperiode} referanse={'1'} />);
    const datoer = eachDayOfInterval({
      start: new Date(meldeperiode.periode.fom),
      end: new Date(meldeperiode.periode.tom),
    });
    datoer.forEach((dato) => {
      const datoNummer = format(dato, 'd');
      const tekst = screen.getByText(`${datoNummer}`);
      expect(tekst).toBeVisible();
    });
  });

  it('skal vise en feilmelding dersom bruker skriver inn et desimaltall som ikke er en hel eller halv time', async () => {
    render(<Utfylling meldekort={meldeperiode} referanse={'1'} />);
    const labelTekst = finnLabeltekst(meldeperiode.meldekort.timerArbeidet[0].dato);
    const felt = screen.getByRole('textbox', { name: labelTekst });
    await user.type(felt, '2.3');

    const fullførKnapp = screen.getByRole('button', { name: 'Neste' });
    await user.click(fullførKnapp);

    const feilmelding = screen.getByText(
      'Du må fylle inn et tall mellom 0 og 24, og kan bare være hele eller halve timer'
    );

    expect(feilmelding).toBeVisible();
  });

  it('skal vise en feilmelding dersom bruker skriver inn et tall som er over 24 timer', async () => {
    render(<Utfylling meldekort={meldeperiode} referanse={'1'} />);

    const labelTekst = finnLabeltekst(meldeperiode.meldekort.timerArbeidet[0].dato);
    const felt = screen.getByRole('textbox', { name: labelTekst });
    await user.type(felt, '25');

    const fullførKnapp = screen.getByRole('button', { name: 'Neste' });
    await user.click(fullførKnapp);

    const feilmelding = screen.getByText(
      'Du må fylle inn et tall mellom 0 og 24, og kan bare være hele eller halve timer'
    );

    expect(feilmelding).toBeVisible();
  });

  it('skal vise en feilmelding dersom bruker skriver inn et tall som ikke er et tall', async () => {
    render(<Utfylling meldekort={meldeperiode} referanse={'1'} />);

    const labelTekst = finnLabeltekst(meldeperiode.meldekort.timerArbeidet[0].dato);
    const felt = screen.getByRole('textbox', { name: labelTekst });
    await user.type(felt, 'attentimerogtredveminutter');

    const fullførKnapp = screen.getByRole('button', { name: 'Neste' });
    await user.click(fullførKnapp);

    const feilmelding = screen.getByText(
      'Du må fylle inn et tall mellom 0 og 24, og kan bare være hele eller halve timer'
    );

    expect(feilmelding).toBeVisible();
  });
});

function finnLabeltekst(dato: string): string {
  const førsteDag = new Date(dato);
  return format(førsteDag, 'eeee do MMMM', { locale: nb });
}
