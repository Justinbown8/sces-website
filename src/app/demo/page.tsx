import { Button, ImpactCard, TestimonialCard, StaffCard } from '@/components/ui';

// Example icons
const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
            SCES Design System Demo
          </h1>
          <p className="text-text-light text-lg">
            Showcasing the core UI components for the SCES NGO website
          </p>
        </div>

        {/* Buttons Section */}
        <section>
          <h2 className="font-heading text-2xl font-semibold mb-6">Button Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-3">
              <h3 className="font-medium text-text-gray">Primary</h3>
              <Button variant="primary">Donate Now</Button>
              <Button variant="primary" loading>Processing...</Button>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-text-gray">Secondary</h3>
              <Button variant="secondary">Learn More</Button>
              <Button variant="secondary" disabled>Disabled</Button>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-text-gray">Outline</h3>
              <Button variant="outline">Contact Us</Button>
              <Button variant="outline" size="lg">Large Button</Button>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-text-gray">Ghost</h3>
              <Button variant="ghost">Cancel</Button>
              <Button variant="ghost" size="sm">Small Button</Button>
            </div>
          </div>
        </section>

        {/* Impact Cards Section */}
        <section>
          <h2 className="font-heading text-2xl font-semibold mb-6">Impact Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ImpactCard
              title="School Kit"
              amount="500"
              description="Provides essential school supplies including notebooks, pencils, and books for one child for an entire academic year."
              icon={<BookIcon />}
            />
            <ImpactCard
              title="Tuition Support"
              amount="1,000"
              description="Covers monthly tuition fees for one child, ensuring they can continue their education without financial barriers."
              icon={<HeartIcon />}
              highlight={true}
            />
            <ImpactCard
              title="Digital Access"
              amount="2,500"
              description="Provides a tablet and internet access for digital learning, opening up new educational opportunities."
              icon={<BookIcon />}
            />
          </div>
        </section>

        {/* Testimonial Cards Section */}
        <section>
          <h2 className="font-heading text-2xl font-semibold mb-6">Testimonial Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TestimonialCard
              quote="SCES has transformed my daughter's life. She now has access to quality education and a bright future ahead."
              author="Priya Sharma"
              role="Parent"
              rating={5}
            />
            <TestimonialCard
              quote="The support I received from SCES helped me complete my studies and now I'm pursuing my dream of becoming a teacher."
              author="Rahul Kumar"
              role="Former Student"
              rating={5}
            />
          </div>
        </section>

        {/* Staff Cards Section */}
        <section>
          <h2 className="font-heading text-2xl font-semibold mb-6">Staff Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StaffCard
              name="Dr. Rajesh Gupta"
              role="Founder & President"
              bio="Dr. Gupta has dedicated over 20 years to educational reform and child welfare. He holds a PhD in Education Policy and has worked with various NGOs across India."
              email="rajesh@sces.org"
              phone="+91 99536 65620"
            />
            <StaffCard
              name="Sunita Devi"
              role="Program Director"
              bio="Sunita oversees all educational programs and has been instrumental in developing our curriculum. She has a Master's in Child Psychology."
              email="sunita@sces.org"
            />
            <StaffCard
              name="Amit Patel"
              role="Community Outreach Coordinator"
              bio="Amit manages our community relationships and volunteer programs. His grassroots approach has helped us reach over 500 families."
              phone="+91 98765 43210"
            />
          </div>
        </section>

        {/* Design Tokens Preview */}
        <section>
          <h2 className="font-heading text-2xl font-semibold mb-6">Design Tokens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium text-text-gray mb-4">Colors</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-primary-yellow border"></div>
                  <span className="text-sm">Primary Yellow</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-primary-orange border"></div>
                  <span className="text-sm">Primary Orange</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-button-navy border"></div>
                  <span className="text-sm">Button Navy</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-button-blue border"></div>
                  <span className="text-sm">Button Blue</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-text-gray mb-4">Typography</h3>
              <div className="space-y-2">
                <p className="font-heading text-xl font-bold">Montserrat Heading</p>
                <p className="font-body text-base">Poppins Body Text</p>
                <p className="text-text-light text-sm">Light Text Color</p>
                <p className="text-text-muted text-xs">Muted Text Color</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}