import { Button } from '@navikt/ds-react';
import { ReactNode } from 'react';
import { Steg } from 'context/StegContext';
import { useSteg } from 'hooks/StegHook';

import styles from './Form.module.css';
import { ArrowLeftIcon, ArrowRightIcon } from '@navikt/aksel-icons';

interface Props {
  children: ReactNode;
  nesteSteg: Steg;
  forrigeSteg?: Steg;
}

export const Form = ({ children, nesteSteg, forrigeSteg }: Props) => {
  const { setSteg } = useSteg();

  return (
    <form>
      {children}
      <div className={styles.knapper}>
        {forrigeSteg && (
          <Button
            variant={'secondary'}
            type={'button'}
            onClick={() => {
              if (forrigeSteg) {
                setSteg(forrigeSteg);
              }
            }}
            icon={<ArrowLeftIcon />}
            iconPosition={'left'}
          >
            Tilbake
          </Button>
        )}
        <Button variant={'primary'} onClick={() => setSteg(nesteSteg)} icon={<ArrowRightIcon />} iconPosition={'right'}>
          Neste
        </Button>
      </div>
    </form>
  );
};
