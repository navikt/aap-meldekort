import { ChevronRightIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import styles from 'components/navigationpanel/NavigationPanel.module.css';
import { MeldekortStatus } from 'components/meldekortstatus/MeldekortStatus';
import { Link } from 'i18n/routing';
import { Status } from 'lib/types/types';

type Props = NavigationPanelButton | NavigationPanelLink;

interface BaseNavigationPanel {
  title: string;
  variant?: 'primary' | 'secondary';
  description?: string;
  status?: Status;
}

interface NavigationPanelButton extends BaseNavigationPanel {
  type: 'button';
  onClick: () => void;
}

interface NavigationPanelLink extends BaseNavigationPanel {
  type: 'link';
  href: string;
}

const NavigationPanelContent = ({ title, description, status }: BaseNavigationPanel) => (
  <div className={styles.content}>
    <div>
      <BodyShort size={'large'} weight={'semibold'}>
        {title}
      </BodyShort>
      {description && <BodyShort>{description}</BodyShort>}
    </div>
    <div className={styles.contentRight}>
      {status && <MeldekortStatus status={status} />}
      <ChevronRightIcon fontSize={'1.6rem'} aria-hidden="true" />
    </div>
  </div>
);

export const NavigationPanel = (props: Props) => {
  const className = props.variant === 'primary' ? styles.primary : styles.secondary;

  return props.type === 'link' ? (
    <Link href={props.href} className={`${styles.link} ${className}`}>
      <NavigationPanelContent {...props} />
    </Link>
  ) : (
    <button onClick={props.onClick} className={`${styles.link} ${className}`}>
      <NavigationPanelContent {...props} />
    </button>
  );
};
