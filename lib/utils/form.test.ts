import { describe, expect, it } from 'vitest';
import { erJaNeiSpørsmålBesvart, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';

describe('getJaNeiEllerUndefined', () => {
  it('mapper undefined til undefined', () => {
    expect(getJaNeiEllerUndefined(undefined)).toBeUndefined();
  });

  it('mapper null til undefined', () => {
    expect(getJaNeiEllerUndefined(null)).toBeUndefined();
  });

  it('mapper false til Nei', () => {
    expect(getJaNeiEllerUndefined(false)).toBe(JaEllerNei.Nei);
  });

  it('mapper true til Ja', () => {
    expect(getJaNeiEllerUndefined(true)).toBe(JaEllerNei.Ja);
  });

  it('skiller ubesvart fra Nei', () => {
    expect(getJaNeiEllerUndefined(undefined)).not.toBe(JaEllerNei.Nei);
    expect(getJaNeiEllerUndefined(null)).not.toBe(JaEllerNei.Nei);
  });
});

describe('erJaNeiSpørsmålBesvart', () => {
  it('er false for undefined', () => {
    expect(erJaNeiSpørsmålBesvart(undefined)).toBe(false);
  });

  it('er false for null', () => {
    expect(erJaNeiSpørsmålBesvart(null)).toBe(false);
  });

  it('er true for Ja', () => {
    expect(erJaNeiSpørsmålBesvart(JaEllerNei.Ja)).toBe(true);
  });

  it('er true for Nei', () => {
    expect(erJaNeiSpørsmålBesvart(JaEllerNei.Nei)).toBe(true);
  });

  it('er false for verdien getJaNeiEllerUndefined gir for et ubesvart felt', () => {
    expect(erJaNeiSpørsmålBesvart(getJaNeiEllerUndefined(undefined))).toBe(false);
    expect(erJaNeiSpørsmålBesvart(getJaNeiEllerUndefined(null))).toBe(false);
  });
});
