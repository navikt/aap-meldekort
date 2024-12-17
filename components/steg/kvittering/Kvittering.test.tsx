import { render, screen } from '@testing-library/react';
import { Kvittering } from 'components/steg/kvittering/Kvittering';
import { describe, expect, it } from 'vitest';
import { MeldekortResponse } from 'lib/types/types';

const meldeperiode: MeldekortResponse = {
  periode: { fom: '2024-11-18', tom: '2024-12-01' },
  meldekort: {
    timerArbeidet: [],
  },
  steg: 'KVITTERING',
};

describe('Kvittering', () => {
  it('viser en suksess-melding', () => {
    render(<Kvittering meldekort={meldeperiode} />);
    expect(
      screen.getByText('Meldekortet ditt er sendt til Nav, du får beskjed hvis vi trenger noe mer fra deg.')
    ).toBeVisible();
  });

  it('har en accordion for å se hva som ble sendt inn', () => {
    render(<Kvittering meldekort={meldeperiode} />);
    expect(screen.getByText('Se hva du sendte inn')).toBeVisible();
  });

  it('har en knapp som tar deg til "Mine aap"', () => {
    render(<Kvittering meldekort={meldeperiode} />);
    expect(screen.getByRole('button', { name: 'Gå til Mine AAP' })).toBeVisible();
  });
});
