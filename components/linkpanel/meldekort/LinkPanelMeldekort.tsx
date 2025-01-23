import { ChevronRightIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import styles from './LinkPanelMeldekort.module.css';
import { MeldekortStatus } from 'components/meldekortstatus/MeldekortStatus';
import { Status } from 'lib/types/types';

interface Props {
  title: string;
  href: string;
  description?: string;
  status: Status;
}

export const LinkPanelMeldekort = ({ title, href, description, status }: Props) => {
  return (
    <a href={href} className={styles.link}>
      <div className={styles.top}>
        <BodyShort size={'large'} style={{ fontWeight: 'bold' }}>
          {title}
        </BodyShort>
        <div className={styles.topright}>
          <MeldekortStatus status={status} />
          <ChevronRightIcon fontSize={'1.6rem'} aria-hidden="true" />
        </div>
      </div>
      <BodyShort>{description}</BodyShort>
    </a>
  );
};
