import { useKorrigerMeldekort } from 'hooks/korrigerMeldekortHook';
import { FyllUtKorrigering } from 'components/flyt/korrigering/steg/fyllutkorrigering/FyllUtKorrigering';
import { SeOver } from 'components/flyt/korrigering/steg/seover/SeOver';
import { KvitteringKorrigering } from 'components/flyt/korrigering/steg/kvittering/KvitteringKorrigering';

export const KorrigeringSteg = () => {
  const { korrigering } = useKorrigerMeldekort();

  return (
    <>
      {korrigering.steg === 'FYLL_TIMER' && <FyllUtKorrigering />}
      {korrigering.steg === 'SE_OVER_TIMER' && <SeOver />}
      {korrigering.steg === 'KVITTERING' && <KvitteringKorrigering />}
    </>
  );
};
