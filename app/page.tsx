'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import TrustBar from '@/components/TrustBar';
import TreatmentCards from '@/components/TreatmentCard';
import CTASection from '@/components/CTASection';
import BeforeAfter from '@/components/BeforeAfter';
import FAQ from '@/components/FAQ';
import BookingModal from '@/components/BookingModal';
import LocationSection from '@/components/LocationSection';
import Footer from '@/components/Footer';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

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
        <TreatmentCards onOpenBooking={() => setModalOpen(true)} />
        <CTASection onOpen={() => setModalOpen(true)} />
        <BeforeAfter />

        {/* AuthorityBio placeholder — Phase 5 */}
        <section id="over-ons" className="py-8 text-center text-muted text-sm bg-secondary">
          Over ons — Phase 5
        </section>

        <FAQ />
        <CTASection onOpen={() => setModalOpen(true)} />
        <LocationSection />
      </main>
      <Footer />
      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
