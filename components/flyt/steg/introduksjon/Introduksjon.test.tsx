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
});

describe('når bruker har en søknad som er under behandling', () => {
  const utfyllingMedSøknadUnderBehandling = { ...utfylling };
  utfyllingMedSøknadUnderBehandling.metadata.harBrukerSakUnderBehandling = true;

  it('viser en melding om at bruker kan sende inn x antall meldekort', () => {
    render(<Introduksjon utfylling={utfyllingMedSøknadUnderBehandling} referanse={'1234'} />);
    expect(screen.queryByText('Du har 1 meldekort å sende inn.')).not.toBeInTheDocument();
    expect(screen.getByText('Du kan sende inn 1 meldekort.')).toBeVisible();
  });

  it('viser en melding om at bruker ikke har vedtak om AAP, men kan sende inn meldekort hvis de vil', () => {
    render(<Introduksjon utfylling={utfyllingMedSøknadUnderBehandling} referanse={'1234'} />);
    expect(
      screen.getByText('Du har ikke fått vedtak om AAP, men du kan sende inn meldekortet hvis du vil.')
    ).toBeVisible();
  });

  it('vises ikke melding om frist', () => {
    render(<Introduksjon utfylling={utfyllingMedSøknadUnderBehandling} referanse={'1234'} />);
    expect(screen.queryByText(/^Du kan sende dette meldekortet/)).not.toBeInTheDocument();
  });
});
