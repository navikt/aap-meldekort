import { OppsummeringRad } from 'components/oppsummeringrad/OppsummeringRad';
import { regnUtProsent } from 'lib/utils/meldekort';
import { useTranslations } from 'next-intl';

interface Props {
  timer: number;
}

export const OppsummeringTimer = ({ timer }: Props) => {
  const t = useTranslations();
  const antallTimerIProsent = regnUtProsent(timer);

  return (
    <OppsummeringRad
      label={t('client.sammenlagtForPerioden.label')}
      value={`${timer} timer (${antallTimerIProsent}%)`}
    />
  );
};
