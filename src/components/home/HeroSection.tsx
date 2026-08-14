"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-secondary">
      <div className="absolute inset-0 opacity-20">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-start px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white"
        >
          New Season Arrivals
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
        >
          Everything you need, <span className="text-primary-light">delivered</span> to your door.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 max-w-lg text-base text-gray-300 sm:text-lg"
        >
          Discover thousands of quality products across electronics, fashion, home, beauty, and more — at prices you&apos;ll love.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <Link
            href="/shop"
            className="flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Shop Now <FiArrowRight size={18} />
          </Link>
          <Link
            href="/shop"
            className="flex items-center gap-2 rounded-md border border-white/30 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
          >
            Explore Categories
          </Link>
        </motion.div>
      </div>
    </section>
  );
}