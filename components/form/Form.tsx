import { Button } from '@navikt/ds-react';
import { FormEvent, ReactNode } from 'react';
import { Steg } from 'context/StegContext';
import { useSteg } from 'hooks/StegHook';

import styles from './Form.module.css';
import { ArrowLeftIcon, ArrowRightIcon } from '@navikt/aksel-icons';

interface Props {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  forrigeSteg?: Steg;
  nesteStegKnappTekst?: string;
  forrigeStegKnappTekst?: string;
}

export const Form = ({
  children,
  onSubmit,
  forrigeSteg,
  nesteStegKnappTekst = 'Neste',
  forrigeStegKnappTekst = 'Tilbake',
}: Props) => {
  const { setSteg } = useSteg();

  return (
    <form onSubmit={onSubmit}>
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
            {forrigeStegKnappTekst}
          </Button>
        )}
        <Button variant={'primary'} icon={<ArrowRightIcon />} iconPosition={'right'}>
          {nesteStegKnappTekst}
        </Button>
      </div>
    </form>
  );
};
