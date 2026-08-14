"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types/product";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

interface FeaturedSectionProps {
  products: Product[];
  isLoading: boolean;
}

export default function FeaturedSection({ products, isLoading }: FeaturedSectionProps) {
  const safeProducts = products ?? [];

  return (
    <section className="bg-bg-muted py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-center justify-between"
        >
          <div>
            <h2 className="text-2xl font-bold text-text sm:text-3xl">New Arrivals</h2>
            <p className="mt-2 text-text-muted">Check out our latest additions</p>
          </div>
          <Link
            href="/shop"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
          >
            View All <FiArrowRight size={14} />
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <p className="text-text-muted">Loading products...</p>
          </div>
        ) : safeProducts.length === 0 ? (
          <p className="text-center text-text-muted">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {safeProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/shop"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View All Products <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}