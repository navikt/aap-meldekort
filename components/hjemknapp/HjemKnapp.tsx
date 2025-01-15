'use client';

import { Link } from '@navikt/ds-react';
import { HouseIcon } from '@navikt/aksel-icons';
import { useParams } from 'next/navigation';

export const HjemKnapp = () => {
  const params = useParams<{ system: string }>();
  return (
    <Link href={`/${params.system}`}>
      <HouseIcon />
      <span>AAP Meldekort</span>
    </Link>
  );
};
