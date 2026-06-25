import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from 'lib/utils/test/customRender';
import { userEvent } from '@testing-library/user-event';
import { UtfyllingResponse } from 'lib/types/types';
import createFetchMock from 'vitest-fetch-mock';
import { FraværSpørsmål } from 'components/flyt/steg/fraværspørsmål/FraværSpørsmål';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

const periode: UtfyllingResponse = {
  tilstand: {
    aktivtSteg: 'SPØRSMÅL',
    svar: {
      dager: [],
    },
  },
  metadata: {
    antallUbesvarteMeldeperioder: 1,
    kanSendesInn: true,
    periode: {
      fom: '2024-11-18',
      tom: '2024-12-01',
    },
    referanse: '123456789',
    visFrist: true,
  },
};

const user = userEvent.setup();

describe('FraværSpørsmål', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify({ message: 'Success' }), { status: 200 });
    render(<FraværSpørsmål utfylling={periode} />);
  });

  it('har en overskrift', () => {
    const heading = screen.getByRole('heading', { name: 'Aktivitet', level: 2 });
    expect(heading).toBeVisible();
  });

  it('skal vise dato og uker for perioden', () => {
    const tekst = screen.getByText('Uke 47 og 48 (18.11.2024 - 01.12.2024)');
    expect(tekst).toBeVisible();
  });

  it('spør om bruker har hatt avtalte aktiviteter i perioden', () => {
    expect(screen.getByRole('radiogroup', { name: 'Har du hatt avtalte aktiviteter i perioden?' })).toBeVisible();
  });

  it('har en beskrivelse av hva som menes med avtalt aktivitet', () => {
    expect(screen.getByRole('button', { name: 'Hva menes med avtalt aktivitet?' })).toBeVisible();
  });

  it('spørsmål om fravær vises ikke initielt', () => {
    expect(
      screen.queryByRole('radiogroup', { name: 'Var du borte fra noen av disse aktivitetene?' })
    ).not.toBeInTheDocument();
  });

  it('spørsmål om fravær vises ikke når bruker svarer nei på at de har hatt avtalte aktiviteter', async () => {
    await user.click(screen.getByRole('radio', { name: 'Nei' }));
    expect(
      screen.queryByRole('radiogroup', { name: 'Var du borte fra noen av disse aktivitetene?' })
    ).not.toBeInTheDocument();
  });

  it('spørsmål om fravær vises når bruker svarer ja på at de har hatt avtalte aktiviteter', async () => {
    await user.click(screen.getByRole('radio', { name: 'Ja' }));
    expect(screen.getByRole('radiogroup', { name: 'Var du borte fra noen av disse aktivitetene?' })).toBeVisible();
  });
});
