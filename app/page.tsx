import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedEvents } from "@/components/featured-events"
import { CategoriesSection } from "@/components/categories-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedEvents />
        <CategoriesSection />
      </main>
      <Footer />
    </div>
  )
}
