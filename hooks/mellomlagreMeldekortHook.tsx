'use client';

import { EndreUtfyllingRequest } from 'lib/types/types';
import { mellomlagreMeldekortClient } from 'lib/client/clientApi';
import { useParamsMedType } from 'lib/utils/url';
import { useState } from 'react';

export function useMellomlagring(): {
  mellomlagreMeldekort: (utfylling: EndreUtfyllingRequest) => Promise<boolean>;
  sistLagret?: Date;
} {
  const params = useParamsMedType();
  const [sistLagret, setSistLagret] = useState<Date>();

  async function mellomlagreMeldekort(utfylling: EndreUtfyllingRequest): Promise<boolean> {
    const mellomlagringResponse = await mellomlagreMeldekortClient(params.referanse, utfylling);

    if (mellomlagringResponse) {
      if (mellomlagringResponse.feil) {
        return false;
      } else {
        setSistLagret(new Date());
        return true;
      }
    } else {
      return false;
    }
  }

  return { mellomlagreMeldekort, sistLagret };
}
