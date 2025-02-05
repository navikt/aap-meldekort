'use client';

import { Link } from '@navikt/ds-react';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/navigation';

interface Props {
  label: string;
  href: string;
}

export const MeldekortLenke = ({ label, href }: Props) => {
  const router = useRouter();

  return (
    <Link onClick={() => router.push(href)} style={{ cursor: 'pointer' }}>
      <ArrowLeftIcon aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
};
