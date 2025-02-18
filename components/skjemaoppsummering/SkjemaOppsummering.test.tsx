import { describe, expect, it } from 'vitest';
import { render, screen } from 'lib/utils/test/customRender';
import { SkjemaOppsummering } from 'components/skjemaoppsummering/SkjemaOppsummering';
import { MeldekortResponse } from 'lib/types/types';

const meldekortMedArbeid: MeldekortResponse = {
  meldekort: {
    harDuJobbet: true,
    dager: [
      {
        dato: '2024-11-04',
        timerArbeidet: 7.5,
      },
      {
        dato: '2024-11-05',
      },
      {
        dato: '2024-11-06',
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
    ],
  },
  periode: { fom: '2024-11.04', tom: '2024-11-17' },
  steg: 'KVITTERING',
  tidligsteInnsendingsDato: '',
};

describe('skjema oppsummering', () => {
  it('skal ha et felt for å vise hva som er besvart på om innbygger har vært i arbeid siste 14 dager', () => {
    render(<SkjemaOppsummering meldekort={meldekortMedArbeid} />);

    const label = screen.getByText('Har du vært i arbeid de siste 14 dagene?');
    expect(label).toBeVisible();
    const JaSvar = screen.getByText('Ja');
    expect(JaSvar).toBeVisible();
  });

  it('skal vise ukenummer og datoer for den første uken i perioden med tilhørende timer registrert', () => {
    render(<SkjemaOppsummering meldekort={meldekortMedArbeid} />);

    const ukenummer = screen.getByText('Uke 45');
    expect(ukenummer).toBeVisible();

    const periode = screen.getByText('04.11.2024 - 10.11.2024');
    expect(periode).toBeVisible();

    const dag = screen.getByText('Mandag:');
    expect(dag).toBeVisible();
    const timerArbeidet = screen.getByText('Arbeid 7.5 timer');
    expect(timerArbeidet).toBeVisible();
  });

  it('skal vise ukenummer og datoer for den andre uken i perioden med tilhørende timer registrert', () => {
    render(<SkjemaOppsummering meldekort={meldekortMedArbeid} />);

    const ukenummer = screen.getByText('Uke 46');
    expect(ukenummer).toBeVisible();

    const periode = screen.getByText('11.11.2024 - 17.11.2024');
    expect(periode).toBeVisible();

    const dag = screen.getByText('Søndag:');
    expect(dag).toBeVisible();
    const timerArbeidet = screen.getByText('Arbeid 5 timer');
    expect(timerArbeidet).toBeVisible();
  });

  it('skal vise lenker tilbake til stegene dersom flagget for å vise lenker er satt til true', () => {
    render(<SkjemaOppsummering meldekort={meldekortMedArbeid} visLenkeTilbakeTilSteg={true} />);

    const endreOmDuHarArbeidetLink = screen.getByRole('link', { name: 'Endre om du har arbeidet i perioden' });
    expect(endreOmDuHarArbeidetLink).toBeVisible();

    const endreAntallTimerArbeidetLink = screen.getByRole('link', { name: 'Endre antall timer arbeidet' });
    expect(endreAntallTimerArbeidetLink).toBeVisible();
  });

  it('skal ikke vise lenker tilbake til stegene dersom flagget for å vise lenker er satt til false', () => {
    render(<SkjemaOppsummering meldekort={meldekortMedArbeid} visLenkeTilbakeTilSteg={false} />);

    const endreOmDuHarArbeidetLink = screen.queryByRole('link', { name: 'Endre om du har arbeidet i perioden' });
    expect(endreOmDuHarArbeidetLink).not.toBeInTheDocument();

    const endreAntallTimerArbeidetLink = screen.queryByRole('link', { name: 'Endre antall timer arbeidet' });
    expect(endreAntallTimerArbeidetLink).not.toBeInTheDocument();
  });
});
