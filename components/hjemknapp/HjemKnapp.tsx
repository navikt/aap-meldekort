'use client';

import { Link } from '@navikt/ds-react';
import { HouseIcon } from '@navikt/aksel-icons';

interface Props {
  label: string;
  href: string;
}

export const HjemKnapp = ({ label, href }: Props) => {
  return (
    <Link href={href}>
      <HouseIcon aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
};
