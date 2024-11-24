import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Introduksjon } from 'components/steg/introduksjon/Introduksjon';
import { userEvent } from '@testing-library/user-event';

const user = userEvent.setup();

describe('generelt', () => {
  it('skal ha en lenke til en side som opplyser om viktigheten av å gi riktige opplysninger ', () => {
    render(<Introduksjon />);
    const link = screen.getByRole('link', { name: 'Les mer om viktigheten av å gi riktige opplysninger' });
    expect(link).toBeVisible();
  });
});

describe('skjema', () => {
  it('skal ha et felt for å bekrefte at bruker vil fylle ut meldekortet riktig', () => {
    render(<Introduksjon />);
    const checkbox = screen.getByRole('checkbox', {
      name: 'Jeg bekrefter at jeg vil fylle ut meldekortet så riktig jeg kan',
    });
    expect(checkbox).toBeVisible();
  });

  it('skal ha en knapp for å gå videre til neste steg', () => {
    render(<Introduksjon />);
    const button = screen.getByRole('button', { name: 'Neste' });
    expect(button).toBeVisible();
  });

  it('skal vise en feilmelding dersom man ikke bekrefter', async () => {
    render(<Introduksjon />);
    const button = screen.getByRole('button', { name: 'Neste' });
    await user.click(button);
    const feilmelding = screen.getByText('Du må bekrefte at du vil fylle ut meldekortet så riktig du kan');
    expect(feilmelding).toBeVisible();
  });
});