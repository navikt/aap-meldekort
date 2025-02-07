'use client';

import { ArrowLeftIcon } from '@navikt/aksel-icons';
import Link from 'next/link';

interface Props {
  label: string;
  href: string;
}

export const MeldekortLenke = ({ label, href }: Props) => {
  return (
    <Link href={href} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
      <ArrowLeftIcon aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
};
