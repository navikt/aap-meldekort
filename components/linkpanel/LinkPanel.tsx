import { ChevronRightIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import styles from 'components/linkpanel/LinkPanel.module.css';
import { MeldekortStatus } from 'components/meldekortstatus/MeldekortStatus';
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
    <a href={href} className={`${styles.link} ${className}`}>
      <div className={styles.top}>
        <BodyShort size={'large'} style={{ fontWeight: 'bold' }}>
          {title}
        </BodyShort>
        <div className={styles.topright}>
          {status && <MeldekortStatus status={status} />}
          <ChevronRightIcon fontSize={'1.6rem'} aria-hidden="true" />
        </div>
      </div>
      <BodyShort>{description}</BodyShort>
    </a>
  );
};
