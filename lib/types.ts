export interface Meldeperiode {
  referanse: string;
  periode: { fom: string; tom: string };
}

export interface InnsendingMeldeperiode {
  referanse: string;
  dager: Dag[];
}

export interface Dag {
  dato: string;
  timer: number;
}
