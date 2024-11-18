import {afterEach, beforeAll, vi} from 'vitest';
import '@testing-library/jest-dom/vitest';
import {cleanup} from '@testing-library/react';

beforeAll(() => {
  vi.mock('next/navigation', () => ({
    useParams: vi
        .fn()
        .mockReturnValue({behandlingsreferanse: '123', aktivtSteg: 'HEIHEI'}),
    useRouter: vi.fn()
  }))
})

afterEach(() => {
  cleanup();
});
