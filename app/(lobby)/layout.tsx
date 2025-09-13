import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <section>
      <SiteHeader/>
      {children}
      <SiteFooter />
    </section>
  );
}