export const FLAGS = [
  'MeldekortTekstendringer',
] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

export const mockedFlags: Flags = {
  MeldekortTekstendringer: true,
};
