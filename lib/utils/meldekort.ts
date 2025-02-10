import { DagerInfo } from 'lib/types/types';

export function regnUtTimer(timerArbeidet?: DagerInfo[] | null): number {
  if (!timerArbeidet) {
    return 0;
  }

  return timerArbeidet.reduce((acc, dag) => acc + (dag.timerArbeidet ? Number(dag.timerArbeidet) : 0), 0);
}

const antallTimerIMeldepliktPerioden = 37.5 * 2;
export function regnUtProsent(timer: number): number {
  return Math.round((timer / antallTimerIMeldepliktPerioden) * 100);
}


