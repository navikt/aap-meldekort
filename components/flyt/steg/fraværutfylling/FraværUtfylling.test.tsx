import { FraværUtfylling } from 'components/flyt/steg/fraværutfylling/FraværUtfylling';
import { UtfyllingResponse } from 'lib/types/types';
import { render, screen } from 'lib/utils/test/customRender';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from '@testing-library/user-event';

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

const user = userEvent.setup();

describe('Fravær utfylling', () => {
  describe('Generelt', () => {
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

  describe('Utfylling av fravær', () => {
    beforeEach(() => {
      render(<FraværUtfylling utfylling={meldekort} />);
    });

    it('Skal åpne en modal når bruker trykker på "Legg til dag"', async () => {
      await trykkPåLeggTilFraværKnapp();
      const heading = screen.getByRole('heading', {
        name: 'Legg til dag',
      });

      expect(heading).toBeVisible();
    });

    it('Skal gi en feilmelding dersom bruker ikke har ført inn en dato', async () => {
      await trykkPåLeggTilFraværKnapp();
      await trykkPåBekreftLeggTilFravær();

      const feilmelding = screen.getByText('Du må si hvilken dag du var borte...');
      expect(feilmelding).toBeVisible();
    });

    it('Skal gi en feilmelding dersom bruker ikke har ført inn en grunn', async () => {
      await trykkPåLeggTilFraværKnapp();
      await trykkPåBekreftLeggTilFravær();

      const feilmelding = screen.getByText('Du må velge grunn');
      expect(feilmelding).toBeVisible();
    });

    it('Skal legge til en rad med registrert fravær når bruker trykker på bekreft', async () => {
      await trykkPåLeggTilFraværKnapp();

      await user.click(
        screen.getByRole('button', {
          name: /åpne datovelger/i,
        })
      );

      await user.click(
        screen.getByRole('button', {
          name: /lørdag 13/i,
        })
      );

      await user.click(
        screen.getByRole('radio', {
          name: /sykdom eller skade/i,
        })
      );

      await trykkPåBekreftLeggTilFravær();

      const registrertFraværDato = screen.getByText('Lørdag 13. desember 2025');
      expect(registrertFraværDato).toBeVisible();
    });

    it('Skal kunne slette en rad med registrert fravær når bruker trykker på fjern', async () => {
      await trykkPåLeggTilFraværKnapp();

      await user.click(
        screen.getByRole('button', {
          name: /åpne datovelger/i,
        })
      );

      await user.click(
        screen.getByRole('button', {
          name: /lørdag 13/i,
        })
      );

      await user.click(
        screen.getByRole('radio', {
          name: /sykdom eller skade/i,
        })
      );

      await trykkPåBekreftLeggTilFravær();

      const registrertFraværDato = screen.getByText('Lørdag 13. desember 2025');
      expect(registrertFraværDato).toBeVisible();

      const fjernKnapp = screen.getByRole('button', { name: 'Fjern' });
      await user.click(fjernKnapp);

      const registrertFraværDatoEtterSletting = screen.queryByText('Lørdag 13. desember 2025');
      expect(registrertFraværDatoEtterSletting).not.toBeInTheDocument();
    });
  });
});

async function trykkPåLeggTilFraværKnapp() {
  const knapp = screen.getByRole('button', { name: 'Legg til dag' });
  await user.click(knapp);
}

async function trykkPåBekreftLeggTilFravær() {
  const knapp = screen.getByRole('button', { name: 'Bekreft' });
  await user.click(knapp);
}
