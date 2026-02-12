import { beforeEach, describe, expect, test, vitest } from 'vitest';
import { Form } from 'components/form/Form';
import { render, screen } from 'lib/utils/test/customRender';

describe('Form generelt', () => {
  beforeEach(() => {
    render(
      <Form onSubmit={vitest.fn()} forrigeStegOnClick={vitest.fn()} isLoading={false}>
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

  test('skal ha en knapp for å gå tilbake til forrige steg dersom forrigeStegOnClick er satt', () => {
    expect(screen.getByRole('button', { name: 'Forrige' })).toBeVisible();
  });

  test('neste-knapp skal være en submit-knapp', () => {
    expect(screen.getByRole('button', { name: 'Neste' })).not.toHaveAttribute('type', 'button');
  });

  test('tilbake-knapp skal ikke være en submit-knapp', () => {
    expect(screen.getByRole('button', { name: 'Forrige' })).not.toHaveAttribute('type', 'submit');
    expect(screen.getByRole('button', { name: 'Forrige' })).toHaveAttribute('type', 'button');
  });

  test('skal vise default tekst på neste knapp dersom nesteStegKnappTekst ikke er satt', () => {
    expect(screen.getByText('Neste')).toBeVisible();
  });

  test('skal vise default tekst på tilbake knapp dersom forrigeStegKnappTekst ikke er satt', () => {
    expect(screen.getByText('Forrige')).toBeVisible();
  });
});

describe('varianter', () => {
  test('skal ikke vise knapp tilbake hvis forrigeSteg ikke er satt', () => {
    render(
      <Form onSubmit={vitest.fn()} isLoading={false}>
        <div>Noe greier</div>
      </Form>
    );

    expect(screen.queryByRole('button', { name: 'Forrige' })).not.toBeInTheDocument();
  });

  test('skal ikke vise knapp til neste hvis visNesteKnapp er satt til false', () => {
    render(
      <Form onSubmit={vitest.fn()} isLoading={false} visNesteKnapp={false}>
        <div>Noe greier</div>
      </Form>
    );

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
  });

  test('skal vise korrekt tekst på neste knapp dersom nesteStegKnappTekst er satt', () => {
    render(
      <Form onSubmit={vitest.fn()} isLoading={false} nesteStegKnappTekst={'Neste steg'}>
        <div>Noe greier</div>
      </Form>
    );
    expect(screen.getByRole('button', { name: 'Neste steg' })).toBeVisible();
  });

  test('skal vise feilmelding dersom det er satt', () => {
    render(
      <Form onSubmit={vitest.fn()} isLoading={false} errorMessage={'Noe gikk galt.'}>
        <div>Noe greier</div>
      </Form>
    );

    const feilmelding = screen.getByText('Noe gikk galt.');
    expect(feilmelding).toBeVisible();
  });
});
