export interface PresidentInfo {
  name: string;
  title: string;
  image: string;
  bio: string[];
  visionStatement: string;
  keyInitiatives: string[];
  signature?: string;
}

export const presidentInfo: PresidentInfo = {
  name: "Rajni Chawla",
  title: "President & Founder",
  image: "/rajni chawla - president.jpg",
  bio: [
    "Rajni Chawla has dedicated over 15 years of her life to transforming educational opportunities for underprivileged children across India. With a background in education and social work, she founded Sunrise Children Educational Society with a vision to ensure that every child, regardless of their economic background, has access to quality education.",
    "Before establishing SCES, Ms. Chawla worked as an educator in rural schools where she witnessed firsthand the challenges faced by children from disadvantaged communities. This experience ignited her passion for creating systemic change in the education sector.",
    "Under her leadership, SCES has grown from a small community initiative to an organization that has positively impacted thousands of children across multiple cities in India. Her approach combines grassroots community engagement with innovative educational methodologies, with a special focus on empowering girls and women through education."
  ],
  visionStatement: "Education is not just about learning facts, but about lighting the fire of curiosity and empowering children to dream beyond their circumstances. Every child deserves the opportunity to reach their full potential, and it is our responsibility as a society to ensure that economic barriers never stand in the way of a bright future.",
  keyInitiatives: [
    "Digital Learning Centers: Establishing technology-enabled learning spaces in underserved communities",
    "Teacher Training Programs: Empowering local educators with modern teaching methodologies and resources",
    "Scholarship Programs: Providing financial support for higher education to exceptional students from disadvantaged backgrounds",
    "Community Engagement: Working closely with parents and local leaders to create sustainable educational ecosystems",
    "Girls Education Initiative: Special programs focused on ensuring girls have equal access to education and opportunities",
    "Nutrition and Health: Ensuring children have access to proper nutrition and healthcare to support their learning journey"
  ],
  signature: "/president-signature.png" // Placeholder for signature graphic
};