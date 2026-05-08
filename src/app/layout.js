import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import ReduxProvider from "../store/Provider";
import { SettingsProvider } from "./providers/SettingsProvider";
import { ToastContainer, toast } from 'react-toastify';

import { Luckiest_Guy } from 'next/font/google'
import Header from "./_components/Header";
import CartReminder from "./_components/CartReminder";
import Maintenance from "./_components/Maintenance";

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
  description: "Chim 'N' Churri | Steak. Sides. Sauce. | Order Online Now",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://admin.chimnchurri.com";
const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

async function fetchSettings() {
  try {
    const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';
    const res = await fetch(`${BACKEND_URL}/api/v1/frontend/settings`, {
      next: { revalidate: isDev ? 0 : 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export default async function RootLayout({ children }) {
  if (isMaintenanceMode) {
    return (
      <html lang="en">
        <body cz-shortcut-listen="true" className="antialiased">
          <Maintenance />
        </body>
      </html>
    );
  }

  const data = await fetchSettings();
  return (
    <html lang="en">
      <body
        cz-shortcut-listen="true"
        className={`antialiased`}
      >
        <ReduxProvider>
          <SettingsProvider settings={data}>
            <ReactQueryProvider>
              <Header />

              {children}
              <CartReminder />
              <ToastContainer />
            </ReactQueryProvider>
          </SettingsProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
