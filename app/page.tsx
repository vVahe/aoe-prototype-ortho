'use client';

import Navbar from '@/components/Navbar';
import TrustBar from '@/components/TrustBar';
import TreatmentCards from '@/components/TreatmentCard';
import CTASection from '@/components/CTASection';
import BeforeAfter from '@/components/BeforeAfter';
import LocationSection from '@/components/LocationSection';
import Footer from '@/components/Footer';

export default function Home() {
  const openBooking = () => {
    // BookingModal wired in Phase 4
  };

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
        <TreatmentCards onOpenBooking={openBooking} />
        <CTASection onOpen={openBooking} />
        <BeforeAfter />

        {/* AuthorityBio placeholder — Phase 5 */}
        <section id="over-ons" className="py-8 text-center text-muted text-sm bg-secondary">
          Over ons — Phase 5
        </section>

        {/* FAQ placeholder — Phase 4 */}
        <section id="faq" className="py-8 text-center text-muted text-sm">
          FAQ — Phase 4
        </section>

        <CTASection onOpen={openBooking} />
        <LocationSection />
      </main>
      <Footer />
    </>
  );
}
