import { FraværDag } from 'components/flyt/steg/fraværutfylling/FraværUtfylling';
import { isSameDay } from 'date-fns';
import { sorterEtterEldsteDatoDate } from 'lib/utils/date';

// kladd, må komme fra backend
export interface TidligereRegistrertFravær {
  totaltAntallFraværsdager: number;
  omsorgBarn: number;
  omsorgDødsfall: number;
}

const MAKS_TOTAL_DAGER = 10; // gjelder hele året
const MAKS_ANTALL_OMSORG_BARN_DAGER = 3; // gjelder hele året
const MAKS_ANTALL_OMSORG_DØDSFALL_DAGER = 3; // gjelder hele året
const MAKS_ANTALL_ANNEN_DAGER_I_PERIODEN = 1; // gjelder meldeperioden

export function skalViseTrekkTag(
  dag: FraværDag,
  alleDager: FraværDag[],
  tidligereRegistrertFravær?: TidligereRegistrertFravær
): boolean {
  const sorterteDager = alleDager.toSorted((a, b) => sorterEtterEldsteDatoDate(a.dato, b.dato));
  const dagIndexIPeriode = sorterteDager.findIndex((f) => isSameDay(f.dato, dag.dato));

  const posisjon = (tidligereRegistrertFravær?.totaltAntallFraværsdager ?? 0) + dagIndexIPeriode + 1;
  if (posisjon > MAKS_TOTAL_DAGER) {
    return true;
  }

  if (dag.fravær === 'ANNEN') {
    const antallDagerMedANNEN = alleDager.filter((f) => f.fravær === 'ANNEN').length;
    return antallDagerMedANNEN > MAKS_ANTALL_ANNEN_DAGER_I_PERIODEN;
  }

  if (dag.fravær === 'OMSORG_FØRSTE_SKOLEDAG_TILVENNING_ELLER_ANNEN_OPPFØLGING_BARN') {
    const kategoridager = alleDager
      .filter((f) => f.fravær === 'OMSORG_FØRSTE_SKOLEDAG_TILVENNING_ELLER_ANNEN_OPPFØLGING_BARN')
      .toSorted((a, b) => sorterEtterEldsteDatoDate(a.dato, b.dato));

    const dagIndexIKategori = kategoridager.findIndex((f) => isSameDay(f.dato, dag.dato));
    const dagnummer = (tidligereRegistrertFravær?.omsorgBarn ?? 0) + dagIndexIKategori + 1;
    return dagnummer > MAKS_ANTALL_OMSORG_BARN_DAGER;
  }

  if (dag.fravær === 'OMSORG_DØDSFALL_I_FAMILIE_ELLER_VENNEKRETS') {
    const kategoridager = alleDager
      .filter((f) => f.fravær === 'OMSORG_DØDSFALL_I_FAMILIE_ELLER_VENNEKRETS')
      .toSorted((a, b) => sorterEtterEldsteDatoDate(a.dato, b.dato));

    const dagIndexIKategori = kategoridager.findIndex((f) => isSameDay(f.dato, dag.dato));
    const dagnummer = (tidligereRegistrertFravær?.omsorgDødsfall ?? 0) + dagIndexIKategori + 1;
    return dagnummer > MAKS_ANTALL_OMSORG_DØDSFALL_DAGER;
  }

  return false;
}

export function antallDagerSomFørerTilTrekk(
  alleDager: FraværDag[],
  tidligereRegistrertFravær?: TidligereRegistrertFravær
): number {
  return alleDager.filter((dag) => skalViseTrekkTag(dag, alleDager, tidligereRegistrertFravær)).length;
}
