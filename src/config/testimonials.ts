import { Testimonial } from '@/types';

export const testimonials: Testimonial[] = [
  {
    name: "Priya Sharma",
    role: "Parent",
    content: "SCES has transformed my daughter's life. She was struggling with her studies, but the dedicated teachers and volunteers helped her excel. Now she dreams of becoming a doctor to help others in our community.",
    image: "/testimonials/priya-sharma.jpg" // Placeholder - will use initials if image not available
  },
  {
    name: "Rajesh Kumar",
    role: "Former Student",
    content: "I joined SCES when I was 8 years old and couldn't even read properly. Today, I'm pursuing my engineering degree. The foundation they provided changed everything for me and my family.",
    image: "/testimonials/rajesh-kumar.jpg" // Placeholder
  },
  {
    name: "Meera Patel",
    role: "Community Leader",
    content: "SCES doesn't just educate children; they transform entire communities. I've seen families break out of poverty cycles because their children received quality education through this wonderful organization.",
    image: "/testimonials/meera-patel.jpg" // Placeholder
  },
  {
    name: "Amit Singh",
    role: "Volunteer Teacher",
    content: "Working with SCES has been the most rewarding experience of my life. Seeing the spark in children's eyes when they understand a concept for the first time is priceless. These kids are our future leaders.",
    image: "/testimonials/amit-singh.jpg" // Placeholder
  },
  {
    name: "Sunita Devi",
    role: "Parent",
    content: "My son was falling behind in school, but SCES gave him the extra support he needed. The teachers are so caring and patient. Now he's one of the top students in his class and wants to become a teacher himself.",
    image: "/testimonials/sunita-devi.jpg" // Placeholder
  },
  {
    name: "Dr. Vikram Gupta",
    role: "Education Consultant",
    content: "SCES's approach to education is holistic and effective. They don't just focus on academics but also on character building and life skills. This is exactly what underprivileged children need to succeed."
  }
];

export const impactStories = [
  {
    id: "ravi-success-story",
    title: "From Street Vendor to Software Engineer",
    studentName: "Ravi Mehta",
    age: 22,
    location: "Delhi",
    image: "/impact-stories/ravi-mehta.jpg", // Placeholder
    story: "Ravi used to help his father sell vegetables on the streets of Delhi. When he was 10, SCES volunteers found him and convinced his parents to let him attend our evening classes. Despite working during the day, Ravi never missed a class. His dedication paid off when he scored 95% in his 12th grade exams and received a full scholarship to study computer science. Today, he works as a software engineer at a leading tech company and supports his family while also volunteering with SCES to help other children like him.",
    beforeImage: "/impact-stories/ravi-before.jpg", // Placeholder
    afterImage: "/impact-stories/ravi-after.jpg", // Placeholder
    quote: "SCES didn't just give me education; they gave me hope and showed me that my dreams were possible.",
    achievements: [
      "95% in 12th grade exams",
      "Full scholarship to engineering college",
      "Software Engineer at tech company",
      "Now volunteers with SCES"
    ],
    timeline: [
      { year: 2012, event: "Joined SCES evening classes" },
      { year: 2017, event: "Completed 12th grade with 95%" },
      { year: 2021, event: "Graduated with B.Tech in Computer Science" },
      { year: 2022, event: "Started career as Software Engineer" }
    ]
  },
  {
    id: "anita-success-story", 
    title: "Breaking Barriers: First Girl in Family to Graduate",
    studentName: "Anita Kumari",
    age: 20,
    location: "Mehrauli",
    image: "/impact-stories/anita-kumari.jpg", // Placeholder
    story: "Anita comes from a traditional family where girls were expected to help with household work instead of studying. When she was 12, her parents wanted to stop her education, but SCES counselors worked with the family to show them the importance of girls' education. Anita excelled in her studies and became the first girl in her family to complete 12th grade. She's now pursuing a Bachelor's degree in Education and plans to become a teacher to inspire other girls in her community.",
    beforeImage: "/impact-stories/anita-before.jpg", // Placeholder
    afterImage: "/impact-stories/anita-after.jpg", // Placeholder
    quote: "SCES taught me that being a girl is not a limitation but a strength. I want to show other girls that they can achieve anything.",
    achievements: [
      "First girl in family to complete 12th grade",
      "Pursuing Bachelor's in Education",
      "Mentors younger girls in her community",
      "Received scholarship for college"
    ],
    timeline: [
      { year: 2015, event: "Joined SCES with family counseling" },
      { year: 2020, event: "Completed 12th grade - family's first girl graduate" },
      { year: 2021, event: "Started B.Ed program with scholarship" },
      { year: 2023, event: "Began mentoring program for girls" }
    ]
  },
  {
    id: "community-transformation",
    title: "Transforming an Entire Community",
    studentName: "Ward No. 6 Community",
    age: null,
    location: "Mehrauli, Delhi",
    image: "/impact-stories/community.jpg", // Placeholder
    story: "When SCES started working in Ward No. 6 of Mehrauli in 2010, the literacy rate was just 40%. Many children worked instead of attending school, and parents didn't see the value of education. Through persistent community engagement, mobile teaching units, and parent awareness programs, SCES has transformed this community. Today, 85% of children in the area attend school regularly, and the community has produced its first doctors, engineers, and teachers.",
    beforeImage: "/impact-stories/community-before.jpg", // Placeholder
    afterImage: "/impact-stories/community-after.jpg", // Placeholder
    quote: "Education is not just changing individual lives; it's transforming our entire community for generations to come.",
    achievements: [
      "Literacy rate increased from 40% to 85%",
      "120+ children now in regular schooling",
      "First community members in professional careers",
      "Parent awareness program reaching 200+ families"
    ],
    timeline: [
      { year: 2010, event: "SCES begins work in Ward No. 6" },
      { year: 2015, event: "First mobile teaching unit established" },
      { year: 2018, event: "Community literacy rate reaches 70%" },
      { year: 2023, event: "85% literacy rate achieved" }
    ]
  }
];

export default testimonials;