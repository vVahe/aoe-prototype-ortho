import type { ProspectView, ReviewItem } from './prospects';
import { PLACEHOLDER_REVIEWS } from './placeholder-reviews';
import {
  PLACEHOLDER_PRACTICE_PHOTOS,
  PLACEHOLDER_THRESHOLD_PHOTOS,
  PLACEHOLDER_THRESHOLD_REVIEWS,
} from './placeholder-photos';

export type ResolvedReviews = {
  items: ReviewItem[];
  isPlaceholder: boolean;
  realCount: number;
};

export function resolveReviews(view: ProspectView): ResolvedReviews {
  const real = view.reviews.items.filter(
    (r) => (r.rating ?? 0) >= 4 && r.text && r.author,
  );
  if (real.length >= PLACEHOLDER_THRESHOLD_REVIEWS) {
    return { items: real, isPlaceholder: false, realCount: real.length };
  }
  return { items: PLACEHOLDER_REVIEWS, isPlaceholder: true, realCount: real.length };
}

export type ResolvedPhotos = {
  photos: string[];
  isPlaceholder: boolean;
  realCount: number;
};

export function resolvePhotos(view: ProspectView): ResolvedPhotos {
  const real = view.practice.photos ?? [];
  if (real.length >= PLACEHOLDER_THRESHOLD_PHOTOS) {
    return { photos: real, isPlaceholder: false, realCount: real.length };
  }
  return { photos: PLACEHOLDER_PRACTICE_PHOTOS, isPlaceholder: true, realCount: real.length };
}

export type PersonalizationStatus = {
  real: string[];
  placeholder: string[];
};

export function getPersonalizationStatus(
  view: ProspectView,
  reviews: ResolvedReviews,
  photos: ResolvedPhotos,
): PersonalizationStatus {
  const real: string[] = ['praktijknaam'];

  if (view.practice.city && view.practice.city !== 'uw regio') real.push('locatie');
  if (view.practice.address) real.push('adres');
  if (view.practice.phone) real.push('telefoonnummer');
  if (view.hours.weekdayText.length > 0) real.push('openingstijden');
  if (!reviews.isPlaceholder) {
    real.push(`${reviews.realCount} Google-reviews`);
  }
  if (!photos.isPlaceholder) {
    real.push(`${photos.realCount} praktijkfoto's`);
  }

  const placeholder: string[] = [];
  if (reviews.isPlaceholder) placeholder.push('reviews');
  if (photos.isPlaceholder) placeholder.push("praktijkfoto's");

  return { real, placeholder };
}
