import { BodyShort, HStack, VStack } from '@navikt/ds-react';

import styles from 'components/navigationpanel/NavigationPanel.module.css';
import { Link } from 'i18n/routing';
import { ReactNode } from 'react';

type Props = NavigationPanelButton | NavigationPanelLink;

interface BaseNavigationPanel {
  title: string;
  description?: string;
  rightIcon: ReactNode;
  leftIcon?: ReactNode;
}

interface NavigationPanelButton extends BaseNavigationPanel {
  type: 'button';
  onClick: () => void;
}

interface NavigationPanelLink extends BaseNavigationPanel {
  type: 'link';
  href: string;
}

const NavigationPanelContent = ({ title, description, leftIcon, rightIcon }: BaseNavigationPanel) => (
  <HStack justify={'space-between'} align={'center'}>
    <HStack align={'center'} gap={'0 4'}>
      {leftIcon && <div className={styles.icon}>{leftIcon}</div>}
      <VStack align={'start'} gap={'1'}>
        <BodyShort size={'large'} weight={'semibold'}>
          {title}
        </BodyShort>
        {description && <BodyShort>{description}</BodyShort>}
      </VStack>
    </HStack>
    {rightIcon}
    {/*<ChevronRightIcon fontSize={'1.6rem'} aria-hidden="true" />*/}
  </HStack>
);

export const NavigationPanel = (props: Props) => {
  return props.type === 'link' ? (
    <Link href={props.href} className={styles.link}>
      <NavigationPanelContent {...props} />
    </Link>
  ) : (
    <button onClick={props.onClick} className={styles.link}>
      <NavigationPanelContent {...props} />
    </button>
  );
};
