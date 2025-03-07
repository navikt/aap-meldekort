import { format, getISOWeek, isValid, parse } from 'date-fns';
import { nb } from 'date-fns/locale';

export const DATO_FORMATER = {
  ddMM: 'dd.MM',
  ddMMyyyy: 'dd.MM.yyyy',
  ddMMMyyyy: 'dd. MMM yyyy',
  ddMMyyyy_HHmm: 'dd.MM.yyyy HH:mm',
  ddMMyyyy_HHmmss: 'dd.MM.yyyy HH:mm:ss',
};

export function formaterDatoMedÅrForFrontend(dato: Date | string): string {
  return format(dato, DATO_FORMATER.ddMMyyyy, { locale: nb });
}
export function formaterDatoUtenÅrForFrontend(dato: Date | string): string {
  return format(dato, DATO_FORMATER.ddMM, { locale: nb });
}

export function formaterDatoMedTidspunktForFrontend(dato: Date | string): string {
  return format(dato, DATO_FORMATER.ddMMyyyy_HHmm, { locale: nb });
}

export const formaterDatoForBackend = (dato: Date) => {
  return format(dato, 'yyyy-MM-dd');
};

export const stringToDate = (value?: string | null, format: string = 'yyyy-MM-dd') => {
  if (!value) {
    return undefined;
  }
  const parsedDate = parse(value, format, new Date());
  return isValid(parsedDate) ? parsedDate : undefined;
};

export function sorterEtterNyesteDato(a: string, b: string) {
  return new Date(b).getTime() - new Date(a).getTime();
}

export const parseDatoFraDatePicker = (value?: string | Date): Date | undefined => {
  if (value instanceof Date) {
    return value;
  }
  return stringToDate(value, 'dd.MM.yyyy');
};

export function hentUkeNummerForPeriode(fraDato: Date, tilDato: Date): string {
  const fraDatoUkenummer = getISOWeek(fraDato);
  const tilDatoUkenummer = getISOWeek(tilDato);

  return `${fraDatoUkenummer} - ${tilDatoUkenummer}`;
}

export function hentUkeNummerForDato(dato: Date) {
  return getISOWeek(dato);
}
