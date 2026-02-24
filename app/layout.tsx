import type { Metadata, Viewport } from 'next';
import { Bevan, Lato, Crimson_Text, Merriweather, Roboto_Condensed } from 'next/font/google';
import './globals.css';
import Layout from '@/components/layout/Layout';
import { CateringProvider } from '@/context/CateringContext';

const bevan = Bevan({
  variable: '--font-bevan',
  subsets: ['latin'],
  weight: ['400'],
});

const lato = Lato({
  variable: '--font-lato',
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
});

const crimsonText = Crimson_Text({
  variable: '--font-crimson',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const merriweather = Merriweather({
  variable: '--font-merriweather',
  subsets: ['latin'],
  weight: ['300', '400', '700'],
});

const robotoCondensed = Roboto_Condensed({
  variable: '--font-roboto-condensed',
  subsets: ['latin'],
  weight: ['300', '400', '700'],
});

export const metadata: Metadata = {
  title: "Pepe's Mexican Restaurant | Full Service Catering",
  description:
    "Pepe's Mexican Restaurant offers authentic Mexican catering for parties, corporate events, and special occasions. Have a Fiesta with our full service catering menu!",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "Pepe's Mexican Restaurant",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#E88A00',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bevan.variable} ${lato.variable} ${crimsonText.variable} ${merriweather.variable} ${robotoCondensed.variable} antialiased`}
      >
        <CateringProvider>
          <Layout>{children}</Layout>
        </CateringProvider>
      </body>
    </html>
  );
}
