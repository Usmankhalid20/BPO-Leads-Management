import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "HealthPlanLocator Admin Dashboard",
  description: "Medicare lead capture and CRM dashboard for Call Experts BPO"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
