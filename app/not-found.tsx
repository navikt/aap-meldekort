'use client';

import { Heading, Link } from '@navikt/ds-react';

//404 Page
const NotFound = () => {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        flexDirection: 'column',
        marginBlockStart: '2rem',
      }}
    >
      <Heading level="2" size="medium" spacing>
        Denne siden finnes ikke.
      </Heading>
      <Link href={`/`}>Gå tilbake til oversikt</Link>
    </div>
  );
};

export default NotFound;
