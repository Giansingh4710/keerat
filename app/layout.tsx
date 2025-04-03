import {AppRouterCacheProvider} from '@mui/material-nextjs/v13-appRouter';
import './globals.css';
import Script from 'next/script';
import {Metadata, Viewport} from 'next';
import {Inter} from 'next/font/google';

interface RootLayoutProps {
  children: React.ReactNode;
}

const inter = Inter({subsets: ['latin']});

export default function RootLayout({children}: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
      <Script id="google-analytics" async src="https://www.googletagmanager.com/gtag/js?id=G-77S9XD0W9T"></Script>
      <Script id="google-analytics-config" defer>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-77S9XD0W9T');
        `}
      </Script>
    </html>
  );
}

const APP_NAME = 'Keerat';
const APP_DEFAULT_TITLE = 'Keerat';
const APP_TITLE_TEMPLATE = '%s - PWA App';
const APP_DESCRIPTION = 'Audio Player for Sikh Stuff';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#001f3f',
};
