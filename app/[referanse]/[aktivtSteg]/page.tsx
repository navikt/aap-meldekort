interface Props {
  params: Promise<{
    referanse: string;
    aktivtSteg: string;
  }>;
}

const AktivtStegPage = async (props: Props) => {
  const params = await props.params;

  return (
    <div>
      Aktivt steg {params.referanse} & {params.aktivtSteg}
    </div>
  );
};

export default AktivtStegPage;
