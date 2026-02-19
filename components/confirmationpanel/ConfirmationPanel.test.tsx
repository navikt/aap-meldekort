import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ConfirmationPanel } from 'components/confirmationpanel/ConfirmationPanel';

describe('ConfirmationPanel', () => {
  it('viser label-teksten', () => {
    render(<ConfirmationPanel checked={false} label="Jeg bekrefter vilkårene" onChange={() => {}} />);

    expect(screen.getByText('Jeg bekrefter vilkårene')).toBeInTheDocument();
  });

  it('kaller onChange når checkbox klikkes', async () => {
    const user = userEvent.setup();
    const onChangeMock = vi.fn();

    render(<ConfirmationPanel checked={false} label="Bekreft" onChange={onChangeMock} />);

    const checkbox = screen.getByRole('checkbox');

    await user.click(checkbox);

    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  it('viser feilmelding når error er satt', () => {
    render(
      <ConfirmationPanel
        checked={false}
        label="Bekreft"
        onChange={() => {}}
        error="Du må bekrefte før du kan gå videre"
      />
    );

    expect(screen.getByText('Du må bekrefte før du kan gå videre')).toBeVisible();
  });
});
