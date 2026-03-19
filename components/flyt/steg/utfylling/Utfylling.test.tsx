import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from 'lib/utils/test/customRender';
import { manglerTimerPåArbeid, Utfylling } from 'components/flyt/steg/utfylling/Utfylling';
import { UtfyllingResponse } from 'lib/types/types';
import createFetchMock from 'vitest-fetch-mock';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

const meldeperiode: UtfyllingResponse = {
  metadata: {
    antallUbesvarteMeldeperioder: 1,
    kanSendesInn: true,
    periode: { fom: '2024-11-18', tom: '2024-12-01' },
    referanse: '123456789',
    visFrist: true,
  },
  tilstand: {
    aktivtSteg: 'UTFYLLING',
    svar: {
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
  },
};

describe('Utfylling', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify({ message: 'Success' }), { status: 200 });
    render(<Utfylling utfylling={meldeperiode} />);
  });

  it('skal ha en heading', () => {
    const heading = screen.getByRole('heading', { name: 'Fyll ut meldekort', level: 2 });
    expect(heading).toBeVisible();
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
    render(<Utfylling utfylling={meldeperiode} />);
    const ukenummer = screen.getByText('Uke 47');
    expect(ukenummer).toBeVisible();
  });
});

describe('manglerTimerPåArbeid', () => {
  it('mangler ikke timer på arbeid dersom det er fylt ut noe som kan parses som et nummer', () => {
    expect(manglerTimerPåArbeid([{ dag: '2025-12-01', timer: '3,5' }], true)).toBe(false);
    expect(manglerTimerPåArbeid([{ dag: '2025-12-01', timer: '3.5' }], true)).toBe(false);
  })

  it('mangler ikke timer på arbeid dersom det er svart "nei" på at det er arbeidet', () => {
    expect(manglerTimerPåArbeid([], false)).toBe(false);
  })

  it('mangler timer på arbeid dersom det er svart ja på arbeid uten at det er fylt ut noen timer', () => {
    expect(manglerTimerPåArbeid([], true)).toBe(true);
  });

  // denne burde ikke være så relevant da det blir håndtert i validering av hvert enkelt felt
  it('mangler timer på arbeid dersom det er fylt ut en ugyldig timeverdi', () => {
    expect(manglerTimerPåArbeid([{ dag: '2025-12-01', timer: 'tre og en halv' }], true)).toBe(true);
  })

  it('mangler timer på arbeid hvis timeantall er null', () => {
    expect(manglerTimerPåArbeid([{ dag: '2025-12-01', timer: null }], true)).toBe(true);
  })
});