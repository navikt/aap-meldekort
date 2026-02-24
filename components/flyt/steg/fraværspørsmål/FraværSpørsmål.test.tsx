import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from 'lib/utils/test/customRender';
import { userEvent } from '@testing-library/user-event';
import { UtfyllingResponse } from 'lib/types/types';
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

const user = userEvent.setup();

describe('FraværSpørsmål', () => {
  beforeEach(() => {
    render(<FraværSpørsmål utfylling={meldekort} />);
  });

  it('har en overskrift', () => {
    expect(screen.getByRole('heading', { name: 'Fravær fra avtalt aktivitet', level: 2 })).toBeVisible();
  });

  it('viser dato og uker for perioden', () => {
    expect(screen.getByText('Uke 6 og 7 (02.02.2026 - 15.02.2026)')).toBeVisible();
  });

  it('spør bruker om de har gjennomført alle aktiviteter', () => {
    expect(
      screen.getByRole('group', { name: 'Har du gjennomført alle aktiviteter som er avtalt med oss?' })
    ).toBeVisible();
  });

  it('har valg for at bruker har gjennomført, ikke har gjennomført, og ikke har noen avtalte aktiviteter', () => {
    expect(screen.getByRole('radio', { name: 'Ja, jeg har gjennomført alle avtalte aktiviteter' })).toBeVisible();
    expect(screen.getByRole('radio', { name: 'Nei, jeg har ikke gjennomført alle avtalte aktiviteter' })).toBeVisible();
    expect(screen.getByRole('radio', { name: 'Jeg har ingen avtalte aktiviteter' })).toBeVisible();
  });

  it('viser en feilmelding dersom bruker ikke har svart på spørsmålet', async () => {
    await user.click(screen.getByRole('button', { name: 'Neste' }));
    expect(screen.getByText('Du må svare på om du har gjennomført alle avtalte aktiviteter')).toBeVisible();
  });
});
