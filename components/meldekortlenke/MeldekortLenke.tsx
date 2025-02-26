'use client';

import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { Link } from 'i18n/routing';

interface Props {
  label: string;
  href: string;
  visIcon?: boolean;
}

export const MeldekortLenke = ({ label, href, visIcon = true }: Props) => {
  return (
    <Link href={href} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
      {visIcon && <ArrowLeftIcon aria-hidden="true" />}
      <span>{label}</span>
    </Link>
  );
};
