interface Props {
  params: Promise<{
    referanse: string;
  }>;
}

const OppsummeringPage = async (props: Props) => {
  const params = await props.params;

  return <div>Oppsummering {params.referanse}</div>;
};

export default OppsummeringPage;
