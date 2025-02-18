'use client';

import { Steg } from 'lib/types/types';
import { useParams } from 'next/navigation';

export function useParamsMedType() {
  return useParams<{ lang: 'nb' | 'nn'; referanse: string; aktivtSteg: Steg }>();
}
