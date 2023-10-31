import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BananaType",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div
          style={{ gridTemplateColumns: "auto minmax(0,1250px) auto" }}
          className="grid items-center"
        >
          <div></div>
          {children}
          <div></div>
        </div>
      </body>
    </html>
  );
}
