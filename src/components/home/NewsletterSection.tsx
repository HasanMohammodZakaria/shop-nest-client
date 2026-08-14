"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { FiMail } from "react-icons/fi";
import Button from "@/components/ui/Button";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    // NOTE: no backend endpoint for newsletter subscriptions yet —
    // this just confirms visually. Wire up a real API call later if needed.
    toast.success("Subscribed! Thanks for joining ShopNest.");
    setEmail("");
  };

  return (
    <section className="bg-secondary py-16">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
            <FiMail size={22} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white sm:text-3xl">Stay in the loop</h2>
        <p className="mt-2 text-slate-300">
          Subscribe to get special offers, free giveaways, and new arrivals updates.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-md border border-slate-700 bg-secondary-light px-4 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary sm:w-72"
          />
          <Button type="submit" variant="primary">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}