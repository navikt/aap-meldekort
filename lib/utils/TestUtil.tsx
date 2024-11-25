import { StegContext } from 'context/StegContext';
import { vi } from 'vitest';
import { ReactNode } from 'react';
import { render } from '@testing-library/react';

export function renderWithStegContext(component: ReactNode) {
  render(<StegContext.Provider value={{ steg: 'INTRO', setSteg: vi.fn() }}>{component}</StegContext.Provider>);
}
