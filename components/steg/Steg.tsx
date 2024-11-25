'use client';

import { Introduksjon } from 'components/steg/introduksjon/Introduksjon';
import { useSteg } from 'hooks/StegHook';
import { Oppsummering } from 'components/steg/oppsummering/Oppsummering';
import { Periode } from 'components/steg/periode/Periode';
import { Utfylling } from 'components/steg/utfylling/Utfylling';
import { PeriodeType } from 'components/rapporteringskalender/Rapporteringskalender';

const periode: PeriodeType = {
  periode: { fraDato: '2024-11-18', tilDato: '2024-12-01' },
};

export const Steg = () => {
  const { steg } = useSteg();

  return (
    <div>
      {steg === 'INTRO' && <Introduksjon />}
      {steg === 'PERIODE' && <Periode periode={periode} />}
      {steg === 'UTFYLLING' && <Utfylling />}
      {steg === 'OPPSUMMERING' && <Oppsummering />}
    </div>
  );
};
