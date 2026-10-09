export type VideoCategory = 'Student Conversations' | 'Ganpati Utsav';

export interface GalleryVideo {
  id: string;
  /** Public path to the video file. */
  src: string;
  title: string;
  description: string;
  category: VideoCategory;
  featured?: boolean;
}

/**
 * Videos live in `public/Videos` and are shot vertically on a phone, so they
 * are rendered in a 9:16 frame. Ganpati Utsav clips are named "Ganpati...",
 * the rest are conversations with SCES students.
 */
export const galleryVideos: GalleryVideo[] = [
  {
    id: 'students-1',
    src: '/Videos/video3.mp4',
    title: 'Conversation with Our Students',
    description: 'Students share their learning journey at SCES.',
    category: 'Student Conversations',
    featured: true
  },
  {
    id: 'students-2',
    src: '/Videos/video4.mp4',
    title: 'Student Voices',
    description: 'Heartfelt moments from the children we support.',
    category: 'Student Conversations'
  },
  {
    id: 'students-3',
    src: '/Videos/video5.mp4',
    title: 'A Day with Our Students',
    description: 'A glimpse into everyday life at our learning centre.',
    category: 'Student Conversations'
  },
  {
    id: 'students-4',
    src: '/Videos/video6.mp4',
    title: 'Students Sharing Their Journey',
    description: 'Stories of hope and progress straight from the classroom.',
    category: 'Student Conversations'
  },
  {
    id: 'students-5',
    src: '/Videos/johnny johnny yes papa.mp4',
    title: 'Learning Through Rhymes',
    description: 'Students enjoying music and rhyme-based learning.',
    category: 'Student Conversations'
  },
  {
    id: 'students-6',
    src: '/Videos/WhatsApp Video 2026-10-06 at 8.22.56 PM.mp4',
    title: 'Moments with Our Students',
    description: 'Joyful interactions captured with our students.',
    category: 'Student Conversations'
  },
  {
    id: 'ganpati-1',
    src: '/Videos/Ganpati Utsav.mp4',
    title: 'Ganpati Utsav Celebration',
    description: 'The community comes together to celebrate Ganpati Utsav.',
    category: 'Ganpati Utsav',
    featured: true
  },
  {
    id: 'ganpati-2',
    src: '/Videos/Ganpati_Utsav2.mp4',
    title: 'Ganpati Utsav Festivities',
    description: 'Festive cheer, devotion and togetherness at SCES.',
    category: 'Ganpati Utsav'
  }
];

export const videoCategories: Array<VideoCategory | 'All'> = [
  'All',
  'Student Conversations',
  'Ganpati Utsav'
];

/** Encode a public path for use in a URL (handles spaces and special chars). */
export function videoUrl(src: string, fragment?: string): string {
  return encodeURI(src) + (fragment ?? '');
}
