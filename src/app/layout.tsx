import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { FirebaseProvider } from '../contexts/FirebaseContext';
import { AppProvider } from '../contexts/AppContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Navkar's Paints Professional System",
  description: 'Professional paint shop management system for orders, customers, painters, stock, and color mixing.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}