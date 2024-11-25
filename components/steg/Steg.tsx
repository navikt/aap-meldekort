'use client';

import { Introduksjon } from 'components/steg/introduksjon/Introduksjon';
import { useSteg } from 'hooks/StegHook';
import { Oppsummering } from 'components/steg/oppsummering/Oppsummering';
import { Periode } from 'components/steg/periode/Periode';
import { Utfylling } from 'components/steg/utfylling/Utfylling';

export const Steg = () => {
  const { steg } = useSteg();

  return (
    <div>
      {steg === 'INTRO' && <Introduksjon />}
      {steg === 'PERIODE' && <Periode />}
      {steg === 'UTFYLLING' && <Utfylling />}
      {steg === 'OPPSUMMERING' && <Oppsummering />}
    </div>
  );
};
