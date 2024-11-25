import { beforeEach, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithStegContext } from 'lib/utils/TestUtil';
import { Utfylling } from 'components/steg/utfylling/Utfylling';
import { userEvent } from '@testing-library/user-event';
import { PeriodeType } from 'components/rapporteringskalender/Rapporteringskalender';
import { eachDayOfInterval, format } from 'date-fns';

const periode: PeriodeType = {
  periode: { fraDato: '2024-11-18', tilDato: '2024-12-01' },
};

const user = userEvent.setup();

describe('Utfylling', () => {
  beforeEach(() => renderWithStegContext(<Utfylling periode={periode} readOnly={false} />));

  it('skal ha en heading', () => {
    const heading = screen.getByRole('heading', { name: 'Fyll ut meldekortet', level: 2 });
    expect(heading).toBeVisible();
  });

  it('skal ha en tekst som forklarer utfylling', () => {
    const tekst = screen.getByText(
      'Fyll inn timene du har arbeidet i perioden. Timer skrives med desimal til nærmeste kvarter. 7 timer og 30 min = 7,5 timer. 15 min = 0,25 timer'
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
    renderWithStegContext(<Utfylling periode={periode} readOnly={false} />);
    const ukenummer = screen.getByText('Uke 47 - 48');
    expect(ukenummer).toBeVisible();
  });

  it('skal vise fra dato og til dato for perioden', () => {
    renderWithStegContext(<Utfylling periode={periode} readOnly={false} />);
    const datoerForPerioden = screen.getByText('18.11.2024 - 01.12.2024');
    expect(datoerForPerioden).toBeVisible();
  });

  it('skal vise dagene i uken som tekst', () => {
    renderWithStegContext(<Utfylling periode={periode} readOnly={false} />);
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
    renderWithStegContext(<Utfylling periode={periode} readOnly={false} />);
    for (let i = 0; i < 14; i++) {
      const felt = screen.getByRole('textbox', { name: `dager.${i}.timer` });
      expect(felt).toBeVisible();
    }
  });
  it('skal vise datoen for de 14 feltene', () => {
    renderWithStegContext(<Utfylling periode={periode} readOnly={false} />);
    const datoer = eachDayOfInterval({
      start: new Date(periode.periode.fraDato),
      end: new Date(periode.periode.tilDato),
    });
    datoer.forEach((dato) => {
      const datoNummer = format(dato, 'd');
      const tekst = screen.getByText(`${datoNummer}.`);
      expect(tekst).toBeVisible();
    });
  });

  it('skal ikke ha noen input felt for føring av timer dersom det ikke er redigerbart', () => {
    renderWithStegContext(<Utfylling periode={periode} readOnly={true} />);
    for (let i = 0; i < 14; i++) {
      const felt = screen.queryByRole('textbox', { name: `dager.${i}.timer` });
      expect(felt).not.toBeInTheDocument();
    }
  });
});
