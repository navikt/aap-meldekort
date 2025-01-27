import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { MeldekortResponse } from 'lib/types/types';
import { userEvent } from '@testing-library/user-event';
import { StemmerOpplysningene } from 'components/steg/stemmeropplysningene/StemmerOpplysningene';

const meldekort: MeldekortResponse = {
  meldekort: {
    timerArbeidet: [
      { dato: '2024-11-18' },
      { dato: '2024-11-19' },
      { dato: '2024-11-20' },
      { dato: '2024-11-21' },
      { dato: '2024-11-22' },
      { dato: '2024-11-23' },
      { dato: '2024-11-24' },
      { dato: '2024-11-25' },
      { dato: '2024-11-26' },
      { dato: '2024-11-27' },
      { dato: '2024-11-28' },
      { dato: '2024-11-29' },
      { dato: '2024-11-30' },
      { dato: '2024-12-01' },
    ],
  },
  steg: 'TIMER_ARBEIDET',
  periode: { fom: '2024-11-04', tom: '2024-11-17' },
};

describe('Timer arbeidet', () => {
  beforeEach(() => render(<StemmerOpplysningene referanse={'123'} meldekort={meldekort} />));

  it('skal ha en overskrift', () => {
    const heading = screen.getByRole('heading', { name: 'Se over før du sender inn', level: 2 });
    expect(heading).toBeVisible();
  });

  it('skal ha warning som sier at meldekortet ikke er sendt inn ennå', () => {
    const heading = screen.getByText('Meldekortet er ikke sendt inn ennå');
    expect(heading).toBeVisible();
  });

  it('skal ha en oppsummeringskalender', () => {
    const oppsummeringskalender = screen.getByText('Uke 45 - 46');
    expect(oppsummeringskalender).toBeVisible();
  });

  it('skal ha et felt for å bekrefte at opplysningene stemmer', () => {
    const bekreftOption = screen.getByRole('checkbox', { name: 'Jeg bekrefter at disse opplysningene stemmer' });
    expect(bekreftOption).toBeVisible();
  });

  it('skal gi en feilmelding dersom feltet for å bekrefte at opplysningene stemmer ikke er huket av', async () => {
    const user = userEvent.setup();
    const sendInnKnapp = screen.getByRole('button', { name: 'Send inn' });

    await user.click(sendInnKnapp);

    const feilmelding = screen.getByText('Du må bekrefte at disse opplysningene stemmer');
    expect(feilmelding).toBeVisible();
  });
});
