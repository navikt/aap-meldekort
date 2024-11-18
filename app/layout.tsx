import type { Metadata } from 'next';
import { fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'AAP Meldekort',
  description: 'Innbyggerflate for å sende inn meldekort',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const Decorator = await fetchDecoratorReact({
    env: 'dev',
  });

  return (
    <html lang="nb">
      <head>
        <Decorator.HeadAssets />
      </head>
      <body>
        <Decorator.Header />
        {children}
        <Decorator.Footer />
        <Decorator.Scripts loader={Script} />
      </body>
    </html>
  );
}
