import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import ReduxProvider from "../store/Provider";
import { settings } from "@/lib/api";
import { SettingsProvider } from "./providers/SettingsProvider";
import { ToastContainer, toast } from 'react-toastify';

import { Luckiest_Guy } from 'next/font/google'
import Header from "./_components/Header";

const luckiestGuy = Luckiest_Guy({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Chimnchurri",
  description: "Chimnchurri is a restaurant that serves delicious food. We are located in Lahore, Pakistan. We offer a wide variety of dishes, including vegetarian and non-vegetarian options. Our menu is updated regularly to ensure that we always have something new to offer our customers.",
};

export default async function RootLayout({ children }) {
  const response = await settings();
  const data = response.data;
  return (
    <html lang="en">
      <body
        cz-shortcut-listen="true"
        className={`${luckiestGuy.className} antialiased`}
      >
        <ReduxProvider>
          <SettingsProvider settings={data}>
            <ReactQueryProvider>
              <Header />

              {children}
              <ToastContainer />
            </ReactQueryProvider>
          </SettingsProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
