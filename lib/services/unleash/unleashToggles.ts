export const FLAGS = ['AnsvarligSystemV2', 'InformerOmTidligMeldedag16Des26IMeldekortflaten'] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

export const mockedFlags: Flags = {
  AnsvarligSystemV2: true,
  InformerOmTidligMeldedag16Des26IMeldekortflaten: false,
};
