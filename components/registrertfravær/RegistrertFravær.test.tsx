import { render, screen } from 'lib/utils/test/customRender';
import { RegistrertFravær } from 'components/registrertfravær/RegistrertFravær';
import { describe, expect, it } from 'vitest';
import { formaterDatoMedDagOgMåndedIBokstaver } from 'lib/utils/date';

describe('RegistrertFravær', () => {
  const dato = new Date();
  it('viser dato for registrert fravær', () => {
    render(
      <RegistrertFravær felt={{ dato: dato, fravær: 'SYKDOM_ELLER_SKADE' }} slettFravær={() => {}} timerArbeidet={0} />
    );
    const forventetTekst = formaterDatoMedDagOgMåndedIBokstaver(dato);
    expect(screen.getByText(new RegExp(forventetTekst, 'i'))).toBeVisible();
  });

  it('har en knapp for å slette registrert fravær', () => {
    render(
      <RegistrertFravær felt={{ dato: dato, fravær: 'SYKDOM_ELLER_SKADE' }} slettFravær={() => {}} timerArbeidet={0} />
    );
    expect(screen.getByRole('button', { name: 'Fjern' })).toBeVisible();
  });

  it('viser en tag med antall timer arbeidet dersom det er ført timer samtidig som fravær', () => {
    render(
      <RegistrertFravær felt={{ dato: dato, fravær: 'SYKDOM_ELLER_SKADE' }} slettFravær={() => {}} timerArbeidet={4} />
    );
    expect(screen.getByText('4 timer arbeidet')).toBeVisible();
  });

  it('viser en tag med varsel om trekk', () => {
    render(
      <RegistrertFravær
        felt={{ dato: dato, fravær: 'SYKDOM_ELLER_SKADE' }}
        slettFravær={() => {}}
        timerArbeidet={4}
        visTrekkTag={true}
      />
    );
    expect(screen.getByText('Trekk')).toBeVisible();
  });
});
