import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Rapporteringskalender } from 'components/rapporteringskalender/Rapporteringskalender';

export interface Periode {
  periode: { fraDato: string; tilDato: string };
}

const periode: Periode = {
  periode: { fraDato: '2024-11-18', tilDato: '2024-12-01' },
};

describe('generelt', () => {
  it('skal vise ukenummer på perioden', () => {
    render(<Rapporteringskalender periode={periode} />);
    const ukenummer = screen.getByText('Uke 47 - 48');
    expect(ukenummer).toBeVisible();
  });

  it('skal vise fra dato og til dato for perioden', () => {
    render(<Rapporteringskalender periode={periode} />);
    const datoerForPerioden = screen.getByText('');
  });
});
