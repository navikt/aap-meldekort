import { useKorrigerMeldekort } from 'hooks/korrigerMeldekortHook';
import { FyllUtKorrigering } from 'components/korrigering/steg/fyllutkorrigering/FyllUtKorrigering';
import { SeOver } from 'components/korrigering/steg/seover/SeOver';

export const KorrigeringSteg = () => {
  const { korrigering } = useKorrigerMeldekort();

  return (
    <>
      {korrigering.steg === 'FYLL_TIMER' && <FyllUtKorrigering />}
      {korrigering.steg === 'SE_OVER_TIMER' && <SeOver />}
      {korrigering.steg === 'KVITTERING' && <div>Kvittering</div>}
    </>
  );
};
