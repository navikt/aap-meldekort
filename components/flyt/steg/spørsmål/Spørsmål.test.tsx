import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Spørsmål } from 'components/flyt/steg/spørsmål/Spørsmål';
import { render, screen, waitFor, within } from 'lib/utils/test/customRender';
import { userEvent } from '@testing-library/user-event';
import { Svar } from 'lib/types/types';
import createFetchMock from 'vitest-fetch-mock';
import { byggUtfylling } from 'lib/utils/test/testdata';
import { mellomlagringSpion } from 'lib/utils/test/mellomlagring';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

const lagring = mellomlagringSpion(fetchMock);

const user = userEvent.setup();

function renderSpørsmål(svar: Partial<Svar> = {}) {
  return render(<Spørsmål utfylling={byggUtfylling(svar)} />);
}

function harDuJobbetGruppe() {
  return screen.getByRole('radiogroup', { name: 'Har du arbeidet i perioden?' });
}

describe('Spørsmål', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify({ type: 'SUCCESS', status: 200, data: {} }), { status: 200 });
  });

  it('Skal ha en heading', () => {
    renderSpørsmål();
    const heading = screen.getByRole('heading', { name: 'Arbeid', level: 2 });
    expect(heading).toBeVisible();
  });

  it('skal vise dato og uker for perioden', () => {
    renderSpørsmål();
    const tekst = screen.getByText('Uke 47 og 48 (18.11.2024 - 01.12.2024)');
    expect(tekst).toBeVisible();
  });

  it('skal vise korrekt tekst på neste knapp', () => {
    renderSpørsmål();
    const nesteStegKnapp = screen.getByRole('button', { name: 'Neste' });
    expect(nesteStegKnapp).toBeVisible();
  });

  it('skal ha et felt for om bruker har arbeidet i perioden', () => {
    renderSpørsmål();
    expect(harDuJobbetGruppe()).toBeVisible();
  });

  it('skal ha Ja og Nei som options', () => {
    renderSpørsmål();
    const felt = harDuJobbetGruppe();
    const jaOption = within(felt).getByRole('radio', { name: 'Ja' });
    expect(jaOption).toBeVisible();

    const neiOption = within(felt).getByRole('radio', { name: 'Nei' });
    expect(neiOption).toBeVisible();
  });

  it('skal vise en feilmelding dersom feltet ikke er besvart', async () => {
    renderSpørsmål();
    const fullførKnapp = screen.getByRole('button', { name: 'Neste' });
    await user.click(fullførKnapp);
    const feilmelding = screen.getByText('Du må svare på om du har arbeidet i perioden.');
    expect(feilmelding).toBeVisible();
  });

  describe('mellomlagring av ubesvart felt', () => {
    it('mellomlagrer ikke når harDuJobbet er ubesvart (undefined)', () => {
      renderSpørsmål();
      expect(lagring.antall()).toBe(0);
    });

    it('mellomlagrer ikke når harDuJobbet er null', () => {
      renderSpørsmål({ harDuJobbet: null });
      expect(lagring.antall()).toBe(0);
    });

    it('mellomlagrer harDuJobbet: false når bruker svarer Nei', async () => {
      renderSpørsmål();
      await user.click(within(harDuJobbetGruppe()).getByRole('radio', { name: 'Nei' }));

      await waitFor(() => expect(lagring.antall()).toBe(1));
      expect(lagring.body()).toMatchObject({ nyTilstand: { svar: { harDuJobbet: false } } });
    });

    it('mellomlagrer harDuJobbet: true når bruker svarer Ja', async () => {
      renderSpørsmål();
      await user.click(within(harDuJobbetGruppe()).getByRole('radio', { name: 'Ja' }));

      await waitFor(() => expect(lagring.antall()).toBe(1));
      expect(lagring.body()).toMatchObject({ nyTilstand: { svar: { harDuJobbet: true } } });
    });

    it('mellomlagrer siste valg når bruker bytter fra Ja til Nei', async () => {
      renderSpørsmål();
      const felt = harDuJobbetGruppe();

      await user.click(within(felt).getByRole('radio', { name: 'Ja' }));
      await waitFor(() => expect(lagring.antall()).toBe(1));

      await user.click(within(felt).getByRole('radio', { name: 'Nei' }));
      await waitFor(() => expect(lagring.antall()).toBe(2));

      expect(lagring.sisteBody()).toMatchObject({ nyTilstand: { svar: { harDuJobbet: false } } });
    });
  });

  describe('rehydrering av lagret svar', () => {
    it('viser ingen valgt radio når harDuJobbet er ubesvart', () => {
      renderSpørsmål();
      const felt = harDuJobbetGruppe();

      expect(within(felt).getByRole('radio', { name: 'Ja' })).not.toBeChecked();
      expect(within(felt).getByRole('radio', { name: 'Nei' })).not.toBeChecked();
    });

    it('viser Nei som valgt når harDuJobbet er false', async () => {
      renderSpørsmål({ harDuJobbet: false });
      const felt = harDuJobbetGruppe();

      // Et besvart felt mellomlagres ved mount; vent på at kallet settler.
      await waitFor(() => expect(lagring.antall()).toBe(1));

      expect(within(felt).getByRole('radio', { name: 'Nei' })).toBeChecked();
      expect(within(felt).getByRole('radio', { name: 'Ja' })).not.toBeChecked();
    });

    it('viser Ja som valgt når harDuJobbet er true', async () => {
      renderSpørsmål({ harDuJobbet: true });
      const felt = harDuJobbetGruppe();

      await waitFor(() => expect(lagring.antall()).toBe(1));

      expect(within(felt).getByRole('radio', { name: 'Ja' })).toBeChecked();
      expect(within(felt).getByRole('radio', { name: 'Nei' })).not.toBeChecked();
    });
  });
});
