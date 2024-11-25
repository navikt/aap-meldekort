import { Button } from '@navikt/ds-react';
import { ReactNode } from 'react';
import { Steg } from 'context/StegContext';
import { useSteg } from 'hooks/StegHook';

interface Props {
  children: ReactNode;
  nesteSteg: Steg;
  forrigeSteg: Steg;
}

export const Form = ({ children, nesteSteg, forrigeSteg }: Props) => {
  const { setSteg } = useSteg();
  return (
    <form>
      {children}
      <div>
        <Button variant={'secondary'} type={'button'} onClick={() => setSteg(forrigeSteg)}>
          Tilbake
        </Button>
        <Button variant={'primary'} onClick={() => setSteg(nesteSteg)}>
          Neste
        </Button>
      </div>
    </form>
  );
};
