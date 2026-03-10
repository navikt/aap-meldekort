import { FraværUtfylling } from 'components/flyt/steg/fraværutfylling/FraværUtfylling';
import { UtfyllingResponse } from 'lib/types/types';
import { render, screen } from 'lib/utils/test/customRender';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import createFetchMock from 'vitest-fetch-mock';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

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
      ],
    },
  },
};

const user = userEvent.setup();

describe('Fravær utfylling', () => {
  describe('Generelt', () => {
    beforeEach(() => {
      fetchMock.resetMocks();
      fetchMock.mockResponse(JSON.stringify({ message: 'Success' }), { status: 200 });
      render(<FraværUtfylling utfylling={meldekort} />);
    });
    it('viser en overskrift', async () => {
      expect(
        await screen.findByRole('heading', { name: 'Hvilke dager var du borte fra avtalt aktivitet?', level: 2 })
      ).toBeVisible();
    });

    it('viser hvilken periode det gjelder', async () => {
      expect(await screen.findByText('Uke 50 og 51 (13.12.2025 - 21.12.2025)')).toBeVisible();
    });

    it('viser en beskrivelse på hva bruker skal gjøre', async () => {
      expect(
        await screen.findByText('Du melder kun inn aktiviteter som er i aktivitetsplanen og avtalt med Nav.')
      ).toBeVisible();
    });

    it('har en knapp for å legge til en dag med fravær', async () => {
      expect(await screen.findByRole('button', { name: 'Legg til dag' })).toBeVisible();
    });
  });

  describe('Utfylling av fravær', () => {
    beforeEach(() => {
      fetchMock.resetMocks();
      fetchMock.mockResponse(JSON.stringify({ message: 'Success' }), { status: 200 });
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

      const feilmelding = screen.getByText('Du må si hvilken dag du var borte');
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

      const fjernKnapp = await screen.findByRole('button', { name: 'Fjern' });
      await user.click(fjernKnapp);

      const registrertFraværDatoEtterSletting = screen.queryByText('Lørdag 13. desember 2025');
      expect(registrertFraværDatoEtterSletting).not.toBeInTheDocument();
    });

    it('gir en feilmelding hvis man trykker neste uten å ha lagt inn fravær', async () => {
      await user.click(screen.getByRole('button', { name: 'Neste' }));
      expect(
        screen.getByText(
          'Legg til dagene du har vært borte. Du har svart at du har vært borte fra avtalt aktivitet og må legge til dette før du kan fortsette.'
        )
      ).toBeVisible();
    });
  });

  describe('mellomlagring', () => {
    it('Skal vise registrert fravær hvis det allerede finnes i tilstand', () => {
      const oppdatertMeldekort: UtfyllingResponse = {
        ...meldekort,
        tilstand: {
          ...meldekort.tilstand,
          svar: {
            ...meldekort.tilstand.svar,
            dager: [
              ...meldekort.tilstand.svar.dager,
              {
                dato: '2025-12-15',
                timerArbeidet: 0,
                fravær: 'OMSORG_DØDSFALL_I_FAMILIE_ELLER_VENNEKRETS',
              },
            ],
          },
        },
      };

      fetchMock.resetMocks();
      fetchMock.mockResponse(JSON.stringify({ message: 'Success' }), { status: 200 });
      render(<FraværUtfylling utfylling={oppdatertMeldekort} />);

      expect(screen.getByText('Mandag 15. desember 2025')).toBeVisible();
      expect(screen.getByText('Dødsfall i familie eller vennekrets')).toBeVisible();
    });
  });

  describe('markering av trekk', () => {
    const meldekortMedFravær: UtfyllingResponse = {
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
              fravær: 'ANNEN',
            },
            {
              dato: '2025-12-14',
              timerArbeidet: 0,
              fravær: 'ANNEN',
            },
            {
              dato: '2025-12-15',
              timerArbeidet: 0,
              fravær: 'SYKDOM_ELLER_SKADE',
            },
          ],
        },
      },
    };
    it('viser markering om trekk for hver dag som har annet fravær ved 2 eller flere dager i samme periode', () => {
      render(<FraværUtfylling utfylling={meldekortMedFravær} />);
      expect(screen.getAllByText('Trekk')).toHaveLength(2);
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
