'use client';

import { useParams } from 'next/navigation';
import { Steg } from 'lib/types/types';

export function useParamsMedType() {
  return useParams<{ lang: 'nb' | 'nn'; referanse: string; aktivtSteg: Steg }>();
}
