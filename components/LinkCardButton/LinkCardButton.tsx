import { ReactNode } from 'react';

import styles from './LinkCardButton.module.css';

interface Props {
  title: string | ReactNode;
  onClick: () => void;
}

export const LinkCardButton = ({ title, onClick }: Props) => (
  <button className={styles.linkCardButton} onClick={onClick}>
    {title}
  </button>
);
