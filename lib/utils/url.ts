'use client';

import { Steg } from 'lib/types/types';
import { useParams } from 'next/navigation';
import { useRouter } from 'i18n/routing';

export function useParamsMedType() {
  return useParams<{
    lang: 'nb' | 'nn';
    innsendingtype: 'korrigering' | 'innsending';
    referanse: string;
    aktivtSteg: Steg;
  }>();
}

export enum InnsendingType {
  INNSENDING = 'innsending',
  KORRIGERING = 'korrigering',
}

export function useGåTilSteg(): { gåTilSteg: (steg: Steg) => void; hentUrlForSteg: (steg: Steg) => string } {
  const router = useRouter();
  const params = useParamsMedType();

  const innsendingType =
    params.innsendingtype === InnsendingType.INNSENDING ? InnsendingType.INNSENDING : InnsendingType.KORRIGERING;

  function gåTilSteg(steg: Steg) {
    return router.push(`/${innsendingType}/${params.referanse}/${steg}`);
  }

  function hentUrlForSteg(steg: Steg) {
    return `/${innsendingType}/${params.referanse}/${steg}`;
  }

  return { gåTilSteg, hentUrlForSteg };
}
