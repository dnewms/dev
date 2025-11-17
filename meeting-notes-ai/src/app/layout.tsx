import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MeetingNotes AI - AI-Powered Meeting Transcription & Summarization',
  description:
    'Transform your meetings with AI-powered transcription, summaries, and action items. The smart alternative to Otter.ai and Fireflies.ai.',
  keywords: 'meeting notes, transcription, AI, whisper, summary, action items, collaboration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
