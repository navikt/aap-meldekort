import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Form } from 'components/form/Form';
import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { StegContext } from 'context/StegContext';

describe('Form', () => {
  beforeEach(() => {
    render(
      <StegContextWrapper>
        <Form nesteSteg={'INTRO'} forrigeSteg={'INTRO'}>
          <div>Noe greier</div>
        </Form>
      </StegContextWrapper>
    );
  });
  test('rendrer innhold', () => {
    expect(screen.getByText('Noe greier')).toBeVisible();
  });

  test('skal ha en knapp for å gå til neste steg', () => {
    expect(screen.getByRole('button', { name: 'Neste' })).toBeVisible();
  });

  test('skal ha en knapp for å gå tilbake til forrige steg', () => {
    expect(screen.getByRole('button', { name: 'Tilbake' })).toBeVisible();
  });

  test('neste-knapp skal være en submit-knapp', () => {
    expect(screen.getByRole('button', { name: 'Neste' })).not.toHaveAttribute('type', 'button');
  });

  test('tilbake-knapp skal ikke være en submit-knapp', () => {
    expect(screen.getByRole('button', { name: 'Tilbake' })).not.toHaveAttribute('type', 'submit');
    expect(screen.getByRole('button', { name: 'Tilbake' })).toHaveAttribute('type', 'button');
  });
});

const StegContextWrapper = ({ children }: { children: ReactNode }) => {
  return <StegContext.Provider value={{ steg: 'INTRO', setSteg: vi.fn() }}>{children}</StegContext.Provider>;
};
