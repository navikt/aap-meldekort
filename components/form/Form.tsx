import { Button } from '@navikt/ds-react';
import { FormEvent, ReactNode } from 'react';

import styles from './Form.module.css';
import { ArrowLeftIcon, ArrowRightIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/navigation';

interface Props {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  forrigeStegUrl?: string;
  nesteStegKnappTekst?: string;
  forrigeStegKnappTekst?: string;
}

export const Form = ({
  children,
  onSubmit,
  forrigeStegUrl,
  nesteStegKnappTekst = 'Neste',
  forrigeStegKnappTekst = 'Tilbake',
}: Props) => {
  const router = useRouter();

  return (
    <form onSubmit={onSubmit}>
      {children}
      <div className={styles.knapper}>
        {forrigeStegUrl && (
          <Button
            variant={'secondary'}
            type={'button'}
            onClick={() => {
              if (forrigeStegUrl) {
                router.push(forrigeStegUrl);
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
