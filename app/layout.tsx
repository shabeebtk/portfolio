import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shabeeb TK | Python Full Stack Developer",
  description:
    "Production-focused portfolio of Shabeeb TK, Python Full Stack Developer specializing in Django, DRF, FastAPI, Next.js, and scalable SaaS systems.",
  keywords: [
    "Shabeeb TK",
    "Python Full Stack Developer",
    "Django Developer",
    "FastAPI",
    "Next.js",
    "Portfolio",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              try {
                const key = "portfolio-theme";
                const stored = localStorage.getItem(key);
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                const shouldUseDark = stored ? stored === "dark" : prefersDark;
                document.documentElement.classList.toggle("dark", shouldUseDark);
              } catch (_) {}
            })();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
