'use client';

import { Link } from '@navikt/ds-react';
import { ArrowLeftIcon } from '@navikt/aksel-icons';

interface Props {
  label: string;
  href: string;
}

export const MeldekortLenke = ({ label, href }: Props) => {
  return (
    <Link href={href}>
      <ArrowLeftIcon aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
};
