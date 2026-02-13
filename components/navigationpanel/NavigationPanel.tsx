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

const NavigationPanelContent = ({ title, description, leftIcon, rightIcon }: BaseNavigationPanel) => {
  return (
    <HStack justify={'space-between'} align={'center'}>
      <HStack align={'center'} gap={'space-0 space-16'}>
        {leftIcon && <div className={styles.icon}>{leftIcon}</div>}
        <VStack align={'start'} gap={'space-4'}>
          <BodyShort size={'large'} weight={'semibold'}>
            {title}
          </BodyShort>
          {description && <BodyShort size={'large'}>{description}</BodyShort>}
        </VStack>
      </HStack>
      {rightIcon}
    </HStack>
  );
};

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
