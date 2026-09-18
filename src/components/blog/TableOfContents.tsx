'use client';

import { useEffect, useState } from 'react';
import { TocHeading } from '@/lib/markdown';

interface TableOfContentsProps {
  headings: TocHeading[];
  postTitle: string;
}

export function TableOfContents({ headings, postTitle }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        }
        const firstActive = headings.find(h => visible.has(h.id));
        if (firstActive) {
          setActiveId(firstActive.id);
        }
      },
      { rootMargin: '-96px 0px -65% 0px', threshold: 0 }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const renderLinks = (closeOnNavigate: boolean) => (
    <ul className="space-y-1">
      {headings.map((heading) => {
        const isActive = activeId === heading.id;
        return (
          <li key={heading.id} className={heading.level === 3 ? 'pl-4' : ''}>
            <a
              href={`#${heading.id}`}
              onClick={closeOnNavigate ? () => setIsOpen(false) : undefined}
              className={`group flex items-start gap-2 rounded-lg px-3 py-1.5 text-sm leading-snug transition-colors ${
                isActive
                  ? 'bg-button-navy/5 font-bold text-button-navy'
                  : 'font-medium text-gray-600 hover:bg-gray-100 hover:text-button-navy'
              }`}
            >
              <span
                className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors ${
                  isActive ? 'bg-primary-yellow' : 'bg-transparent group-hover:bg-gray-300'
                }`}
              />
              {heading.text}
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Mobile / tablet: collapsible toggle above the article */}
      <nav
        aria-label={`Table of contents - ${postTitle}`}
        className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-4 lg:hidden"
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="toc-mobile-panel"
          className="flex w-full items-center justify-between gap-3"
        >
          <span className="flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-primary-yellow" />
            <span className="font-heading text-sm font-bold uppercase tracking-wider text-button-navy">
              Table of Contents
            </span>
          </span>
          <svg
            className={`h-4 w-4 text-button-navy transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div id="toc-mobile-panel" className={isOpen ? 'mt-4 border-t border-gray-200 pt-3' : 'hidden'}>
          {renderLinks(true)}
        </div>
      </nav>

      {/* Desktop: sticky sidebar card */}
      <div className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <p className="mb-3 flex items-center gap-2 border-b border-gray-200 pb-3">
            <span className="h-4 w-1 rounded-full bg-primary-yellow" />
            <span className="font-heading text-sm font-bold uppercase tracking-wider text-button-navy">
              Table of Contents
            </span>
          </p>
          <nav aria-label={`Table of contents - ${postTitle}`}>
            {renderLinks(false)}
          </nav>
        </div>
      </div>
    </>
  );
}
