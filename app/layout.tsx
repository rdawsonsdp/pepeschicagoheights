import type { Metadata, Viewport } from 'next';
import { Bevan, Lato, Crimson_Text, Merriweather, Roboto_Condensed } from 'next/font/google';
import './globals.css';
import Layout from '@/components/layout/Layout';
import { CateringProvider } from '@/context/CateringContext';
import { siteConfig } from '@/lib/site-config';

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
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: siteConfig.restaurant.name,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: siteConfig.colors.themeColor,
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
