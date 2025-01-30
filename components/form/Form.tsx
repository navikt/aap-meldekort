import { Alert, Button } from '@navikt/ds-react';
import { FormEvent, ReactNode } from 'react';

import styles from './Form.module.css';
import { ArrowLeftIcon, ArrowRightIcon } from '@navikt/aksel-icons';

interface Props {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  errorMessage?: string;
  forrigeStegOnClick?: () => void;
  nesteStegKnappTekst?: string;
  forrigeStegKnappTekst?: string;
  avbrytOnClick?: () => void;
}

export const Form = ({
  children,
  onSubmit,
  forrigeStegOnClick,
  avbrytOnClick,
  errorMessage,
  isLoading = false,
  nesteStegKnappTekst = 'Neste',
  forrigeStegKnappTekst = 'Tilbake',
}: Props) => {
  return (
    <form onSubmit={onSubmit}>
      {children}
      {errorMessage && <Alert variant={'error'}>{errorMessage}</Alert>}
      <div className={styles.knapper}>
        {forrigeStegOnClick && (
          <Button
            variant={'secondary'}
            type={'button'}
            onClick={forrigeStegOnClick}
            icon={<ArrowLeftIcon aria-hidden={'true'} />}
            iconPosition={'left'}
          >
            {forrigeStegKnappTekst}
          </Button>
        )}
        <Button
          variant={'primary'}
          icon={<ArrowRightIcon aria-hidden={'true'} />}
          iconPosition={'right'}
          loading={isLoading}
        >
          {nesteStegKnappTekst}
        </Button>
      </div>
      {avbrytOnClick && (
        <div className={styles.avbryt}>
          <Button variant={'tertiary'} onClick={avbrytOnClick} type={'button'}>
            Avbryt
          </Button>
        </div>
      )}
    </form>
  );
};
