import "./globals.css"
import type { Metadata } from "next"
import { Noto_Sans_Lao } from "next/font/google"
import { Toaster } from "sonner"

import { siteConfig } from "@/config/site"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import Footer from "@/components/footer"
import Provider from "@/app/providers"

const noto = Noto_Sans_Lao({
  subsets: ["lao"],
})

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <body className={noto.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Provider>
              <SiteHeader />
              <div className="flex-1">{children}</div>
              <Toaster richColors />
              <Footer />
            </Provider>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
