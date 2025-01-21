import { Alert, Button } from '@navikt/ds-react';
import { FormEvent, ReactNode } from 'react';

import styles from './Form.module.css';
import { ArrowLeftIcon, ArrowRightIcon } from '@navikt/aksel-icons';
import { useParams, useRouter } from 'next/navigation';
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
  const params = useParams<{ system: string }>();

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
                router.push(`/${params.system}/${referanse}/${forrigeSteg}`);
              }
            }}
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
    </form>
  );
};
