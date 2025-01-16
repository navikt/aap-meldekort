import { afterEach, beforeAll, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

beforeAll(() => {
  vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
    useParams: vi.fn(() => ({ system: 'arena' })),
  }));
});

afterEach(() => {
  cleanup();
});
