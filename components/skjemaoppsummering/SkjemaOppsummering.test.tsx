import { describe, expect, it } from 'vitest';
import { render, screen } from 'lib/utils/test/customRender';
import { SkjemaOppsummering } from 'components/skjemaoppsummering/SkjemaOppsummering';
import { UtfyllingResponse } from 'lib/types/types';
import { formaterDatoMedDagOgMåndedIBokstaver, formaterDatoMedÅrForFrontend } from 'lib/utils/date';
import { storForbokstav } from 'lib/utils/string';

const meldekortMedArbeid: UtfyllingResponse = {
  metadata: {
    antallUbesvarteMeldeperioder: 1,
    kanSendesInn: true,
    referanse: '123456789',
    periode: { fom: '2024-11.04', tom: '2024-11-17' },
    visFrist: true,
  },
  tilstand: {
    aktivtSteg: 'KVITTERING',
    svar: {
      harDuJobbet: true,
      dager: [
        {
          dato: '2024-11-06',
          timerArbeidet: 7.5,
        },
        {
          dato: '2024-11-07',
        },
        {
          dato: '2024-11-08',
        },
        {
          dato: '2024-11-09',
        },
        {
          dato: '2024-11-10',
        },
        {
          dato: '2024-11-11',
        },
        {
          dato: '2024-11-12',
        },
        {
          dato: '2024-11-13',
        },
        {
          dato: '2024-11-14',
        },
        {
          dato: '2024-11-15',
        },
        {
          dato: '2024-11-16',
        },
        {
          dato: '2024-11-17',
          timerArbeidet: 5,
        },
        {
          dato: '2024-11-18',
        },
        {
          dato: '2024-11-19',
        },
      ],
    },
  },
};

const meldekortMedFravær: UtfyllingResponse = {
  ...meldekortMedArbeid,
  tilstand: {
    ...meldekortMedArbeid.tilstand,
    svar: {
      ...meldekortMedArbeid.tilstand.svar,
      harDuGjennomførtAvtaltAktivitet: 'NEI_IKKE_GJENNOMFORT_AVTALT_AKTIVITET',
      dager: [
        {
          dato: '2024-11-06',
          timerArbeidet: 7.5,
        },
        {
          dato: '2024-11-07',
          fravær: 'SYKDOM_ELLER_SKADE',
        },
        {
          dato: '2024-11-08',
          fravær: 'OMSORG_FØRSTE_SKOLEDAG_TILVENNING_ELLER_ANNEN_OPPFØLGING_BARN',
        },
        {
          dato: '2024-11-09',
          fravær: 'OMSORG_FØRSTE_SKOLEDAG_TILVENNING_ELLER_ANNEN_OPPFØLGING_BARN',
        },
        {
          dato: '2024-11-10',
        },
        {
          dato: '2024-11-11',
        },
        {
          dato: '2024-11-12',
        },
        {
          dato: '2024-11-13',
        },
        {
          dato: '2024-11-14',
        },
        {
          dato: '2024-11-15',
        },
        {
          dato: '2024-11-16',
        },
        {
          dato: '2024-11-17',
          timerArbeidet: 5,
        },
        {
          dato: '2024-11-18',
          fravær: 'SYKDOM_ELLER_SKADE',
        },
        {
          dato: '2024-11-19',
          fravær: 'SYKDOM_ELLER_SKADE',
        },
      ],
    },
  },
};

describe('skjema oppsummering', () => {
  it('skal ha et felt for å vise hva som er besvart på om innbygger har vært i arbeid siste 14 dager', () => {
    render(<SkjemaOppsummering utfylling={meldekortMedArbeid} />);

    const label = screen.getByText('Har du arbeidet i perioden?');
    expect(label).toBeVisible();
    const JaSvar = screen.getByText('Ja');
    expect(JaSvar).toBeVisible();
  });

  it('skal vise ukenummer og datoer for den første uken i perioden med tilhørende timer registrert', () => {
    render(<SkjemaOppsummering utfylling={meldekortMedArbeid} />);

    const label = screen.getByText('Uke 45 (04.11.2024 - 10.11.2024)');
    expect(label).toBeVisible();

    const dag = screen.getByText('Onsdag:');
    expect(dag).toBeVisible();
    const timerArbeidet = screen.getByText('7.5 timer arbeidet');
    expect(timerArbeidet).toBeVisible();
  });

  it('skal vise ukenummer og datoer for den andre uken i perioden med tilhørende timer registrert', () => {
    render(<SkjemaOppsummering utfylling={meldekortMedArbeid} />);

    const label = screen.getByText('Uke 46 (11.11.2024 - 17.11.2024)');
    expect(label).toBeVisible();

    const dag = screen.getByText('Søndag:');
    expect(dag).toBeVisible();
    const timerArbeidet = screen.getByText('5 timer arbeidet');
    expect(timerArbeidet).toBeVisible();
  });

  it('skal vise lenker tilbake til stegene dersom flagget for å vise lenker er satt til true', () => {
    render(<SkjemaOppsummering utfylling={meldekortMedArbeid} visLenkeTilbakeTilSteg={true} />);

    const endreLinks = screen.getAllByRole('link', { name: 'Endre' });
    expect(endreLinks).toHaveLength(2);
  });

  it('skal ikke vise lenker tilbake til stegene dersom flagget for å vise lenker er satt til false', () => {
    render(<SkjemaOppsummering utfylling={meldekortMedArbeid} visLenkeTilbakeTilSteg={false} />);

    const endreOmDuHarArbeidetLink = screen.queryByRole('link', { name: 'Endre om du har arbeidet i perioden' });
    expect(endreOmDuHarArbeidetLink).not.toBeInTheDocument();

    const endreAntallTimerArbeidetLink = screen.queryByRole('link', { name: 'Endre antall timer arbeidet' });
    expect(endreAntallTimerArbeidetLink).not.toBeInTheDocument();
  });

  it('skal bare vise oppsummering av uker hvor det har blitt ført timer', () => {
    render(<SkjemaOppsummering utfylling={meldekortMedArbeid} visLenkeTilbakeTilSteg={false} />);
    expect(screen.getByText('Uke 45 (04.11.2024 - 10.11.2024)')).toBeVisible();
    expect(screen.getByText('Uke 46 (11.11.2024 - 17.11.2024)')).toBeVisible();
  });

  it('viser ikke oppsummering av fravær hvis bruker har svart at de ikke har fravær eller ingen aktiviteter', () => {
    render(<SkjemaOppsummering utfylling={meldekortMedArbeid} visLenkeTilbakeTilSteg={false} />);
    expect(screen.queryByText('Dager borte fra avtalt aktivitet')).not.toBeInTheDocument();
  });

  it('viser en oppsummering av dager med fravær når bruker har registrert dette', () => {
    render(<SkjemaOppsummering utfylling={meldekortMedFravær} visLenkeTilbakeTilSteg={false} />);
    expect(screen.getByText('Dager borte fra avtalt aktivitet')).toBeVisible();
  });

  it('lister ut alle dager med registrert fravær', () => {
    const dagerMedFravær = meldekortMedFravær.tilstand.svar.dager.filter((dag) => dag.fravær).map((dag) => dag.dato);
    render(<SkjemaOppsummering utfylling={meldekortMedFravær} visLenkeTilbakeTilSteg={false} />);
    dagerMedFravær.map((dag) => {
      expect(screen.getByText(storForbokstav(formaterDatoMedDagOgMåndedIBokstaver(dag)))).toBeVisible();
    });
  });

  it('fravær grupperes etter type', () => {
    render(<SkjemaOppsummering utfylling={meldekortMedFravær} visLenkeTilbakeTilSteg={false} />);
    const sykdomsgruppe = screen.getByText(/^Sykdom eller skade/);
    const omsorgsgruppe = screen.getByText(/^Første skoledag, tilvenning eller annen oppfølging av barn/);
    expect(sykdomsgruppe).toBeVisible();
    expect(omsorgsgruppe).toBeVisible();
  });
});
