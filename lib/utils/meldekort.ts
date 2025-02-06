import { TimerArbeidet } from 'lib/types/types';

export function regnUtTimer(timerArbeidet?: TimerArbeidet[] | null) {
  if (!timerArbeidet) {
    return 0;
  }

  return timerArbeidet.reduce((acc, dag) => acc + (dag.timer ? Number(dag.timer) : 0), 0);
}

const antallTimerIMeldepliktPerioden = 37.5 * 2;
export function regnUtProsent(timer: number): number {
  return Math.round((timer / antallTimerIMeldepliktPerioden) * 100);
}


