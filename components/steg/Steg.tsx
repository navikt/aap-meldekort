'use client';

import { Introduksjon } from 'components/steg/introduksjon/Introduksjon';
import { Rapporteringskalender } from 'components/rapporteringskalender/Rapporteringskalender';

export const Steg = () => {
  return (
    <div>
      <Introduksjon />
      <Rapporteringskalender
        periode={{
          periode: { fraDato: '2024-11-18', tilDato: '2024-12-01' },
        }}
      />
    </div>
  );
};
