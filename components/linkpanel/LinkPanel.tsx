import styles from 'components/linkpanel/LinkPanel.module.css';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

interface Props {
  title: string;
  href: string;
}

export const LinkPanel = ({ title, href }: Props) => {
  return (
    <a href={href} className={styles.link}>
      <BodyShort size={'large'} style={{ fontWeight: 'bold' }}>
        {title}
      </BodyShort>
      <ChevronRightIcon fontSize={'1.6rem'} aria-hidden="true" />
    </a>
  );
};
