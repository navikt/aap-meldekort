export const FLAGS = ['InformerOmTidligMeldedag16Des26IMeldekortflaten'] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

export const mockedFlags: Flags = {
  InformerOmTidligMeldedag16Des26IMeldekortflaten: false,
};
