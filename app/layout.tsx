import type { Metadata } from "next";

import "./globals.css";

import { Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import FileUploadBoxProvider from "@/components/contexts/file-upload-box";

export const metadata: Metadata = {
  title: {
    absolute: "CarePulse",
    template: "%s|CarePulse",
  },
  description: "Generated by create next app",
};

// Configure Plus Jakarta Sans font with detailed fallback
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  fallback: [
    "Poppins",
    "Arial", // Common web-safe font
    "Helvetica", // Popular sans-serif fallback
    "sans-serif", // Generic sans-serif fallback
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} antialiased min-h-screen bg-primary`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <FileUploadBoxProvider>{children}</FileUploadBoxProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
