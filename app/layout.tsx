import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { resume } from "@/content/resume";
import "./globals.css";

const title = `${resume.name} · ${resume.role}`;
const description = `${resume.role} specializing in ${resume.discipline}. ${resume.intro}`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Backend Engineer",
    "Distributed Systems",
    "Microservices",
    ".NET",
    "Event-Driven Architecture",
    "CQRS",
    "Kubernetes",
    resume.name,
  ],
  authors: [{ name: resume.name }],
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#090b10",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-[100dvh] antialiased">
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
