import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const OG_IMAGE = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=630&fit=crop';

export const metadata: Metadata = {
  metadataBase: new URL('https://suyuye-boke.netlify.app/'),
  title: {
    default: '苏羽野的数字空间',
    template: '%s | 苏羽野的数字空间',
  },
  description:
    '一个独立开发者的数字花园 — 记录技术探索、说唱音乐创作，以及生活中的光影碎片。',
  keywords: [
    '苏羽野',
    '个人博客',
    '独立开发',
    '说唱音乐',
    'AI 音乐创作',
    'Next.js',
    'React',
    '前端开发',
    '数字媒体',
  ],
  authors: [{ name: '苏羽野' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: '苏羽野的数字空间',
    title: '苏羽野的数字空间',
    description:
      '一个独立开发者的数字花园 — 记录技术探索、说唱音乐创作，以及生活中的光影碎片。',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: '苏羽野的数字空间',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '苏羽野的数字空间',
    description:
      '一个独立开发者的数字花园 — 记录技术探索、说唱音乐创作，以及生活中的光影碎片。',
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
        <GoogleAnalytics gaId="G-RGZ9DTYTPY" />
      </body>
    </html>
  );
}
