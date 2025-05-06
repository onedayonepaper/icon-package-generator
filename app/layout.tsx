import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Icon Package Generator',
  description: 'Generate a complete set of icons and manifest.json for your web application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 