import styles from './LinkButton.module.css';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

interface Props {
  title: string;
  onClick: () => void;
}

export const LinkButton = ({ title, onClick }: Props) => {
  return (
    <button onClick={onClick} className={styles.linkbutton}>
      <BodyShort size={'large'} style={{ fontWeight: 'bold' }}>
        {title}
      </BodyShort>
      <ChevronRightIcon fontSize={'1.6rem'} />
    </button>
  );
};
