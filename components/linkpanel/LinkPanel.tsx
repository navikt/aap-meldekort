import { ChevronRightIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import styles from 'components/linkpanel/LinkPanel.module.css';
import { MeldekortStatus } from 'components/meldekortstatus/MeldekortStatus';
import { Link } from 'i18n/routing';
import { Status } from 'lib/types/types';

interface Props {
  title: string;
  href: string;
  variant?: 'primary' | 'secondary';
  description?: string;
  status?: Status;
}

export const LinkPanel = ({ title, href, description, status, variant = 'primary' }: Props) => {
  const className = variant === 'primary' ? styles.primary : styles.secondary;

  return (
    <Link href={href} className={`${styles.link} ${className}`}>
      <div className={styles.content}>
        <div>
          <BodyShort size={'large'} weight={'semibold'}>
            {title}
          </BodyShort>
          <BodyShort>{description}</BodyShort>
        </div>
        <div className={styles.contentRight}>
          {status && <MeldekortStatus status={status} />}
          <ChevronRightIcon fontSize={'1.6rem'} aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
};
