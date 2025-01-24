export const storForbokstav = (value: string): string => {
  return value.charAt(0).toUpperCase().concat(value.slice(1).toLowerCase());
};

export function formaterTilNok(sum: number): string {
  return `${sum.toLocaleString(`nb-NO`)} kr`;
}
