import { Great_Vibes, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-great-vibes',
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant-garamond',
});

export const metadata = {
  title: 'Hemadri & Ravindra — A Sacred Union',
  description: 'Join us in celebrating our wedding',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💕</text></svg>"
        />
      </head>
      <body className={`${greatVibes.variable} ${cormorantGaramond.variable}`}>{children}</body>
    </html>
  );
}
