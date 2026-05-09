'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import TreatmentCards from '@/components/TreatmentCard';
import CTASection from '@/components/CTASection';
import BeforeAfter from '@/components/BeforeAfter';
import AuthorityBio from '@/components/AuthorityBio';
import FAQ from '@/components/FAQ';
import BookingModal from '@/components/BookingModal';
import LocationSection from '@/components/LocationSection';
import ReviewsSection from '@/components/ReviewsSection';
import Footer from '@/components/Footer';
import B2BBanner from '@/components/B2BBanner';
import type { ProspectView } from '@/lib/prospects';

export default function ProspectPageClient({ view }: { view: ProspectView }) {
  const [modalOpen, setModalOpen] = useState(false);
  const openBooking = () => setModalOpen(true);

  return (
    <>
      {/* Sticky header: banner + navbar travel together */}
      <div className="sticky top-0 z-50">
        <B2BBanner
          practiceName={view.practice.name}
          city={view.practice.city}
          operatorName={view.outreach.operatorName}
          slug={view.slug}
        />
        <Navbar practiceName={view.practice.name} noSticky />
      </div>

      <main id="main-content" className="pb-16 md:pb-0">
        <Hero onOpenBooking={openBooking} practice={view.practice} />
        <TrustBar />
        <TreatmentCards onOpenBooking={openBooking} />
        <CTASection onOpen={openBooking} />
        <BeforeAfter />
        <AuthorityBio doctor={view.doctor} />
        <FAQ />
        <ReviewsSection />
        <CTASection onOpen={openBooking} />
        <LocationSection practice={view.practice} hours={view.hours} />
      </main>
      <Footer practice={view.practice} hours={view.hours} />
      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
