import { render, screen } from '@testing-library/react';
import { Oppsummering } from 'components/steg/oppsummering/Oppsummering';
import { describe, expect, it } from 'vitest';

describe('Oppsummering', () => {
  it('viser en suksess-melding', () => {
    render(<Oppsummering />);
    expect(
      screen.getByText('Meldekortet ditt er sendt til Nav, du får beskjed hvis vi trenger noe mer fra deg.')
    ).toBeVisible();
  });

  it('har en accordion for å se hva som ble sendt inn', () => {
    render(<Oppsummering />);
    expect(screen.getByText('Se hva du sendte inn')).toBeVisible();
  });

  it('har en knapp som tar deg til "Mine aap"', () => {
    render(<Oppsummering />);
    expect(screen.getByRole('button', { name: 'Gå til Mine AAP' })).toBeVisible();
  });
});
