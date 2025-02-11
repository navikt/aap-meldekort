import { useKorrigerMeldekort } from 'hooks/korrigerMeldekortHook';
import { FyllUtKorrigering } from 'components/flyt/korrigering/steg/fyllutkorrigering/FyllUtKorrigering';
import { SeOver } from 'components/flyt/korrigering/steg/seover/SeOver';
import { KvitteringKorrigering } from 'components/flyt/korrigering/steg/kvittering/KvitteringKorrigering';
import { KorrigeringSpørsmål } from './steg/korrigeringspørsmål/KorrigeringSpørsmål';

export const KorrigeringSteg = () => {
  const { korrigering } = useKorrigerMeldekort();

  return (
    <>
      {korrigering.steg === 'SPØRSMÅL' && <KorrigeringSpørsmål />}
      {korrigering.steg === 'FYLL_TIMER' && <FyllUtKorrigering />}
      {korrigering.steg === 'SE_OVER_TIMER' && <SeOver />}
      {korrigering.steg === 'KVITTERING' && <KvitteringKorrigering />}
    </>
  );
};
