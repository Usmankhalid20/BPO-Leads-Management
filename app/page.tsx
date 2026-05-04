import { SiteHeader } from "@/components/site-header";
import { PublicMedicalForm } from "@/components/public-medical-form";
import Footer from "@/components/site-footer";
export default function Page() {
  return (
    <main>
      <SiteHeader />
      <PublicMedicalForm />
      <Footer />
    </main>
  );
}
