import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from 'lib/utils/test/customRender';
import { userEvent } from '@testing-library/user-event';
import type { Svar } from 'lib/types/types';
import createFetchMock from 'vitest-fetch-mock';
import { FraværSpørsmål } from 'components/flyt/steg/fraværspørsmål/FraværSpørsmål';
import { byggUtfylling } from 'lib/utils/test/testdata';
import { mellomlagringSpion } from 'lib/utils/test/mellomlagring';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

const lagring = mellomlagringSpion(fetchMock);

const user = userEvent.setup();

function renderFraværSpørsmål(svar: Partial<Svar> = {}) {
  return render(<FraværSpørsmål utfylling={byggUtfylling(svar, { aktivtSteg: 'FRAVÆR_SPØRSMÅL' })} />);
}

function aktiviteterGruppe() {
  return screen.getByRole('radiogroup', { name: 'Har du hatt avtalte aktiviteter i perioden?' });
}

describe('FraværSpørsmål', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify({ type: 'SUCCESS', status: 200, data: {} }), { status: 200 });
  });

  it('har en overskrift', () => {
    renderFraværSpørsmål();
    const heading = screen.getByRole('heading', { name: 'Aktivitet', level: 2 });
    expect(heading).toBeVisible();
  });

  it('skal vise dato og uker for perioden', () => {
    renderFraværSpørsmål();
    const tekst = screen.getByText('Uke 47 og 48 (18.11.2024 - 01.12.2024)');
    expect(tekst).toBeVisible();
  });

  it('spør om bruker har hatt avtalte aktiviteter i perioden', () => {
    renderFraværSpørsmål();
    expect(aktiviteterGruppe()).toBeVisible();
  });

  it('har en beskrivelse av hva som menes med avtalt aktivitet', () => {
    renderFraværSpørsmål();
    expect(screen.getByRole('button', { name: 'Hva menes med avtalt aktivitet?' })).toBeVisible();
  });

  it('spørsmål om fravær vises ikke initielt', () => {
    renderFraværSpørsmål();
    expect(
      screen.queryByRole('radiogroup', { name: 'Var du borte fra noen av disse aktivitetene?' })
    ).not.toBeInTheDocument();
  });

  it('spørsmål om fravær vises ikke når bruker svarer nei på at de har hatt avtalte aktiviteter', async () => {
    renderFraværSpørsmål();
    await user.click(screen.getByRole('radio', { name: 'Nei' }));
    expect(
      screen.queryByRole('radiogroup', { name: 'Var du borte fra noen av disse aktivitetene?' })
    ).not.toBeInTheDocument();
  });

  it('spørsmål om fravær vises når bruker svarer ja på at de har hatt avtalte aktiviteter', async () => {
    renderFraværSpørsmål();
    await user.click(screen.getByRole('radio', { name: 'Ja' }));
    expect(screen.getByRole('radiogroup', { name: 'Var du borte fra noen av disse aktivitetene?' })).toBeVisible();
  });

  describe('mellomlagring av ubesvart felt', () => {
    it('mellomlagrer ikke når harDuHattAvtalteAktiviteter er ubesvart (undefined)', () => {
      renderFraværSpørsmål();
      expect(lagring.antall()).toBe(0);
    });

    it('mellomlagrer ikke når harDuHattAvtalteAktiviteter er null', () => {
      renderFraværSpørsmål({ harDuHattAvtalteAktiviteter: null });
      expect(lagring.antall()).toBe(0);
    });

    it('mellomlagrer harDuHattAvtalteAktiviteter: false når bruker svarer Nei', async () => {
      renderFraværSpørsmål();
      await user.click(within(aktiviteterGruppe()).getByRole('radio', { name: 'Nei' }));

      await waitFor(() => expect(lagring.antall()).toBe(1));
      expect(lagring.sisteBody()).toMatchObject({
        nyTilstand: { svar: { harDuHattAvtalteAktiviteter: false } },
      });
    });

    it('mellomlagrer harDuHattAvtalteAktiviteter: true når bruker svarer Ja', async () => {
      renderFraværSpørsmål();
      await user.click(within(aktiviteterGruppe()).getByRole('radio', { name: 'Ja' }));

      await waitFor(() => expect(lagring.antall()).toBe(1));
      expect(lagring.sisteBody()).toMatchObject({
        nyTilstand: { svar: { harDuHattAvtalteAktiviteter: true } },
      });
    });

    it('mellomlagrer harDuHattFravær når bruker svarer på oppfølgingsspørsmålet', async () => {
      renderFraværSpørsmål();
      await user.click(within(aktiviteterGruppe()).getByRole('radio', { name: 'Ja' }));

      const fraværGruppe = await screen.findByRole('radiogroup', {
        name: 'Var du borte fra noen av disse aktivitetene?',
      });
      await user.click(within(fraværGruppe).getByRole('radio', { name: 'Ja' }));

      await waitFor(() =>
        expect(lagring.sisteBody()).toMatchObject({
          nyTilstand: { svar: { harDuHattAvtalteAktiviteter: true, harDuHattFravær: true } },
        })
      );
    });
  });

  describe('rehydrering av lagret svar', () => {
    it('viser ingen valgt radio når harDuHattAvtalteAktiviteter er ubesvart', () => {
      renderFraværSpørsmål();
      const felt = aktiviteterGruppe();

      expect(within(felt).getByRole('radio', { name: 'Ja' })).not.toBeChecked();
      expect(within(felt).getByRole('radio', { name: 'Nei' })).not.toBeChecked();
    });

    it('viser Nei som valgt når harDuHattAvtalteAktiviteter er false', async () => {
      renderFraværSpørsmål({ harDuHattAvtalteAktiviteter: false });
      const felt = aktiviteterGruppe();

      await waitFor(() => expect(lagring.antall()).toBe(1));

      expect(within(felt).getByRole('radio', { name: 'Nei' })).toBeChecked();
      expect(within(felt).getByRole('radio', { name: 'Ja' })).not.toBeChecked();
    });
  });
});
