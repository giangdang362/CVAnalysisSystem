import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "@/src/theme/AntdRegistry";
import { HandleOnComplete } from "@/src/lib/router-events";
import ThemeProvider from "@/src/theme/theme-provider";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Say Hi",
  description: "AI Say Hi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={""} suppressHydrationWarning={true}>
        <HandleOnComplete />
        <ThemeProvider>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
}
