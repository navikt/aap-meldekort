import { Button } from '@navikt/ds-react';
import { FormEvent, ReactNode } from 'react';

import styles from './Form.module.css';
import { ArrowLeftIcon, ArrowRightIcon } from '@navikt/aksel-icons';

interface Props {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  forrigeSteg?: string;
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
                // TODO Her må vi håndtere at bruker kan gå tilbake til forrige steg
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
