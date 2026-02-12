import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from 'lib/utils/test/customRender';
import { Utfylling } from 'components/flyt/steg/utfylling/Utfylling';
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
