import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "NPS Choice Platform",
  description: "Foundation scaffold for the NPS Choice Platform",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>{props.children}</body>
    </html>
  );
}
