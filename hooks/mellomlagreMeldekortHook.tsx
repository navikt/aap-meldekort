'use client';

import { EndreUtfyllingRequest } from 'lib/types/types';
import { mellomlagreMeldekortClient } from 'lib/client/clientApi';
import { useParamsMedType } from 'lib/utils/url';
import { useState } from 'react';
import { isSuccess } from 'lib/utils/api';

export function useMellomlagring(): {
  mellomlagreMeldekort: (utfylling: EndreUtfyllingRequest) => Promise<boolean>;
  sistLagret?: Date;
} {
  const params = useParamsMedType();
  const [sistLagret, setSistLagret] = useState<Date>();

  async function mellomlagreMeldekort(utfylling: EndreUtfyllingRequest): Promise<boolean> {
    const response = await mellomlagreMeldekortClient(params.referanse, utfylling);

    if (isSuccess(response)) {
      if (response.data) {
        setSistLagret(new Date());
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  return { mellomlagreMeldekort, sistLagret };
}
