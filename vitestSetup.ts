import { afterEach, beforeAll, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

beforeAll(() => {
  vi.mock('i18n/routing', () => ({
    useRouter: vi.fn(),
  }));
});

afterEach(() => {
  cleanup();
});
