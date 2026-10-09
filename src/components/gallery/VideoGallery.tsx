'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  galleryVideos,
  videoCategories,
  videoUrl,
  type GalleryVideo,
  type VideoCategory
} from '@/config/videos';

type Filter = VideoCategory | 'All';

const categoryStyles: Record<VideoCategory, string> = {
  'Student Conversations': 'bg-blue-600/90 text-white',
  'Ganpati Utsav': 'bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-[#4a2c00]'
};

export function VideoGallery({ className }: { className?: string }) {
  const [active, setActive] = useState<Filter>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = useMemo<GalleryVideo[]>(
    () => (active === 'All' ? galleryVideos : galleryVideos.filter((v) => v.category === active)),
    [active]
  );

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length)),
    [filtered.length]
  );
  const showNext = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % filtered.length)),
    [filtered.length]
  );

  useEffect(() => {
    if (openIndex === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      else if (event.key === 'ArrowLeft') showPrev();
      else if (event.key === 'ArrowRight') showNext();
    };

    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex, close, showPrev, showNext]);

  const current = openIndex !== null ? filtered[openIndex] : null;

  return (
    <div className={cn('gallery-videos', className)}>
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#92400E]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF8C00]" />
          Watch Our Stories
        </span>
        <h2 className="mt-4 text-3xl md:text-4xl font-bold font-heading text-blue-900">
          Videos from SCES
        </h2>
        <div className="mt-4 h-1.5 w-24 mx-auto rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF8C00]" />
        <p className="mt-5 text-base md:text-lg text-gray-600 leading-relaxed">
          Step inside our classrooms and celebrations. From heartfelt conversations with our
          students to the festive joy of Ganpati Utsav, these moments capture the spirit of SCES.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-3">
        {videoCategories.map((category) => {
          const isActive = active === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActive(category);
                setOpenIndex(null);
              }}
              aria-pressed={isActive}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300',
                isActive
                  ? 'bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white shadow-lg shadow-blue-900/25'
                  : 'border border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:text-blue-700'
              )}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-[0.75rem] sm:grid-cols-3 sm:gap-[1.25rem] lg:grid-cols-4">
        {filtered.map((video, index) => (
          <button
            key={video.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="group relative block aspect-[9/16] w-full overflow-hidden rounded-2xl bg-blue-950 text-left ring-1 ring-blue-900/10 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/25 focus-visible:outline-none"
            aria-label={`Play video: ${video.title}`}
          >
            <video
              src={videoUrl(video.src, '#t=0.1')}
              preload="metadata"
              muted
              playsInline
              tabIndex={-1}
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Readability + brand overlay */}
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-blue-950/95 via-blue-950/25 to-transparent"
            />

            {/* Category badge */}
            <span
              className={cn(
                'absolute left-2 top-2 rounded-full px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wide shadow-sm sm:text-[0.65rem]',
                categoryStyles[video.category]
              )}
            >
              {video.category}
            </span>

            {/* Play button */}
            <span aria-hidden className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF8C00] text-[#4a2c00] shadow-lg shadow-orange-500/40 transition-transform duration-500 group-hover:scale-110 sm:h-14 sm:w-14">
                <Play className="h-5 w-5 translate-x-0.5 sm:h-6 sm:w-6" fill="currentColor" />
              </span>
            </span>

            {/* Title */}
            <span className="absolute inset-x-0 bottom-0 p-3">
              <span className="line-clamp-2 block text-xs font-semibold text-white sm:text-sm">
                {video.title}
              </span>
            </span>

            {/* Bottom accent on hover */}
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1 w-0 bg-gradient-to-r from-[#FFD700] to-[#FF8C00] transition-all duration-500 group-hover:w-full"
            />
          </button>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-gray-600">
        Showing {filtered.length} {filtered.length === 1 ? 'video' : 'videos'}
        {active !== 'All' && <span className="ml-1">in {active}</span>}
      </p>

      {/* Player */}
      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          onClick={close}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-blue-950/90 p-4 backdrop-blur-sm"
        >
          {/* Previous */}
          {filtered.length > 1 && (
            <button
              type="button"
              aria-label="Previous video"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20 sm:left-6 sm:p-3"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Next */}
          {filtered.length > 1 && (
            <button
              type="button"
              aria-label="Next video"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20 sm:right-6 sm:p-3"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          <div className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <video
                key={current.src}
                src={videoUrl(current.src)}
                controls
                autoPlay
                playsInline
                className="block max-h-[78vh] max-w-[92vw] rounded-2xl bg-black ring-1 ring-white/20"
                style={{ aspectRatio: '9 / 16' }}
              />
              <button
                type="button"
                aria-label="Close video"
                onClick={close}
                className="absolute -right-2 -top-2 rounded-full bg-white p-2 text-blue-900 shadow-lg transition hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-3 max-w-[92vw] text-center text-sm font-medium text-white/90">
              {current.title}
            </p>
            <p className="mt-1 max-w-[92vw] text-center text-xs text-blue-100/70">
              {current.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoGallery;
