import { beforeEach, describe, expect, test } from 'vitest';
import { Form } from 'components/form/Form';
import { screen } from '@testing-library/react';
import { renderWithStegContext } from 'lib/utils/TestUtil';

describe('Form generelt', () => {
  beforeEach(() => {
    renderWithStegContext(
      <Form nesteSteg={'INTRO'} forrigeSteg={'INTRO'}>
        <div>Noe greier</div>
      </Form>
    );
  });

  test('rendrer innhold', () => {
    expect(screen.getByText('Noe greier')).toBeVisible();
  });

  test('skal ha en knapp for å gå til neste steg', () => {
    expect(screen.getByRole('button', { name: 'Neste' })).toBeVisible();
  });

  test('skal ha en knapp for å gå tilbake til forrige steg dersom forrigeSteg er satt', () => {
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

describe('varianter', () => {
  test('skal ikke vise knapp tilbake hvis forrigeSteg ikke er satt', () => {
    renderWithStegContext(
      <Form nesteSteg={'INTRO'}>
        <div>Noe greier</div>
      </Form>
    );

    expect(screen.queryByRole('button', { name: 'Tilbake' })).not.toBeInTheDocument();
  });
});
