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
import B2BClosingSection from '@/components/B2BClosingSection';
import WaveDivider from '@/components/WaveDivider';
import type { ProspectView } from '@/lib/prospects';
import {
  resolveReviews,
  resolvePhotos,
  getPersonalizationStatus,
} from '@/lib/prospect-resolvers';

const WHITE = '#FFFFFF';
const SECONDARY = '#E6F4F6';
const PRIMARY = '#0F5F6E';

export default function ProspectPageClient({ view }: { view: ProspectView }) {
  const [modalOpen, setModalOpen] = useState(false);
  const openBooking = () => setModalOpen(true);

  const reviews = resolveReviews(view);
  const photos  = resolvePhotos(view);
  const status  = getPersonalizationStatus(view, reviews, photos);

  const heroPhotos =
    photos.realCount === 0
      ? ['/images/placeholders/practice/04-exterior.webp']
      : view.practice.photos;

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
        <Hero onOpenBooking={openBooking} practice={{ ...view.practice, photos: heroPhotos }} />
        <WaveDivider topColor={WHITE} bottomColor={SECONDARY} />
        <TrustBar />
        <WaveDivider topColor={SECONDARY} bottomColor={WHITE} flip />
        <TreatmentCards onOpenBooking={openBooking} />
        <BeforeAfter />
        <WaveDivider topColor={WHITE} bottomColor={SECONDARY} flip />
        <FAQ />
        <WaveDivider topColor={SECONDARY} bottomColor={WHITE} />
        <PraktijkGallery
          photos={photos.photos}
          city={view.practice.city}
          isPlaceholder={photos.isPlaceholder}
        />
        <WaveDivider topColor={WHITE} bottomColor={SECONDARY} flip />
        <ReviewsSection
          items={reviews.items}
          rating={view.reviews.rating}
          count={view.reviews.count}
          isPlaceholder={reviews.isPlaceholder}
          googleMapsUrl={view.practice.googleMapsUrl}
        />
        <WaveDivider topColor={SECONDARY} bottomColor={PRIMARY} />
        <CTASection onOpen={openBooking} />
        <WaveDivider topColor={PRIMARY} bottomColor={WHITE} flip />
        <LocationSection practice={view.practice} hours={view.hours} location={view.location} />
      </main>
      <B2BClosingSection status={status} />
      <WaveDivider topColor={WHITE} bottomColor={PRIMARY} />
      <Footer practice={view.practice} />
      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
