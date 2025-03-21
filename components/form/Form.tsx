import { Alert, Button, Detail } from '@navikt/ds-react';
import { FormEvent, ReactNode, useRef } from 'react';

import styles from './Form.module.css';
import { ArrowLeftIcon, ArrowRightIcon } from '@navikt/aksel-icons';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { SlettMeldekortModal } from 'components/slettmeldekortmodal/SlettMeldekortModal';
import { useTranslations } from 'next-intl';
import { FortsettSenereModal } from 'components/fortsettseneremodal/FortsettSenereModal';
import { InnsendingType, useParamsMedType } from 'lib/utils/url';

interface Props {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  sistLagret?: Date;
  isLoading?: boolean;
  errorMessage?: string;
  forrigeStegOnClick?: () => void;
  nesteStegKnappTekst?: string;
  visNesteKnapp?: boolean;
}

export const Form = ({
  children,
  onSubmit,
  forrigeStegOnClick,
  sistLagret,
  errorMessage,
  isLoading = false,
  nesteStegKnappTekst = 'Neste',
  visNesteKnapp = true,
}: Props) => {
  const t = useTranslations();
  const { innsendingtype } = useParamsMedType();
  const avbrytModalRef = useRef<HTMLDialogElement>(null);
  const fortsettSenereModalRef = useRef<HTMLDialogElement>(null);

  return (
    <form onSubmit={onSubmit} autoComplete={'off'} className={styles.form}>
      {children}
      {errorMessage && <Alert variant={'error'}>{errorMessage}</Alert>}
      <div className={styles.knapper}>
        {visNesteKnapp && (
          <Button
            variant={'primary'}
            icon={<ArrowRightIcon aria-hidden={'true'} />}
            iconPosition={'right'}
            loading={isLoading}
          >
            {nesteStegKnappTekst}
          </Button>
        )}
        {forrigeStegOnClick && (
          <Button
            variant={'secondary'}
            type={'button'}
            onClick={forrigeStegOnClick}
            icon={<ArrowLeftIcon aria-hidden={'true'} />}
            iconPosition={'left'}
          >
            {t('client.form.forrigeStegKnapp')}
          </Button>
        )}
      </div>
      <div className={styles.formfooter}>
        {sistLagret && <Detail>Sist lagret: {formaterDatoMedTidspunktForFrontend(sistLagret)}</Detail>}
        <div className={styles.secondaryknapper}>
          {innsendingtype === InnsendingType.INNSENDING && (
            <>
              <Button variant={'tertiary'} onClick={() => fortsettSenereModalRef.current?.showModal()} type={'button'}>
                Fortsett senere
              </Button>
              <FortsettSenereModal ref={fortsettSenereModalRef} />
            </>
          )}
          <Button variant={'tertiary'} onClick={() => avbrytModalRef.current?.showModal()} type={'button'}>
            Avbryt
          </Button>
          <SlettMeldekortModal ref={avbrytModalRef} />
        </div>
      </div>
    </form>
  );
};
