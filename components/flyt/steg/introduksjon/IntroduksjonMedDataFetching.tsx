import { Introduksjon } from 'components/flyt/steg/introduksjon/Introduksjon';
import {hentUtfylling} from "lib/services/meldekortservice";

interface Props {
  referanse: string;
}

export const IntroduksjonMedDataFetching = async ({ referanse }: Props) => {
  const utfylling = await hentUtfylling(referanse);

  return <Introduksjon utfylling={utfylling} referanse={referanse} />;
};
