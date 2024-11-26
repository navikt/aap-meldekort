import { beforeEach, describe, expect, it } from 'vitest';
import { renderWithStegContext } from 'lib/utils/TestUtil';
import { screen } from '@testing-library/react';
import { OppsummeringTimer } from 'components/oppsummeringtimer/OppsummeringTimer';

beforeEach(() => {
  renderWithStegContext(<OppsummeringTimer timer={26} />);
});

describe('timer', () => {
  it('skal ha en label', () => {
    const label = screen.getByText('Jobb');
    expect(label).toBeVisible();
  });

  it('skal vise antall timer og prosent', () => {
    const timerOgProsent = screen.getByText('26 timer (35%)');
    expect(timerOgProsent).toBeVisible();
  });
});
