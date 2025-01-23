import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OppsummeringRad } from 'components/oppsummeringrad/OppsummeringRad';

beforeEach(() => {
  render(
    <OppsummeringRad
      heading={'Sammenlagt for perioden'}
      label={'Jobb'}
      value={'26 timer (35%)'}
      backgroundColor={'blue'}
    />
  );
});

describe('oppsummeringrad', () => {
  it('skal ha en label', () => {
    const label = screen.getByText('Jobb');
    expect(label).toBeVisible();
  });

  it('skal vise antall timer og prosent', () => {
    const timerOgProsent = screen.getByText('26 timer (35%)');
    expect(timerOgProsent).toBeVisible();
  });
});
