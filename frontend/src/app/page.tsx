import { LandingNavbar } from "@/components/landing/navbar";
import { LandingHero } from "@/components/landing/hero";
import { LandingFeatures } from "@/components/landing/features";
import { LandingAI } from "@/components/landing/ai-features";
import { LandingScreenshots } from "@/components/landing/screenshots";
import { LandingTestimonials } from "@/components/landing/testimonials";
import { LandingPricing } from "@/components/landing/pricing";
import { LandingAbout } from "@/components/landing/about";
import { LandingFAQ } from "@/components/landing/faq";
import { LandingContact } from "@/components/landing/contact";
import { LandingFooter } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main>
      <LandingNavbar />
      <LandingHero />
      <LandingFeatures />
      <LandingAI />
      <LandingScreenshots />
      <LandingTestimonials />
      <LandingPricing />
      <LandingAbout />
      <LandingFAQ />
      <LandingContact />
      <LandingFooter />
    </main>
  );
}
