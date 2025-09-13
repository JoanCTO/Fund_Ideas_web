import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import "./globals.css";

export const metadata = {
  title: "Fund Ideas - Technical Crowdfunding Platform",
  description:
    "Modern crowdfunding platform for technical projects and innovation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
