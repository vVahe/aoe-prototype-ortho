'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import TreatmentCards from '@/components/TreatmentCard';
import CTASection from '@/components/CTASection';
import BeforeAfter from '@/components/BeforeAfter';
import PraktijkGallery from '@/components/PraktijkGallery';
import FAQ from '@/components/FAQ';
import BookingModal from '@/components/BookingModal';
import LocationSection from '@/components/LocationSection';
import ReviewsSection from '@/components/ReviewsSection';
import Footer from '@/components/Footer';
import B2BBanner from '@/components/B2BBanner';
import WaveDivider from '@/components/WaveDivider';
import type { ProspectView } from '@/lib/prospects';

const WHITE = '#FFFFFF';
const SECONDARY = '#E6F4F6';
const PRIMARY = '#0F5F6E';

export default function ProspectPageClient({ view }: { view: ProspectView }) {
  const [modalOpen, setModalOpen] = useState(false);
  const openBooking = () => setModalOpen(true);
  const hasGallery = Boolean(view.practice.photos && view.practice.photos.length > 0);

  return (
    <>
      {/* Sticky header: banner + navbar travel together */}
      <div className="sticky top-0 z-50">
        <B2BBanner
          practiceName={view.practice.name}
          slug={view.slug}
        />
        <Navbar practiceName={view.practice.name} noSticky />
      </div>

      <main id="main-content" className="pb-16 md:pb-0">
        <Hero onOpenBooking={openBooking} practice={view.practice} />
        <WaveDivider topColor={WHITE} bottomColor={SECONDARY} />
        <TrustBar />
        <WaveDivider topColor={SECONDARY} bottomColor={WHITE} flip />
        <TreatmentCards onOpenBooking={openBooking} />
        <BeforeAfter />
        <WaveDivider topColor={WHITE} bottomColor={SECONDARY} flip />
        <FAQ />
        {hasGallery ? (
          <>
            <WaveDivider topColor={SECONDARY} bottomColor={WHITE} />
            <PraktijkGallery photos={view.practice.photos!} city={view.practice.city} />
            <WaveDivider topColor={WHITE} bottomColor={SECONDARY} flip />
          </>
        ) : null}
        <ReviewsSection items={view.reviews.items} rating={view.reviews.rating} count={view.reviews.count} />
        <WaveDivider topColor={SECONDARY} bottomColor={PRIMARY} />
        <CTASection onOpen={openBooking} />
        <WaveDivider topColor={PRIMARY} bottomColor={WHITE} flip />
        <LocationSection practice={view.practice} hours={view.hours} location={view.location} />
      </main>
      <WaveDivider topColor={WHITE} bottomColor={PRIMARY} />
      <Footer practice={view.practice} />
      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
