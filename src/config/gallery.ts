export type GalleryUsage = 'gallery' | 'blog' | 'print' | 'social';

export interface GalleryImage {
  id: string;
  filename: string;
  /** Public path override. Defaults to `/gallery/<filename>`. */
  src?: string;
  alt: string;
  category: 'Events' | 'Classrooms' | 'Field Visits' | 'Posts & Activities';
  caption?: string;
  featured?: boolean;
  /** Where this image is cleared to be reused. */
  usage?: GalleryUsage[];
}

export const galleryImages: GalleryImage[] = [
  // Events Category
  {
    id: 'event-1',
    filename: '481157835_944410404543185_2962726328455719855_n.jpg',
    alt: 'Children participating in educational event at SCES',
    category: 'Events',
    caption: 'Annual educational celebration bringing joy to learning',
    featured: true
  },
  {
    id: 'event-2',
    filename: '481175245_944425734541652_9070409219912970222_n.jpg',
    alt: 'Community gathering for educational awareness program',
    category: 'Events',
    caption: 'Community members supporting children\'s education'
  },
  {
    id: 'event-3',
    filename: '481178128_944425361208356_2057748288022170433_n.jpg',
    alt: 'Students showcasing their achievements at school event',
    category: 'Events',
    caption: 'Celebrating student achievements and milestones'
  },
  {
    id: 'event-4',
    filename: '481264655_944425514541674_170184300515518954_n.jpg',
    alt: 'Cultural program organized by SCES students',
    category: 'Events',
    caption: 'Students expressing creativity through cultural activities'
  },
  {
    id: 'event-5',
    filename: '481296508_945413307776228_3335274858252168528_n.jpg',
    alt: 'Educational workshop for underprivileged children',
    category: 'Events',
    caption: 'Interactive learning sessions making education accessible'
  },
  {
    id: 'event-6',
    filename: '481303838_944410271209865_4673313455438903277_n.jpg',
    alt: 'Award ceremony recognizing student excellence',
    category: 'Events',
    caption: 'Honoring academic achievements and dedication'
  },
  {
    id: 'event-7',
    filename: '481310045_945413094442916_1977531664594710625_n.jpg',
    alt: 'Sports day activities promoting physical education',
    category: 'Events',
    caption: 'Encouraging holistic development through sports'
  },
  {
    id: 'event-8',
    filename: '481333905_945413354442890_357301310474130145_n.jpg',
    alt: 'Science exhibition showcasing student projects',
    category: 'Events',
    caption: 'Young minds exploring science and innovation'
  },

  // Classrooms Category
  {
    id: 'classroom-1',
    filename: '481467283_945413337776225_3085795466906230417_n.jpg',
    alt: 'Students engaged in interactive classroom learning',
    category: 'Classrooms',
    caption: 'Creating engaging learning environments for all children',
    featured: true
  },
  {
    id: 'classroom-2',
    filename: '481659008_945413954442830_3072592436674307254_n.jpg',
    alt: 'Teacher conducting lesson with enthusiastic students',
    category: 'Classrooms',
    caption: 'Dedicated teachers inspiring young minds'
  },
  {
    id: 'classroom-3',
    filename: '481664557_944410221209870_5425185095614476683_n.jpg',
    alt: 'Children participating in group learning activity',
    category: 'Classrooms',
    caption: 'Collaborative learning fostering teamwork'
  },
  {
    id: 'classroom-4',
    filename: '481701757_945413327776226_5054681650336744782_n.jpg',
    alt: 'Modern classroom setup with educational resources',
    category: 'Classrooms',
    caption: 'Well-equipped classrooms supporting quality education'
  },
  {
    id: 'classroom-5',
    filename: '481711619_944425637874995_2775660185601880635_n.jpg',
    alt: 'Students working on creative learning projects',
    category: 'Classrooms',
    caption: 'Hands-on learning experiences building skills'
  },
  {
    id: 'classroom-6',
    filename: '481765611_945413501109542_248714420041554021_n.jpg',
    alt: 'Reading session with children enjoying books',
    category: 'Classrooms',
    caption: 'Fostering love for reading and literacy'
  },
  {
    id: 'classroom-7',
    filename: '481828102_945413447776214_5947391325169733232_n.jpg',
    alt: 'Mathematics lesson with interactive teaching methods',
    category: 'Classrooms',
    caption: 'Making mathematics fun and accessible'
  },
  {
    id: 'classroom-8',
    filename: '481829624_945413324442893_3873780290350469671_n.jpg',
    alt: 'Art and craft session developing creativity',
    category: 'Classrooms',
    caption: 'Nurturing artistic talents and creativity'
  },

  // Field Visits Category
  {
    id: 'field-1',
    filename: '481907180_945413287776230_436069319495722425_n.jpg',
    alt: 'Educational field trip to local community center',
    category: 'Field Visits',
    caption: 'Learning beyond classroom walls through field experiences',
    featured: true
  },
  {
    id: 'field-2',
    filename: '481918427_944425437875015_2220085930254080390_n.jpg',
    alt: 'Students exploring nature during outdoor learning session',
    category: 'Field Visits',
    caption: 'Connecting with nature for environmental awareness'
  },
  {
    id: 'field-3',
    filename: '481946909_945413497776209_6291019415336242719_n.jpg',
    alt: 'Visit to local library promoting reading culture',
    category: 'Field Visits',
    caption: 'Encouraging reading habits through library visits'
  },
  {
    id: 'field-4',
    filename: '481998419_944425547875004_4166568256252846080_n.jpg',
    alt: 'Community service project by SCES students',
    category: 'Field Visits',
    caption: 'Teaching social responsibility through community service'
  },
  {
    id: 'field-5',
    filename: '482000236_945413334442892_4903671561226491342_n.jpg',
    alt: 'Educational tour to historical site',
    category: 'Field Visits',
    caption: 'Learning history through immersive experiences'
  },
  {
    id: 'field-6',
    filename: '482009591_944425507875008_215162912013963424_n.jpg',
    alt: 'Students participating in environmental cleanup drive',
    category: 'Field Visits',
    caption: 'Building environmental consciousness through action'
  },
  {
    id: 'field-7',
    filename: '482349485_944410251209867_2768032066179311418_n.jpg',
    alt: 'Visit to local market for practical learning experience',
    category: 'Field Visits',
    caption: 'Real-world learning through market visits'
  },
  {
    id: 'field-8',
    filename: '482960222_944425457875013_7371296833092447519_n.jpg',
    alt: 'Cultural heritage site visit for historical education',
    category: 'Field Visits',
    caption: 'Preserving cultural heritage through educational visits'
  },

  // Posts & Activities Category
  // usage tags mark where each asset may be reused: 'gallery', 'blog', 'social', 'print'.
  {
    id: 'post-1',
    filename: 'Untitled - September 20, 2026 at 13.20.45.png',
    src: '/images/Posts and Activities/Untitled - September 20, 2026 at 13.20.45.png',
    alt: 'SCES branded social media poster from September 2026',
    category: 'Posts & Activities',
    caption: 'SCES post shared on social media, September 20, 2026',
    usage: ['social', 'blog', 'print']
  },
  {
    id: 'post-2',
    filename: 'Untitled - September 20, 2026 at 13.20.45-2.png',
    src: '/images/Posts and Activities/Untitled - September 20, 2026 at 13.20.45-2.png',
    alt: 'SCES branded social media poster variation from September 2026',
    category: 'Posts & Activities',
    caption: 'Alternate version of the SCES post from September 20, 2026',
    usage: ['social', 'blog']
  },
  {
    id: 'post-3',
    filename: 'Untitled - September 20, 2026 at 15.04.16.png',
    src: '/images/Posts and Activities/Untitled - September 20, 2026 at 15.04.16.png',
    alt: 'SCES branded social media poster from September 20, 2026',
    category: 'Posts & Activities',
    caption: 'SCES post shared on social media, September 20, 2026',
    usage: ['social', 'blog', 'print']
  },
  {
    id: 'post-4',
    filename: 'Untitled - September 22, 2026 at 14.10.38.png',
    src: '/images/Posts and Activities/Untitled - September 22, 2026 at 14.10.38.png',
    alt: 'SCES branded social media poster from September 22, 2026',
    category: 'Posts & Activities',
    caption: 'SCES post shared on social media, September 22, 2026',
    usage: ['social', 'blog', 'print']
  },
  {
    id: 'post-5',
    filename: 'Untitled - September 25, 2026 at 12.14.28.png',
    src: '/images/Posts and Activities/Untitled - September 25, 2026 at 12.14.28.png',
    alt: 'SCES branded social media poster from September 25, 2026',
    category: 'Posts & Activities',
    caption: 'SCES post shared on social media, September 25, 2026',
    usage: ['social', 'blog', 'print']
  },
  {
    id: 'post-6',
    filename: 'Untitled - September 27, 2026 at 18.04.50.png',
    src: '/images/Posts and Activities/Untitled - September 27, 2026 at 18.04.50.png',
    alt: 'SCES branded social media poster from September 27, 2026',
    category: 'Posts & Activities',
    caption: 'SCES post shared on social media, September 27, 2026',
    usage: ['social', 'blog', 'print']
  },
  {
    id: 'post-7',
    filename: 'Untitled - October 01, 2026 at 11.11.35 (2).png',
    src: '/images/Posts and Activities/Untitled - October 01, 2026 at 11.11.35 (2).png',
    alt: 'SCES branded social media poster from October 2026',
    category: 'Posts & Activities',
    caption: 'SCES post shared on social media, October 1, 2026',
    usage: ['social', 'blog', 'print']
  },
  {
    id: 'post-8',
    filename: 'Untitled - October 09, 2026 at 15.20.00.png',
    src: '/images/Posts and Activities/Untitled - October 09, 2026 at 15.20.00.png',
    alt: 'SCES branded social media poster from October 9, 2026',
    category: 'Posts & Activities',
    caption: 'SCES post shared on social media, October 9, 2026',
    usage: ['social', 'blog', 'print']
  },
  {
    id: 'post-9',
    filename: 'Untitled - October 10, 2026 at 13.54.38.png',
    src: '/images/Posts and Activities/Untitled - October 10, 2026 at 13.54.38.png',
    alt: 'SCES branded social media poster from October 10, 2026',
    category: 'Posts & Activities',
    caption: 'SCES post shared on social media, October 10, 2026',
    usage: ['social', 'blog', 'print']
  },
  {
    id: 'post-10',
    filename: 'Untitled - October 12, 2026 at 14.32.49.png',
    src: '/images/Posts and Activities/Untitled - October 12, 2026 at 14.32.49.png',
    alt: 'SCES branded social media poster from October 12, 2026',
    category: 'Posts & Activities',
    caption: 'SCES post shared on social media, October 12, 2026',
    usage: ['social', 'blog', 'print']
  },
  {
    id: 'post-11',
    filename: 'Untitled - October 15, 2026 at 12.55.32.png',
    src: '/images/Posts and Activities/Untitled - October 15, 2026 at 12.55.32.png',
    alt: 'SCES branded social media poster from October 15, 2026',
    category: 'Posts & Activities',
    caption: 'SCES post shared on social media, October 15, 2026',
    usage: ['social', 'blog', 'print']
  },
  {
    id: 'post-12',
    filename: 'Untitled - October 15, 2026 at 13.19.45.png',
    src: '/images/Posts and Activities/Untitled - October 15, 2026 at 13.19.45.png',
    alt: 'SCES branded social media poster from October 15, 2026',
    category: 'Posts & Activities',
    caption: 'SCES post shared on social media, October 15, 2026',
    usage: ['social', 'blog', 'print']
  },
  {
    id: 'post-13',
    filename: 'Untitled - October 15, 2026 at 13.19.45 (1).png',
    src: '/images/Posts and Activities/Untitled - October 15, 2026 at 13.19.45 (1).png',
    alt: 'SCES branded social media poster variation from October 15, 2026',
    category: 'Posts & Activities',
    caption: 'Alternate version of the SCES post from October 15, 2026',
    usage: ['social', 'blog']
  },
  {
    id: 'activity-1',
    filename: 'WhatsApp Image 2026-10-.jpeg',
    src: '/images/Posts and Activities/WhatsApp Image 2026-10-.jpeg',
    alt: 'Photo from SCES activities, October 2026',
    category: 'Posts & Activities',
    caption: 'SCES activities, October 2026',
    usage: ['gallery', 'blog', 'social']
  },
  {
    id: 'activity-2',
    filename: 'WhatsApp Image 2026-10-06 a.jpeg',
    src: '/images/Posts and Activities/WhatsApp Image 2026-10-06 a.jpeg',
    alt: 'Photo from SCES activities, October 2026',
    category: 'Posts & Activities',
    caption: 'SCES activities, October 6, 2026',
    usage: ['gallery', 'blog', 'social']
  },
  {
    id: 'activity-3',
    filename: 'WhatsApp Image 2026-10-06 at 8.19..jpeg',
    src: '/images/Posts and Activities/WhatsApp Image 2026-10-06 at 8.19..jpeg',
    alt: 'Photo from SCES activities, October 2026',
    category: 'Posts & Activities',
    caption: 'SCES activities, October 6, 2026',
    usage: ['gallery', 'blog', 'social']
  },
  {
    id: 'activity-4',
    filename: 'WhatsApp Image 2026-10-06 at 8.19.37 PM.jpeg',
    src: '/images/Posts and Activities/WhatsApp Image 2026-10-06 at 8.19.37 PM.jpeg',
    alt: 'Photo from SCES activities, October 2026',
    category: 'Posts & Activities',
    caption: 'SCES activities, October 6, 2026',
    usage: ['gallery', 'blog', 'social']
  },
  {
    id: 'activity-5',
    filename: 'WhatsApp Image 2026-10-06 at 8.19.4.jpeg',
    src: '/images/Posts and Activities/WhatsApp Image 2026-10-06 at 8.19.4.jpeg',
    alt: 'Photo from SCES activities, October 2026',
    category: 'Posts & Activities',
    caption: 'SCES activities, October 6, 2026',
    usage: ['gallery', 'blog', 'social']
  },
  {
    id: 'activity-6',
    filename: 'WhatsApp Image 2026-10-06 at 8.19.42 PM.jpeg',
    src: '/images/Posts and Activities/WhatsApp Image 2026-10-06 at 8.19.42 PM.jpeg',
    alt: 'Photo from SCES activities, October 2026',
    category: 'Posts & Activities',
    caption: 'SCES activities, October 6, 2026',
    usage: ['gallery', 'blog', 'social']
  },
  {
    id: 'activity-7',
    filename: 'WhatsApp Image 2026-10-06 at 8.19.43 .jpeg',
    src: '/images/Posts and Activities/WhatsApp Image 2026-10-06 at 8.19.43 .jpeg',
    alt: 'Photo from SCES activities, October 2026',
    category: 'Posts & Activities',
    caption: 'SCES activities, October 6, 2026',
    usage: ['gallery', 'blog', 'social']
  },
  {
    id: 'activity-8',
    filename: 'WhatsApp Image 2026-10-06 at 8.19.43 PM.jpeg',
    src: '/images/Posts and Activities/WhatsApp Image 2026-10-06 at 8.19.43 PM.jpeg',
    alt: 'Photo from SCES activities, October 2026',
    category: 'Posts & Activities',
    caption: 'SCES activities, October 6, 2026',
    usage: ['gallery', 'blog', 'social']
  },
  {
    id: 'activity-9',
    filename: 'WhatsApp Image 2026-10-06 at 8.19.52 .jpeg',
    src: '/images/Posts and Activities/WhatsApp Image 2026-10-06 at 8.19.52 .jpeg',
    alt: 'Photo from SCES activities, October 2026',
    category: 'Posts & Activities',
    caption: 'SCES activities, October 6, 2026',
    usage: ['gallery', 'blog', 'social']
  },
  {
    id: 'activity-10',
    filename: 'WhatsApp Image 2026-10-06 at 8.19.52 PM.jpeg',
    src: '/images/Posts and Activities/WhatsApp Image 2026-10-06 at 8.19.52 PM.jpeg',
    alt: 'Photo from SCES activities, October 2026',
    category: 'Posts & Activities',
    caption: 'SCES activities, October 6, 2026',
    usage: ['gallery', 'blog', 'social']
  },
  {
    id: 'activity-11',
    filename: 'WhatsApp Image 2026-10-06 at 8.jpeg',
    src: '/images/Posts and Activities/WhatsApp Image 2026-10-06 at 8.jpeg',
    alt: 'Photo from SCES activities, October 2026',
    category: 'Posts & Activities',
    caption: 'SCES activities, October 6, 2026',
    usage: ['gallery', 'blog', 'social']
  },
  {
    id: 'activity-12',
    filename: 'WhatsApp Image 2026-10-06.jpeg',
    src: '/images/Posts and Activities/WhatsApp Image 2026-10-06.jpeg',
    alt: 'Photo from SCES activities, October 2026',
    category: 'Posts & Activities',
    caption: 'SCES activities, October 6, 2026',
    usage: ['gallery', 'blog', 'social']
  }
];

export const galleryCategories = ['All', 'Events', 'Classrooms', 'Field Visits', 'Posts & Activities'] as const;

export type GalleryCategory = typeof galleryCategories[number];

// Helper functions
export const getImagesByCategory = (category: GalleryCategory): GalleryImage[] => {
  if (category === 'All') return galleryImages;
  return galleryImages.filter(image => image.category === category);
};

export const getImagesByUsage = (usage: GalleryUsage): GalleryImage[] => {
  return galleryImages.filter(image => image.usage?.includes(usage));
};

export const getImageSrc = (image: GalleryImage): string => {
  return image.src ?? `/gallery/${image.filename}`;
};

export const getFeaturedImages = (): GalleryImage[] => {
  return galleryImages.filter(image => image.featured);
};

export const getImageById = (id: string): GalleryImage | undefined => {
  return galleryImages.find(image => image.id === id);
};