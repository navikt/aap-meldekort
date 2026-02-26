import { FraværUtfylling } from 'components/flyt/steg/fraværutfylling/FraværUtfylling';
import { UtfyllingResponse } from 'lib/types/types';
import { render, screen } from 'lib/utils/test/customRender';
import { beforeEach, describe, expect, it } from 'vitest';

const meldekort: UtfyllingResponse = {
  metadata: {
    referanse: '13fd8128-9aac-4bc5-a28a-a5e9cb4dd53c',
    periode: {
      fom: '2025-12-13',
      tom: '2025-12-21',
    },
    antallUbesvarteMeldeperioder: 1,
    kanSendesInn: true,
    visFrist: true,
  },
  tilstand: {
    aktivtSteg: 'FRAVÆR_UTFYLLING',
    svar: {
      dager: [
        {
          dato: '2025-12-13',
          timerArbeidet: 0,
          fravær: null,
        },
        {
          dato: '2025-12-14',
          timerArbeidet: 0,
          fravær: null,
        },
        {
          dato: '2025-12-15',
          timerArbeidet: 0,
          fravær: null,
        },
        {
          dato: '2025-12-16',
          timerArbeidet: 0,
          fravær: null,
        },
        {
          dato: '2025-12-17',
          timerArbeidet: 0,
          fravær: null,
        },
        {
          dato: '2025-12-18',
          timerArbeidet: 0,
          fravær: null,
        },
        {
          dato: '2025-12-19',
          timerArbeidet: 0,
          fravær: null,
        },
        {
          dato: '2025-12-20',
          timerArbeidet: 0,
          fravær: null,
        },
        {
          dato: '2025-12-21',
          timerArbeidet: 0,
          fravær: null,
        },
      ],
    },
  },
};
describe('Fravær utfylling', () => {
  beforeEach(() => {
    render(<FraværUtfylling utfylling={meldekort} />);
  });

  it('viser en overskrift', () => {
    expect(
      screen.getByRole('heading', { name: 'Hvilke dager var du borte fra avtalt aktivitet?', level: 2 })
    ).toBeVisible();
  });

  it('viser hvilken periode det gjelder', () => {
    expect(screen.getByText('Uke 50 og 51 (13.12.2025 - 21.12.2025)')).toBeVisible();
  });

  it('viser en beskrivelse på hva bruker skal gjøre', () => {
    expect(
      screen.getByText('Du melder kun inn aktiviteter som er i aktivitetsplanen og avtalt med Nav.')
    ).toBeVisible();
  });

  it('har en knapp for å legge til en dag med fravær', () => {
    expect(screen.getByRole('button', { name: 'Legg til dag' })).toBeVisible();
  });
});
