"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Category } from "@/types/category";

const categoryImages: Record<string, string> = {
  Electronics:
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600",
  Fashion: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600",
  "Home & Kitchen":
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600",
  "Beauty & Personal Care":
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600",
  "Sports & Outdoors":
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600",
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

interface CategorySectionProps {
  categories: Category[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h2 className="text-2xl font-bold text-text sm:text-3xl">
          Shop by Category
        </h2>
        <p className="mt-2 text-text-muted">
          Find exactly what you&apos;re looking for
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Link
              href={`/shop?categoryId=${cat.id}`}
              className="group relative block h-36 overflow-hidden rounded-xl border border-border shadow-sm transition-shadow hover:shadow-md sm:h-44"
            >
              <Image
                src={
                  cat.image ||
                  categoryImages[cat.name] ||
                  "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600"
                }
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-secondary/50 transition-colors group-hover:bg-secondary/60" />
              <div className="absolute inset-0 flex items-end p-3">
                <span className="text-sm font-semibold text-white sm:text-base">
                  {cat.name}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
