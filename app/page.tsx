import Script from "next/script";
import { SiteHeader } from "@/components/site-header";
import { PublicMedicalForm } from "@/components/public-medical-form";

export default function Page() {
  const scriptSrc = process.env.NEXT_PUBLIC_JORNAYA_SCRIPT_SRC;
  return (
    <main>
      <SiteHeader />
      {scriptSrc ? <Script src={scriptSrc} strategy="afterInteractive" /> : null}
      <PublicMedicalForm />
    </main>
  );
}
