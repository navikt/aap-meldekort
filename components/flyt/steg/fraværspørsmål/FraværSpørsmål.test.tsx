import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Spørsmål } from 'components/flyt/steg/spørsmål/Spørsmål';
import { render, screen, within } from 'lib/utils/test/customRender';
import { userEvent } from '@testing-library/user-event';
import { UtfyllingResponse } from 'lib/types/types';
import createFetchMock from 'vitest-fetch-mock';
import { FraværSpørsmål } from 'components/flyt/steg/fraværspørsmål/FraværSpørsmål';

const meldekort: UtfyllingResponse = {
  tilstand: {
    aktivtSteg: 'FRAVÆR_SPØRSMÅL',
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

describe('FraværSpørsmål', () => {
  beforeEach(() => {
    render(<FraværSpørsmål utfylling={meldekort} />);
  });

  it('har en overskrift', () => {
    expect(
      screen.getByRole('heading', { name: 'Hvilke dager var du borte fra avtalt aktivitet?', level: 2 })
    ).toBeVisible();
  });

  it('viser dato og uker for perioden', () => {
    expect(screen.getByText('Uke 6 og 7 (02.02.2026 - 15.02.2026)')).toBeVisible();
  });

  it('viser beskrivelse av steget', () => {
    expect(
      screen.getByText('Du melder kun inn aktiviteter som er i aktivitetsplanen og avtalt med Nav.')
    ).toBeVisible();
  });

  it('kan legge til dager', () => {
    expect(screen.getByRole('button', { name: 'Legg til dag' })).toBeVisible();
  });
});
