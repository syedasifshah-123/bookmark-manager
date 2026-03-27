import type { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const workSans = Work_Sans({
    subsets: ['latin'],
    variable: '--font-work-sans',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Bookmark Manager',
    description: 'Organize your bookmarks with categories',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning className={workSans.className}>
            <body className="font-sans antialiased" style={{ letterSpacing: '-0.04em' }}>
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
}
