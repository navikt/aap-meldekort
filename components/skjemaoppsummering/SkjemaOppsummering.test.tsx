import { describe, expect, it } from 'vitest';
import { render, screen, within } from 'lib/utils/test/customRender';
import { SkjemaOppsummering } from 'components/skjemaoppsummering/SkjemaOppsummering';
import { formaterDatoMedDagOgMåndedIBokstaver } from 'lib/utils/date';
import { storForbokstav } from 'lib/utils/string';
import {
  meldekortMedArbeid,
  meldekortMedAvtalteAktiviterUtenFravær,
  meldekortMedFravær,
  meldekortMedTreDagerAnnetFravær,
} from 'lib/utils/test/testdata';

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
    expect(endreLinks).toHaveLength(3);
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

    const sykdomsgruppe = screen.getByText('Syk eller skadet:').parentElement;
    expect(sykdomsgruppe).not.toBeNull();
    if (sykdomsgruppe) {
      meldekortMedFravær.tilstand.svar.dager
        .filter((dag) => dag.fravær === 'SYKDOM_ELLER_SKADE')
        .map((dag) => {
          expect(
            within(sykdomsgruppe).getByText(storForbokstav(formaterDatoMedDagOgMåndedIBokstaver(dag.dato)))
          ).toBeVisible();
        });
    }

    const skolegruppe = screen.getByText('Første skoledag, tilvenning eller annen oppfølging av barn:').parentElement;
    expect(skolegruppe).not.toBeNull();
    if (skolegruppe) {
      meldekortMedFravær.tilstand.svar.dager
        .filter((dag) => dag.fravær === 'OMSORG_FØRSTE_SKOLEDAG_TILVENNING_ELLER_ANNEN_OPPFØLGING_BARN')
        .map((dag) => {
          expect(
            within(skolegruppe).getByText(storForbokstav(formaterDatoMedDagOgMåndedIBokstaver(dag.dato)))
          ).toBeVisible();
        });
    }
  });

  it('viser at bruker har svart "Ja" på at de har hatt avtalte aktiviteter', () => {
    render(<SkjemaOppsummering utfylling={meldekortMedFravær} visLenkeTilbakeTilSteg={false} />);
    expect(screen.getByText('Har du hatt avtalte aktiviteter i perioden?')).toBeVisible();
    expect(screen.getByText('Var du borte fra noen av disse aktivitetene?')).toBeVisible();
  });

  it('viser svar på om bruker har vært borte fra aktiviteter når de har svart at de har avtalte akitviteter', () => {
    render(<SkjemaOppsummering utfylling={meldekortMedAvtalteAktiviterUtenFravær} visLenkeTilbakeTilSteg={false} />);
    expect(screen.getByText('Har du hatt avtalte aktiviteter i perioden?')).toBeVisible();
    expect(screen.getByText('Var du borte fra noen av disse aktivitetene?')).toBeVisible();
  });

  it('viser ikke svar på om bruker har hatt fravær hvis de ikke har hatt aktiviteter', () => {
    render(<SkjemaOppsummering utfylling={meldekortMedArbeid} visLenkeTilbakeTilSteg={false} />);
    expect(screen.getByText('Har du hatt avtalte aktiviteter i perioden?')).toBeVisible();
    expect(screen.queryByText('Var du borte fra noen av disse aktivitetene?')).not.toBeInTheDocument();
  });

  it('skal vise tag for trekk dersom man har mer enn to dager med annet fravær', () => {
    render(<SkjemaOppsummering utfylling={meldekortMedTreDagerAnnetFravær} visLenkeTilbakeTilSteg={false} />);
    expect(screen.getAllByText('Trekk')).toHaveLength(3);
  });
});
