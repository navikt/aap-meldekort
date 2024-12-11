import { beforeEach, describe, expect, test, vitest } from 'vitest';
import { Form } from 'components/form/Form';
import { render, screen } from '@testing-library/react';

describe('Form generelt', () => {
  beforeEach(() => {
    render(
      <Form onSubmit={vitest.fn()} forrigeSteg={'BEKREFT_SVARER_ÆRLIG'} referanse={'123'}>
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

  test('skal vise default tekst på neste knapp dersom nesteStegKnappTekst ikke er satt', () => {
    expect(screen.getByText('Neste'));
  });

  test('skal vise default tekst på tilbake knapp dersom forrigeStegKnappTekst ikke er satt', () => {
    expect(screen.getByText('Tilbake'));
  });
});

describe('varianter', () => {
  test('skal ikke vise knapp tilbake hvis forrigeSteg ikke er satt', () => {
    render(
      <Form onSubmit={vitest.fn()} referanse={'123'}>
        <div>Noe greier</div>
      </Form>
    );

    expect(screen.queryByRole('button', { name: 'Tilbake' })).not.toBeInTheDocument();
  });

  test('skal vise korrekt tekst på neste knapp dersom nesteStegKnappTekst er satt', () => {
    render(
      <Form onSubmit={vitest.fn()} referanse={'123'} nesteStegKnappTekst={'Neste steg'}>
        <div>Noe greier</div>
      </Form>
    );
    expect(screen.getByRole('button', { name: 'Neste steg' })).toBeVisible();
  });

  test('skal vise korrekt tekst på tilbake knapp dersom forrigeStegKnappTekst er satt', () => {
    render(
      <Form
        onSubmit={vitest.fn()}
        forrigeSteg={'BEKREFT_SVARER_ÆRLIG'}
        referanse={'123'}
        forrigeStegKnappTekst={'Endre'}
      >
        <div>Noe greier</div>
      </Form>
    );
    expect(screen.getByRole('button', { name: 'Endre' })).toBeVisible();
  });
});
