
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedSection from "@/components/home/FeaturedSection";
import { getAllCategories } from "@/lib/api/categories";
import { getAllProducts } from "@/lib/api/products";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import { getRecentReviews } from "@/lib/api/reviews";
import TrustSection from "@/components/home/TrustSection";
import NewsletterSection from "@/components/home/NewsletterSection";

export default async function HomePage() {
  const categories = await getAllCategories().catch(() => []);

  const featuredResult = await getAllProducts({
    limit: 4,
    sortBy: "createdAt",
    sortOrder: "desc",
  }).catch(() => ({ meta: { page: 1, limit: 4, total: 0, totalPages: 0 }, data: [] }));

  const recentReviews = await getRecentReviews(6).catch(() => []);

  return (
    <div>
      <HeroSection />
      <CategorySection categories={categories} />
      <FeaturedSection products={featuredResult.data} isLoading={false} />
      <TestimonialsSection reviews={recentReviews} />
      <TrustSection />
      <NewsletterSection />
    </div>
  );
}
