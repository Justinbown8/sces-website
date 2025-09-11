'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { impactStories } from '@/config/testimonials';
import { cn } from '@/lib/utils';
import { ImpactStory } from '@/types';

interface ImpactStoriesSectionProps {
  className?: string;
  title?: string;
  subtitle?: string;
  showTimeline?: boolean;
  maxStories?: number;
}

interface ImpactStoryCardProps {
  story: ImpactStory;
  onReadMore: () => void;
  className?: string;
}

function ImpactStoryCard({ story, onReadMore, className }: ImpactStoryCardProps) {
  return (
    <div className={cn('group cursor-pointer h-full', className)} onClick={onReadMore}>
      <Card className="h-full">
      <div className="relative overflow-hidden rounded-t-lg">
        <Image
          src={story.image}
          alt={`${story.studentName}'s story`}
          width={400}
          height={250}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-heading font-bold text-xl mb-1">
            {story.studentName}
          </h3>
          {story.age && (
            <p className="text-white/90 text-sm">
              Age {story.age} • {story.location}
            </p>
          )}
        </div>
      </div>

      <CardContent className="p-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-xl text-gray-800 group-hover:text-blue-800 transition-colors">
            {story.title}
          </CardTitle>
        </CardHeader>

        <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
          {story.story}
        </p>

        <blockquote className="border-l-4 border-orange-500 pl-4 mb-4 italic text-gray-800">
          "{story.quote}"
        </blockquote>

        <div className="space-y-2 mb-4">
          <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
            Key Achievements
          </h4>
          <ul className="space-y-1">
            {story.achievements.slice(0, 3).map((achievement, index) => (
              <li key={index} className="flex items-start text-sm text-gray-700">
                <svg className="w-4 h-4 text-orange-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {achievement}
              </li>
            ))}
            {story.achievements.length > 3 && (
              <li className="text-sm text-blue-800 font-medium">
                +{story.achievements.length - 3} more achievements
              </li>
            )}
          </ul>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full group-hover:bg-blue-800 group-hover:text-white transition-colors"
        >
          Read Full Story
        </Button>
      </CardContent>
      </Card>
    </div>
  );
}

interface ImpactStoryModalProps {
  story: ImpactStory;
  isOpen: boolean;
  onClose: () => void;
}

function ImpactStoryModal({ story, isOpen, onClose }: ImpactStoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-heading font-bold text-gray-800">
            {story.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-yellow-100 rounded-full transition-colors"
            aria-label="Close story"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Hero Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <Image
                src={story.image}
                alt={`${story.studentName}'s story`}
                width={400}
                height={300}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-3xl font-heading font-bold text-gray-800 mb-2">
                {story.studentName}
              </h3>
              {story.age && (
                <p className="text-gray-700 mb-4">
                  Age {story.age} • {story.location}
                </p>
              )}
              <blockquote className="text-xl italic text-blue-800 border-l-4 border-orange-500 pl-4">
                "{story.quote}"
              </blockquote>
            </div>
          </div>

          {/* Before/After Images */}
          {(story.beforeImage || story.afterImage) && (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {story.beforeImage && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Before</h4>
                  <Image
                    src={story.beforeImage}
                    alt={`${story.studentName} before joining SCES`}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              {story.afterImage && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">After</h4>
                  <Image
                    src={story.afterImage}
                    alt={`${story.studentName} after SCES support`}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          )}

          {/* Full Story */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-gray-700 leading-relaxed">
              {story.story}
            </p>
          </div>

          {/* Achievements */}
          <div className="mb-8">
            <h4 className="text-xl font-heading font-semibold text-gray-800 mb-4">
              Key Achievements
            </h4>
            <div className="grid md:grid-cols-2 gap-3">
              {story.achievements.map((achievement, index) => (
                <div key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-orange-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{achievement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-8">
            <h4 className="text-xl font-heading font-semibold text-gray-800 mb-4">
              Journey Timeline
            </h4>
            <div className="space-y-4">
              {story.timeline.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-16 text-right">
                    <span className="inline-block bg-blue-800 text-white text-sm font-semibold px-2 py-1 rounded">
                      {item.year}
                    </span>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="h-2 w-2 bg-orange-500 rounded-full mt-2 mr-4 float-left"></div>
                    <p className="text-gray-700 pl-6">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-yellow-50 rounded-lg p-6 text-center">
            <h4 className="text-xl font-heading font-semibold text-gray-800 mb-2">
              Help Create More Success Stories
            </h4>
            <p className="text-gray-700 mb-4">
              Your support can transform another child's life just like {story.studentName}'s
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="primary" size="lg">
                Donate Now
              </Button>
              <Button variant="outline" size="lg">
                Become a Volunteer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ImpactStoriesSection({
  className,
  title = "Stories of Transformation",
  subtitle = "Real stories of children whose lives have been transformed through education and your support",
  showTimeline = true,
  maxStories = 3
}: ImpactStoriesSectionProps) {
  const [selectedStory, setSelectedStory] = useState<ImpactStory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayedStories = impactStories.slice(0, maxStories);

  const openStoryModal = (story: ImpactStory) => {
    setSelectedStory(story);
    setIsModalOpen(true);
  };

  const closeStoryModal = () => {
    setIsModalOpen(false);
    setSelectedStory(null);
  };

  return (
    <>
      <section className={cn('py-16 bg-white', className)}>
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-800 mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayedStories.map((story) => (
              <ImpactStoryCard
                key={story.id}
                story={story}
                onReadMore={() => openStoryModal(story)}
              />
            ))}
          </div>

          {/* View More Button */}
          {impactStories.length > maxStories && (
            <div className="text-center">
              <Button
                variant="outline"
                size="lg"
                className="min-w-[200px]"
              >
                View More Stories
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedStory && (
        <ImpactStoryModal
          story={selectedStory}
          isOpen={isModalOpen}
          onClose={closeStoryModal}
        />
      )}
    </>
  );
}