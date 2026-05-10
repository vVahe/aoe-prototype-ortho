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
import { TESTIMONIALS, PRACTICE_INFO } from '@/lib/constants';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const openBooking = () => setModalOpen(true);

  return (
    <>
      <Navbar />
      <main id="main-content" className="pb-16 md:pb-0">
        <Hero onOpenBooking={openBooking} />
        <TrustBar />
        <TreatmentCards onOpenBooking={openBooking} />
        <CTASection onOpen={openBooking} />
        <BeforeAfter />
        <AuthorityBio />
        <FAQ />
        <ReviewsSection
          items={TESTIMONIALS.map((t) => ({ author: t.name, text: t.text, rating: t.stars }))}
          rating={parseFloat(PRACTICE_INFO.trustSignals.rating)}
          count={parseInt(PRACTICE_INFO.trustSignals.reviewCount, 10)}
        />
        <CTASection onOpen={openBooking} />
        <LocationSection />
      </main>
      <Footer />
      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
