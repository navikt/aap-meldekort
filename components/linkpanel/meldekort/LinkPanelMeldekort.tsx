import { ChevronRightIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import styles from './LinkPanelMeldekort.module.css';
import { Status } from 'components/status/Status';

interface Props {
  title: string;
  href: string;
  description?: string;
  status?: string;
}

export const LinkPanelMeldekort = ({ title, href, description, status }: Props) => {
  return (
    <a href={href} className={styles.link}>
      <div className={styles.top}>
        <BodyShort size={'large'} style={{ fontWeight: 'bold' }}>
          {title}
        </BodyShort>
        <div className={styles.topright}>
          <Status status={'INNSENDT'} />
          <ChevronRightIcon fontSize={'1.6rem'} aria-hidden="true" />
        </div>
      </div>
      <BodyShort>{description}</BodyShort>
    </a>
  );
};
