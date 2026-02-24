import { FraværUtfylling } from 'components/flyt/steg/fraværutfylling/FraværUtfylling';
import { UtfyllingResponse } from 'lib/types/types';
import { render, screen } from 'lib/utils/test/customRender';
import { beforeEach, describe, expect, it } from 'vitest';

const meldekort: UtfyllingResponse = {
  tilstand: {
    aktivtSteg: 'FRAVÆR_UTFYLLING',
    svar: {
      dager: [],
    },
  },
  metadata: {
    antallUbesvarteMeldeperioder: 1,
    kanSendesInn: true,
    periode: {
      fom: '2026-02-02',
      tom: '2026-02-15',
    },
    referanse: '1234567',
    visFrist: false,
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
    expect(screen.getByText('Uke 6 og 7 (02.02.2026 - 15.02.2026)')).toBeVisible();
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
