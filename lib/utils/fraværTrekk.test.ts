import { FraværDag } from 'components/flyt/steg/fraværutfylling/FraværUtfylling';
import { antallDagerSomFørerTilTrekk, TidligereRegistrertFravær, skalViseTrekkTag } from 'lib/utils/fraværTrekk';
import { describe, expect, it } from 'vitest';

function lagDag(dato: string, fravær: FraværDag['fravær']): FraværDag {
  return { dato: new Date(dato), fravær };
}

const ingenTidligereFravær: TidligereRegistrertFravær = {
  totaltAntallFraværsdager: 0,
  omsorgBarn: 0,
  omsorgDødsfall: 0,
};

describe('skalViseTrekkTag', () => {
  describe('total antall fraværsdager', () => {
    it('viser tag for dag 11 og utover', () => {
      const dager = Array.from({ length: 11 }, (_, i) =>
        lagDag(`2025-12-${String(i + 1).padStart(2, '0')}`, 'SYKDOM_ELLER_SKADE')
      );
      const ellevteDag = dager[10];
      expect(skalViseTrekkTag(ellevteDag, dager, ingenTidligereFravær)).toBe(true);
    });

    it('viser ikke tag for dag 1-10', () => {
      const dager = Array.from({ length: 11 }, (_, i) =>
        lagDag(`2025-12-${String(i + 1).padStart(2, '0')}`, 'SYKDOM_ELLER_SKADE')
      );
      for (let i = 0; i < 10; i++) {
        expect(skalViseTrekkTag(dager[i], dager, ingenTidligereFravær)).toBe(false);
      }
    });

    it('skal vise tag for alle dager når det tidligere er registrert over 10 dager med fravær', () => {
      const dager = [lagDag('2025-12-01', 'SYKDOM_ELLER_SKADE'), lagDag('2025-12-02', 'SYKDOM_ELLER_SKADE')];
      const tidligereFravær: TidligereRegistrertFravær = {
        ...ingenTidligereFravær,
        totaltAntallFraværsdager: 10,
      };
      expect(skalViseTrekkTag(dager[0], dager, tidligereFravær)).toBe(true);
      expect(skalViseTrekkTag(dager[1], dager, tidligereFravær)).toBe(true);
    });

    it('tag skal vises fra og med dag 11 når man registrerer mer enn 10 dager med fravær', () => {
      const dager = [
        lagDag('2025-12-01', 'SYKDOM_ELLER_SKADE'),
        lagDag('2025-12-02', 'SYKDOM_ELLER_SKADE'),
        lagDag('2025-12-03', 'SYKDOM_ELLER_SKADE'),
        lagDag('2025-12-04', 'SYKDOM_ELLER_SKADE'),
      ];
      const tidligereFravær: TidligereRegistrertFravær = {
        ...ingenTidligereFravær,
        totaltAntallFraværsdager: 8,
      };
      expect(skalViseTrekkTag(dager[0], dager, tidligereFravær)).toBe(false);
      expect(skalViseTrekkTag(dager[1], dager, tidligereFravær)).toBe(false);
      expect(skalViseTrekkTag(dager[2], dager, tidligereFravær)).toBe(true);
      expect(skalViseTrekkTag(dager[3], dager, tidligereFravær)).toBe(true);
    });
  });

  describe('annet fravær', () => {
    it('viser ikke tag ved kun én dag med fravær ANNEN', () => {
      const dager = [lagDag('2025-12-01', 'ANNEN')];
      expect(skalViseTrekkTag(dager[0], dager, ingenTidligereFravær)).toBe(false);
    });

    it('viser tag for alle dager med fravær ANNEN når to eller flere dager er markert med ANNEN', () => {
      const dager = [lagDag('2025-12-01', 'ANNEN'), lagDag('2025-12-02', 'ANNEN')];
      expect(skalViseTrekkTag(dager[0], dager, ingenTidligereFravær)).toBe(true);
      expect(skalViseTrekkTag(dager[1], dager, ingenTidligereFravær)).toBe(true);
    });

    it('viser ikke tag for dag med ANNEN fravær når det kun er en dag selv om det finnes andre fraværsgrunner', () => {
      const dager = [lagDag('2025-12-01', 'ANNEN'), lagDag('2025-12-02', 'SYKDOM_ELLER_SKADE')];
      expect(skalViseTrekkTag(dager[0], dager, ingenTidligereFravær)).toBe(false);
    });
  });

  describe('fravær pga omsorg for barn', () => {
    const omsorgBarnFravær = 'OMSORG_FØRSTE_SKOLEDAG_TILVENNING_ELLER_ANNEN_OPPFØLGING_BARN';

    it('viser ikke tag for de første 3 dagene', () => {
      const dager = [
        lagDag('2025-12-01', omsorgBarnFravær),
        lagDag('2025-12-02', omsorgBarnFravær),
        lagDag('2025-12-03', omsorgBarnFravær),
      ];
      for (const dag of dager) {
        expect(skalViseTrekkTag(dag, dager, ingenTidligereFravær)).toBe(false);
      }
    });

    it('viser tag for alle dager etter fjerde dag ', () => {
      const dager = [
        lagDag('2025-12-01', omsorgBarnFravær),
        lagDag('2025-12-02', omsorgBarnFravær),
        lagDag('2025-12-03', omsorgBarnFravær),
        lagDag('2025-12-04', omsorgBarnFravær),
        lagDag('2025-12-05', omsorgBarnFravær),
      ];
      expect(skalViseTrekkTag(dager[3], dager, ingenTidligereFravær)).toBe(true);
      expect(skalViseTrekkTag(dager[4], dager, ingenTidligereFravær)).toBe(true);
    });

    it('viser tag for alle dager når det tidligere er brukt over 3 dager', () => {
      const dager = [lagDag('2025-12-01', omsorgBarnFravær)];
      const tidligereFravær: TidligereRegistrertFravær = {
        ...ingenTidligereFravær,
        omsorgBarn: 3,
      };
      expect(skalViseTrekkTag(dager[0], dager, tidligereFravær)).toBe(true);
    });

    it('viser tag når totalt antall dager overstiger 3 dager', () => {
      const dager = [lagDag('2025-12-01', omsorgBarnFravær), lagDag('2025-12-02', omsorgBarnFravær)];
      const tidligereFravær: TidligereRegistrertFravær = {
        ...ingenTidligereFravær,
        omsorgBarn: 2,
      };
      expect(skalViseTrekkTag(dager[0], dager, tidligereFravær)).toBe(false);
      expect(skalViseTrekkTag(dager[1], dager, tidligereFravær)).toBe(true);
    });
  });

  describe('fravær pga dødsfall', () => {
    const dødsfallFravær = 'OMSORG_DØDSFALL_I_FAMILIE_ELLER_VENNEKRETS';

    it('viser ikke tag for de første 3 dagene', () => {
      const dager = [
        lagDag('2025-12-01', dødsfallFravær),
        lagDag('2025-12-02', dødsfallFravær),
        lagDag('2025-12-03', dødsfallFravær),
      ];
      for (const dag of dager) {
        expect(skalViseTrekkTag(dag, dager, ingenTidligereFravær)).toBe(false);
      }
    });

    it('viser tag for alle dager etter fjerde dag ', () => {
      const dager = [
        lagDag('2025-12-01', dødsfallFravær),
        lagDag('2025-12-02', dødsfallFravær),
        lagDag('2025-12-03', dødsfallFravær),
        lagDag('2025-12-04', dødsfallFravær),
        lagDag('2025-12-05', dødsfallFravær),
      ];
      expect(skalViseTrekkTag(dager[3], dager, ingenTidligereFravær)).toBe(true);
      expect(skalViseTrekkTag(dager[4], dager, ingenTidligereFravær)).toBe(true);
    });

    it('viser tag for alle dager når det tidligere er brukt over 3 dager', () => {
      const tidligereFravær: TidligereRegistrertFravær = {
        ...ingenTidligereFravær,
        omsorgDødsfall: 3,
      };

      const dager = [lagDag('2025-12-01', dødsfallFravær)];
      expect(skalViseTrekkTag(dager[0], dager, tidligereFravær)).toBe(true);
    });

    it('viser tag når totalt antall dager overstiger 3 dager', () => {
      const tidligereFravær: TidligereRegistrertFravær = {
        ...ingenTidligereFravær,
        omsorgDødsfall: 2,
      };

      const dager = [lagDag('2025-12-01', dødsfallFravær), lagDag('2025-12-02', dødsfallFravær)];
      expect(skalViseTrekkTag(dager[0], dager, tidligereFravær)).toBe(false);
      expect(skalViseTrekkTag(dager[1], dager, tidligereFravær)).toBe(true);
    });
  });

  describe('kombinasjoner av fraværstyper', () => {
    it('skal vise tag for dag 11 selv om selv om kvoten for kategorien ikke er brukt opp', () => {
      const dager = [
        ...Array.from({ length: 10 }, (_, i) =>
          lagDag(`2025-12-${String(i + 1).padStart(2, '0')}`, 'SYKDOM_ELLER_SKADE')
        ),
        lagDag('2025-12-11', 'OMSORG_DØDSFALL_I_FAMILIE_ELLER_VENNEKRETS'),
      ];
      const ellevteDagMedFravær = dager[10];
      expect(skalViseTrekkTag(ellevteDagMedFravær, dager, ingenTidligereFravær)).toBe(true);
    });

    it('skal ikke vise tag når bruker har tre dager fravær pga dødsfall og tre dager pga omsorg for barn', () => {
      const dager = [
        lagDag('2025-12-01', 'OMSORG_FØRSTE_SKOLEDAG_TILVENNING_ELLER_ANNEN_OPPFØLGING_BARN'),
        lagDag('2025-12-02', 'OMSORG_FØRSTE_SKOLEDAG_TILVENNING_ELLER_ANNEN_OPPFØLGING_BARN'),
        lagDag('2025-12-03', 'OMSORG_FØRSTE_SKOLEDAG_TILVENNING_ELLER_ANNEN_OPPFØLGING_BARN'),
        lagDag('2025-12-04', 'OMSORG_DØDSFALL_I_FAMILIE_ELLER_VENNEKRETS'),
        lagDag('2025-12-05', 'OMSORG_DØDSFALL_I_FAMILIE_ELLER_VENNEKRETS'),
        lagDag('2025-12-06', 'OMSORG_DØDSFALL_I_FAMILIE_ELLER_VENNEKRETS'),
      ];

      for (const dag of dager) {
        expect(skalViseTrekkTag(dag, dager)).toBe(false);
      }
    });

    it('skal vise tag for den fjerde dagen med fravær for omsorg for barn når bruker har tre dager fravær pga dødsfall og fire dager pga omsorg for barn', () => {
      const dager = [
        lagDag('2025-12-01', 'OMSORG_FØRSTE_SKOLEDAG_TILVENNING_ELLER_ANNEN_OPPFØLGING_BARN'),
        lagDag('2025-12-02', 'OMSORG_FØRSTE_SKOLEDAG_TILVENNING_ELLER_ANNEN_OPPFØLGING_BARN'),
        lagDag('2025-12-03', 'OMSORG_FØRSTE_SKOLEDAG_TILVENNING_ELLER_ANNEN_OPPFØLGING_BARN'),
        lagDag('2025-12-04', 'OMSORG_DØDSFALL_I_FAMILIE_ELLER_VENNEKRETS'),
        lagDag('2025-12-05', 'OMSORG_DØDSFALL_I_FAMILIE_ELLER_VENNEKRETS'),
        lagDag('2025-12-06', 'OMSORG_DØDSFALL_I_FAMILIE_ELLER_VENNEKRETS'),
        lagDag('2025-12-07', 'OMSORG_FØRSTE_SKOLEDAG_TILVENNING_ELLER_ANNEN_OPPFØLGING_BARN'),
      ];
      const sisteDag = dager.at(-1);
      expect(skalViseTrekkTag(sisteDag!, dager)).toBe(true);
    });
  });
});

describe('antallDagerSomFørerTilTrekk', () => {
  it('returnerer 0 når ingen dager fører til trekk', () => {
    const dager = [lagDag('2025-12-01', 'SYKDOM_ELLER_SKADE'), lagDag('2025-12-02', 'SYKDOM_ELLER_SKADE')];
    expect(antallDagerSomFørerTilTrekk(dager, ingenTidligereFravær)).toBe(0);
  });

  // TODO tidligere fravær skal ikke telle med for perioden, så 12 dager tidligere men 0 nå skal gi 0... sjekk om det er dekket
  it('returnerer 0 når det ikke er lagt inn noe fravær', () => {
    expect(antallDagerSomFørerTilTrekk([], ingenTidligereFravær)).toBe(0);
  });

  describe('annet fravær', () => {
    it('returnerer 0 ved én dag med fravær ANNEN', () => {
      const dager = [lagDag('2025-12-01', 'ANNEN')];
      expect(antallDagerSomFørerTilTrekk(dager, ingenTidligereFravær)).toBe(0);
    });

    it('returnerer antall dager med fravær ALLE når det er 2 eller flere', () => {
      const toDager = [lagDag('2025-12-01', 'ANNEN'), lagDag('2025-12-02', 'ANNEN')];
      expect(antallDagerSomFørerTilTrekk(toDager, ingenTidligereFravær)).toBe(2);

      const treDager = [lagDag('2025-12-01', 'ANNEN'), lagDag('2025-12-02', 'ANNEN'), lagDag('2025-12-03', 'ANNEN')];
      expect(antallDagerSomFørerTilTrekk(treDager, ingenTidligereFravær)).toBe(3);
    });
  });

  describe('omsorg av barn', () => {
    const omsorgBarnFravær = 'OMSORG_FØRSTE_SKOLEDAG_TILVENNING_ELLER_ANNEN_OPPFØLGING_BARN';

    it('returnerer 0 for inntil 3 dager', () => {
      const dager = [
        lagDag('2025-12-01', omsorgBarnFravær),
        lagDag('2025-12-02', omsorgBarnFravær),
        lagDag('2025-12-03', omsorgBarnFravær),
      ];
      expect(antallDagerSomFørerTilTrekk(dager, ingenTidligereFravær)).toBe(0);
    });

    it('returnerer antall dager over kvoten', () => {
      const dager = [
        lagDag('2025-12-01', omsorgBarnFravær),
        lagDag('2025-12-02', omsorgBarnFravær),
        lagDag('2025-12-03', omsorgBarnFravær),
        lagDag('2025-12-04', omsorgBarnFravær),
        lagDag('2025-12-05', omsorgBarnFravær),
      ];
      expect(antallDagerSomFørerTilTrekk(dager, ingenTidligereFravær)).toBe(2);
    });

    it('tar hensyn til tidligere registrerte dager', () => {
      const tidligereFravær: TidligereRegistrertFravær = { ...ingenTidligereFravær, omsorgBarn: 2 };
      const dager = [lagDag('2025-12-01', omsorgBarnFravær), lagDag('2025-12-02', omsorgBarnFravær)];

      expect(antallDagerSomFørerTilTrekk(dager, tidligereFravær)).toBe(1);
    });
  });

  describe('omsorg ved dødsfall', () => {
    const dødsfallFravær = 'OMSORG_DØDSFALL_I_FAMILIE_ELLER_VENNEKRETS';

    it('returnerer 0 for inntil 3 dager', () => {
      const dager = [
        lagDag('2025-12-01', dødsfallFravær),
        lagDag('2025-12-02', dødsfallFravær),
        lagDag('2025-12-03', dødsfallFravær),
      ];
      expect(antallDagerSomFørerTilTrekk(dager, ingenTidligereFravær)).toBe(0);
    });

    it('returnerer antall dager over kvoten', () => {
      const dager = [
        lagDag('2025-12-01', dødsfallFravær),
        lagDag('2025-12-02', dødsfallFravær),
        lagDag('2025-12-03', dødsfallFravær),
        lagDag('2025-12-04', dødsfallFravær),
      ];
      expect(antallDagerSomFørerTilTrekk(dager, ingenTidligereFravær)).toBe(1);
    });

    it('tar hensyn til tidligere registrerte dager', () => {
      const tidligereFravær: TidligereRegistrertFravær = { ...ingenTidligereFravær, omsorgDødsfall: 3 };
      const dager = [lagDag('2025-12-01', dødsfallFravær), lagDag('2025-12-02', dødsfallFravær)];
      expect(antallDagerSomFørerTilTrekk(dager, tidligereFravær)).toBe(2);
    });
  });

  describe('total antall fraværsdager', () => {
    it('returnerer antall dager over 10 totalt', () => {
      const dager = Array.from({ length: 13 }, (_, i) =>
        lagDag(`2025-12-${String(i + 1).padStart(2, '0')}`, 'SYKDOM_ELLER_SKADE')
      );
      expect(antallDagerSomFørerTilTrekk(dager, ingenTidligereFravær)).toBe(3);
    });

    it('tar hensyn til tidligere registrerte totaldager', () => {
      const dager = [
        lagDag('2025-12-01', 'SYKDOM_ELLER_SKADE'),
        lagDag('2025-12-02', 'SYKDOM_ELLER_SKADE'),
        lagDag('2025-12-03', 'SYKDOM_ELLER_SKADE'),
      ];
      const tidligereFravær: TidligereRegistrertFravær = { ...ingenTidligereFravær, totaltAntallFraværsdager: 9 };
      // Dag 1 er posisjon 10 → OK. Dag 2 og 3 er posisjon 11 og 12 → trekk
      expect(antallDagerSomFørerTilTrekk(dager, tidligereFravær)).toBe(2);
    });
  });

  describe('ingen tidligere fravær oppgitt', () => {
    it('fungerer uten å oppgi tidligere fravær', () => {
      const dager = [lagDag('2025-12-01', 'ANNEN'), lagDag('2025-12-02', 'ANNEN')];
      expect(antallDagerSomFørerTilTrekk(dager)).toBe(2);
    });
  });
});
