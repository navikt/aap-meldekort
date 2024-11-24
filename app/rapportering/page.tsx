import { Rapporteringskalender } from 'components/rapporteringskalender/Rapporteringskalender';

const Page = () => {
  return (
    <Rapporteringskalender
      periode={{
        periode: { fraDato: '2024-11-18', tilDato: '2024-12-01' },
      }}
    />
  );
};

export default Page;
