export const FLAGS = [
  'VisAvslagsaarsaker', // eksemplel fra aap-saksbehandling
] as const;

export type FlagNames = (typeof FLAGS)[number];
export type Flags = Record<FlagNames, boolean>;

export const mockedFlags: Flags = {
  VisAvslagsaarsaker: true, // eksempel fra aap-saksbehandling
};
