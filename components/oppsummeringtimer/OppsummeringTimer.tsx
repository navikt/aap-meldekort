import { OppsummeringRad } from 'components/oppsummeringrad/OppsummeringRad';
import { useTranslations } from 'next-intl';

interface Props {
  timer: number;
}

export const OppsummeringTimer = ({ timer }: Props) => {
  const t = useTranslations();

  return <OppsummeringRad label={t('client.sammenlagtForPerioden.label')} value={`${timer} timer`} />;
};
