import { Alert, Button } from '@navikt/ds-react';
import { FormEvent, ReactNode } from 'react';

import styles from './Form.module.css';
import { ArrowLeftIcon, ArrowRightIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/navigation';
import { Steg } from 'lib/types/types';

interface Props {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  referanse: string;
  isLoading: boolean;
  errorMessage?: string;
  forrigeSteg?: Steg;
  nesteStegKnappTekst?: string;
  forrigeStegKnappTekst?: string;
}

export const Form = ({
  children,
  onSubmit,
  forrigeSteg,
  referanse,
  isLoading,
  errorMessage,
  nesteStegKnappTekst = 'Neste',
  forrigeStegKnappTekst = 'Tilbake',
}: Props) => {
  const router = useRouter();

  return (
    <form onSubmit={onSubmit}>
      {children}
      {errorMessage && <Alert variant={'error'}>{errorMessage}</Alert>}
      <div className={styles.knapper}>
        {forrigeSteg && (
          <Button
            variant={'secondary'}
            type={'button'}
            onClick={() => {
              if (forrigeSteg) {
                router.push(`/${referanse}/${forrigeSteg}`);
              }
            }}
            icon={<ArrowLeftIcon />}
            iconPosition={'left'}
          >
            {forrigeStegKnappTekst}
          </Button>
        )}
        <Button variant={'primary'} icon={<ArrowRightIcon />} iconPosition={'right'} loading={isLoading}>
          {nesteStegKnappTekst}
        </Button>
      </div>
    </form>
  );
};
