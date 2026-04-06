"use client"
import "./globals.css"
import Script from "next/script"
import { AuthProvider } from "@/app/context/AuthContext"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Inception Games - Esports Platform</title>
        <meta
          name="description"
          content="Inception Games - Bangladesh's premier esports platform for tournaments, events, and gaming community."
        />
        <link
          href={process.env.NEXT_PUBLIC_FONTSHARE_URL}
          rel="stylesheet"
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
          `}
        </Script>
      </head>
      <body
        className="bg-black text-white overflow-x-hidden"
        style={{ fontFamily: "General Sans, sans-serif" }}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
