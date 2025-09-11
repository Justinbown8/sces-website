import { 
  HeroSlide, 
  Testimonial, 
  ImpactStory, 
  StaffMember, 
  BlogPost
} from '@/types';

// Content configuration interface
export interface ContentConfig {
  hero: {
    slides: HeroSlide[];
  };
  mission: {
    title: string;
    description: string;
    vision: string;
    values: string[];
  };
  impact: {
    metrics: {
      childrenHelped: number;
      volunteers: number;
      cities: number;
      schoolsSupported: number;
    };
    stories: ImpactStory[];
  };
  testimonials: Testimonial[];
  staff: StaffMember[];
  blog: {
    posts: BlogPost[];
    categories: string[];
  };
  donation: {
    presetAmounts: number[];
    impactCards: {
      amount: number;
      title: string;
      description: string;
      icon: string;
    }[];
  };
  volunteer: {
    opportunities: {
      title: string;
      description: string;
      requirements: string[];
      timeCommitment: string;
    }[];
    benefits: string[];
  };
}

// Main content configuration
export const contentConfig: ContentConfig = {
  hero: {
    slides: [
      {
        image: "/PIC.jpg",
        title: "Every Child Deserves Education",
        subtitle: "Join us in providing quality educational opportunities to underserved children across India. Your support creates brighter futures for the next generation.",
        ctaPrimary: {
          text: "Donate Now",
          href: "/donate",
          variant: "primary"
        },
        ctaSecondary: {
          text: "Become a Volunteer",
          href: "/volunteer",
          variant: "secondary"
        }
      },
      {
        image: "/PIC1.jpg",
        title: "Building Brighter Futures",
        subtitle: "Through education, we empower children to break the cycle of poverty and create lasting change in their communities.",
        ctaPrimary: {
          text: "Support Education",
          href: "/donate",
          variant: "primary"
        },
        ctaSecondary: {
          text: "Learn More",
          href: "/about",
          variant: "secondary"
        }
      },
      {
        image: "/PIC2.jpg",
        title: "Together We Make a Difference",
        subtitle: "Our dedicated volunteers and supporters are transforming lives through the power of education. Be part of this incredible journey.",
        ctaPrimary: {
          text: "Join Our Mission",
          href: "/volunteer",
          variant: "primary"
        },
        ctaSecondary: {
          text: "See Our Impact",
          href: "/gallery",
          variant: "secondary"
        }
      }
    ]
  },
  
  mission: {
    title: "Empowering Children Through Education",
    description: "Sunrise Children Educational Society (SCES) is dedicated to providing quality educational opportunities to underserved children across India. We believe that every child, regardless of their background, deserves access to education that can transform their lives and communities.",
    vision: "To create a world where every child has access to quality education and the opportunity to reach their full potential.",
    values: [
      "Equality in Education",
      "Community Empowerment", 
      "Sustainable Development",
      "Transparency and Accountability",
      "Innovation in Learning"
    ]
  },

  impact: {
    metrics: {
      childrenHelped: 2500,
      volunteers: 150,
      cities: 12,
      schoolsSupported: 45
    },
    stories: [
      {
        id: "priya-story",
        title: "From Street to School: Priya's Journey",
        studentName: "Priya",
        age: 12,
        location: "New Delhi",
        image: "/impact/priya.jpg",
        story: "Priya was working as a street vendor with her mother when our outreach team found her. Today, she's one of the top students in her class and dreams of becoming a teacher to help other children like herself.",
        quote: "Education gave me hope. Now I want to give that same hope to other children.",
        achievements: [
          "Enrolled in formal education at age 10",
          "Achieved 95% attendance in first year",
          "Scored in top 10% of her class",
          "Became peer mentor for younger students"
        ],
        timeline: [
          { year: 2022, event: "First contact with SCES outreach team" },
          { year: 2022, event: "Enrolled in bridge education program" },
          { year: 2023, event: "Transitioned to formal schooling" },
          { year: 2024, event: "Became student leader and peer mentor" }
        ]
      },
      {
        id: "rahul-story", 
        title: "Digital Dreams: Rahul's Tech Journey",
        studentName: "Rahul",
        age: 14,
        location: "Mumbai",
        image: "/impact/rahul.jpg",
        story: "Rahul had never seen a computer before joining our digital literacy program. Now he's teaching other children basic computer skills and has built his first website.",
        quote: "Technology opened up a whole new world for me. I want to use it to solve problems in my community.",
        achievements: [
          "Completed digital literacy certification",
          "Built first website at age 13",
          "Teaches computer basics to younger children",
          "Won school science fair with tech project"
        ],
        timeline: [
          { year: 2023, event: "Joined SCES digital literacy program" },
          { year: 2023, event: "Learned basic computer operations" },
          { year: 2024, event: "Started web development course" },
          { year: 2024, event: "Became junior tech instructor" }
        ]
      }
    ]
  },

  testimonials: [
    {
      name: "Sunita Sharma",
      role: "Parent",
      content: "SCES changed my daughter's life completely. She was shy and struggling in school, but with their support and mentorship, she's now confident and excelling in her studies. I'm forever grateful.",
      image: "/testimonials/sunita.jpg"
    },
    {
      name: "Rajesh Kumar",
      role: "Community Leader",
      content: "The work SCES does in our community is remarkable. They don't just provide education; they transform entire families and give hope to children who had none before.",
      image: "/testimonials/rajesh.jpg"
    },
    {
      name: "Anita Patel",
      role: "Volunteer Teacher",
      content: "Volunteering with SCES has been the most rewarding experience of my life. Seeing children light up when they learn something new reminds me why education is so powerful.",
      image: "/testimonials/anita.jpg"
    }
  ],

  staff: [
    {
      name: "Dr. Meera Gupta",
      role: "Founder & President",
      bio: "Dr. Meera Gupta founded SCES in 2015 with a vision to make quality education accessible to every child. With over 20 years of experience in education and social work, she leads our mission with passion and dedication.",
      image: "/staff/meera-gupta.jpg"
    },
    {
      name: "Amit Sharma",
      role: "Program Director",
      bio: "Amit oversees all educational programs and ensures quality delivery across our centers. His background in curriculum development and teacher training helps maintain high educational standards.",
      image: "/staff/amit-sharma.jpg"
    },
    {
      name: "Priya Singh",
      role: "Community Outreach Coordinator",
      bio: "Priya leads our community engagement efforts and identifies children who need educational support. Her deep understanding of local communities helps us reach the most vulnerable children.",
      image: "/staff/priya-singh.jpg"
    }
  ],

  blog: {
    posts: [
      {
        id: "education-transforms-communities",
        title: "How Education Transforms Entire Communities",
        excerpt: "When we educate a child, we don't just change one life – we transform families, neighborhoods, and entire communities. Here's how education creates ripple effects of positive change.",
        content: "Education is often called the great equalizer, but its impact goes far beyond individual achievement...",
        author: "Dr. Meera Gupta",
        publishDate: new Date("2024-01-15"),
        tags: ["Education", "Community Impact", "Social Change"],
        featuredImage: "/blog/education-transforms.jpg"
      },
      {
        id: "digital-literacy-rural-india",
        title: "Bridging the Digital Divide in Rural India",
        excerpt: "In an increasingly digital world, ensuring rural children have access to technology and digital literacy is crucial for their future success.",
        content: "The digital divide between urban and rural areas continues to widen...",
        author: "Amit Sharma",
        publishDate: new Date("2024-02-01"),
        tags: ["Digital Literacy", "Rural Education", "Technology"],
        featuredImage: "/blog/digital-divide.jpg"
      }
    ],
    categories: ["Education", "Community Impact", "Digital Literacy", "Volunteer Stories", "Success Stories"]
  },

  donation: {
    presetAmounts: [500, 1000, 2500, 5000],
    impactCards: [
      {
        amount: 500,
        title: "School Kit for One Child",
        description: "Provides books, notebooks, pencils, and other essential supplies for one child for an entire academic year.",
        icon: "school-bag"
      },
      {
        amount: 1000,
        title: "Monthly Tuition Support",
        description: "Covers tuition fees and educational materials for one child for one month in our learning centers.",
        icon: "graduation-cap"
      },
      {
        amount: 2500,
        title: "Digital Learning Access",
        description: "Provides computer access, internet connectivity, and digital literacy training for one child for 3 months.",
        icon: "computer"
      }
    ]
  },

  volunteer: {
    opportunities: [
      {
        title: "Teaching Assistant",
        description: "Help our teachers in classrooms, assist with homework, and provide one-on-one support to students who need extra help.",
        requirements: ["High school education", "Patience with children", "Basic English/Hindi skills"],
        timeCommitment: "4-6 hours per week"
      },
      {
        title: "Digital Literacy Instructor",
        description: "Teach basic computer skills, internet safety, and digital literacy to children and adults in our community centers.",
        requirements: ["Computer proficiency", "Teaching experience preferred", "Ability to explain technical concepts simply"],
        timeCommitment: "6-8 hours per week"
      },
      {
        title: "Community Outreach Volunteer",
        description: "Help identify children who need educational support, conduct home visits, and build relationships with families in the community.",
        requirements: ["Good communication skills", "Cultural sensitivity", "Ability to work in diverse communities"],
        timeCommitment: "8-10 hours per week"
      }
    ],
    benefits: [
      "Make a direct impact on children's lives",
      "Gain valuable teaching and mentoring experience",
      "Connect with like-minded volunteers and staff",
      "Receive training and professional development opportunities",
      "Flexible scheduling to fit your availability"
    ]
  }
};

export default contentConfig;