
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { CosmicBackground } from '@/components/cosmic-background';
import { AppStateProvider } from '@/context/app-state-context';
import { CursorAura } from '@/components/cursor-aura';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'NoteFlow',
  description: 'A modern notepad app with AI-powered summarization.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <AppStateProvider>
          <CursorAura />
          <CosmicBackground />
          <main className="relative z-10">{children}</main>
        </AppStateProvider>
        <Toaster />
      </body>
    </html>
  );
}
