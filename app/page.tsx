import Navbar from '@/components/Navbar';
import TrustBar from '@/components/TrustBar';
import LocationSection from '@/components/LocationSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero placeholder — Phase 5 */}
        <section
          id="home"
          className="flex min-h-[50vh] items-center justify-center bg-surface"
        >
          <h1 className="font-heading text-4xl font-bold text-primary">
            Orthodontiepraktijk De Boog
          </h1>
        </section>

        <TrustBar />

        {/* Treatment cards placeholder — Phase 3 */}
        <section id="behandelingen" className="py-8 text-center text-muted text-sm">
          Behandelingen — Phase 3
        </section>

        {/* Before/After placeholder — Phase 3 */}
        <section id="resultaten" className="py-8 text-center text-muted text-sm bg-secondary">
          Resultaten — Phase 3
        </section>

        {/* AuthorityBio placeholder — Phase 5 */}
        <section id="over-ons" className="py-8 text-center text-muted text-sm">
          Over ons — Phase 5
        </section>

        {/* FAQ placeholder — Phase 4 */}
        <section id="faq" className="py-8 text-center text-muted text-sm bg-secondary">
          FAQ — Phase 4
        </section>

        <LocationSection />
      </main>
      <Footer />
    </>
  );
}
