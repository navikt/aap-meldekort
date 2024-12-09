import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Utfylling } from 'components/steg/utfylling/Utfylling';
import { userEvent } from '@testing-library/user-event';
import { eachDayOfInterval, format } from 'date-fns';
import { MeldekortResponse } from 'lib/types/types';

const meldeperiode: MeldekortResponse = {
  periode: { fom: '2024-11-18', tom: '2024-12-01' },
  meldekort: {
    timerArbeidet: [],
  },
  steg: 'TIMER_ARBEIDET',
};

const user = userEvent.setup();

describe('Utfylling', () => {
  beforeEach(() => render(<Utfylling meldeperiode={meldeperiode} referanse={'1'} />));

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
    const rapporteringskalender = screen.getByRole('heading', { name: 'Uke 47 - 48', level: 3 });
    expect(rapporteringskalender).toBeVisible();
  });

  it('skal vise en oppsummering av hvor mye som har blitt jobbet', () => {
    const oppsummering = screen.getByText('Sammenlagt for perioden');
    expect(oppsummering).toBeVisible();
  });

  it('skal ha et felt for å bekrefte at opplysningene stemmer', () => {
    const felt = screen.getByRole('checkbox', { name: 'Jeg bekrefter at disse opplysningene stemmer' });
    expect(felt).toBeVisible();
  });

  it('skal vise korrekt tekst på neste steg knapp', () => {
    const knapp = screen.getByRole('button', { name: 'Send inn' });
    expect(knapp).toBeVisible();
  });

  it('skal vise en feilmelding dersom feltet ikke er huket av', async () => {
    const knapp = screen.getByRole('button', { name: 'Send inn' });
    await user.click(knapp);

    const feilmelding = screen.getByText('Du må bekrefte at disse opplysningene stemmer');
    expect(feilmelding).toBeVisible();
  });
});

describe('rapporteringskalender', () => {
  it('skal vise ukenummer på perioden', () => {
    render(<Utfylling meldeperiode={meldeperiode} referanse={'1'} />);
    const ukenummer = screen.getByText('Uke 47 - 48');
    expect(ukenummer).toBeVisible();
  });

  it('skal vise fra dato og til dato for perioden', () => {
    render(<Utfylling meldeperiode={meldeperiode} referanse={'1'} />);
    const datoerForPerioden = screen.getByText('18.11.2024 - 01.12.2024');
    expect(datoerForPerioden).toBeVisible();
  });

  it('skal vise dagene i uken som tekst', () => {
    render(<Utfylling meldeperiode={meldeperiode} referanse={'1'} />);
    const mandag = screen.getByText('Man.');
    expect(mandag).toBeVisible();

    const tirsdag = screen.getByText('Tir.');
    expect(tirsdag).toBeVisible();

    const onsdag = screen.getByText('Ons.');
    expect(onsdag).toBeVisible();

    const torsdag = screen.getByText('Tor.');
    expect(torsdag).toBeVisible();

    const fredag = screen.getByText('Fre.');
    expect(fredag).toBeVisible();

    const lørdag = screen.getByText('Lør.');
    expect(lørdag).toBeVisible();

    const søndag = screen.getByText('Søn.');
    expect(søndag).toBeVisible();
  });

  it('skal vise 14 felter for å føre inn timer', () => {
    render(<Utfylling meldeperiode={meldeperiode} referanse={'1'} />);
    for (let i = 0; i < 14; i++) {
      const felt = screen.getByRole('textbox', { name: `dager.${i}.timer` });
      expect(felt).toBeVisible();
    }
  });
  it('skal vise datoen for de 14 feltene', () => {
    render(<Utfylling meldeperiode={meldeperiode} referanse={'1'} />);
    const datoer = eachDayOfInterval({
      start: new Date(meldeperiode.periode.fom),
      end: new Date(meldeperiode.periode.tom),
    });
    datoer.forEach((dato) => {
      const datoNummer = format(dato, 'd');
      const tekst = screen.getByText(`${datoNummer}.`);
      expect(tekst).toBeVisible();
    });
  });

  it('skal vise en feilmelding dersom bruker skriver inn et desimaltall som ikke er en hel eller halv time', async () => {
    render(<Utfylling meldeperiode={meldeperiode} referanse={'1'} />);

    const felt = screen.getByRole('textbox', { name: 'dager.0.timer' });
    await user.type(felt, '2.3');

    const checkbox = screen.getByRole('checkbox', {
      name: 'Jeg bekrefter at disse opplysningene stemmer',
    });

    await user.click(checkbox);

    const fullførKnapp = screen.getByRole('button', { name: 'Send inn' });
    await user.click(fullførKnapp);

    const feilmelding = screen.getByText(
      'Du må fylle inn et tall mellom 0 og 24, og kan bare være hele eller halve timer'
    );

    expect(feilmelding).toBeVisible();
  });

  it('skal vise en feilmelding dersom bruker skriver inn et tall som er over 24 timer', async () => {
    render(<Utfylling meldeperiode={meldeperiode} referanse={'1'} />);

    const felt = screen.getByRole('textbox', { name: 'dager.0.timer' });
    await user.type(felt, '25');

    const checkbox = screen.getByRole('checkbox', {
      name: 'Jeg bekrefter at disse opplysningene stemmer',
    });

    await user.click(checkbox);

    const fullførKnapp = screen.getByRole('button', { name: 'Send inn' });
    await user.click(fullførKnapp);

    const feilmelding = screen.getByText(
      'Du må fylle inn et tall mellom 0 og 24, og kan bare være hele eller halve timer'
    );

    expect(feilmelding).toBeVisible();
  });

  it('skal vise en feilmelding dersom bruker skriver inn et tall som ikke er et tall', async () => {
    render(<Utfylling meldeperiode={meldeperiode} referanse={'1'} />);

    const felt = screen.getByRole('textbox', { name: 'dager.0.timer' });
    await user.type(felt, 'attentimerogtredveminutter');

    const checkbox = screen.getByRole('checkbox', {
      name: 'Jeg bekrefter at disse opplysningene stemmer',
    });

    await user.click(checkbox);

    const fullførKnapp = screen.getByRole('button', { name: 'Send inn' });
    await user.click(fullførKnapp);

    const feilmelding = screen.getByText(
      'Du må fylle inn et tall mellom 0 og 24, og kan bare være hele eller halve timer'
    );

    expect(feilmelding).toBeVisible();
  });
});
