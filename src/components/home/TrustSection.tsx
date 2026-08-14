import { FiTruck, FiShield, FiRefreshCw, FiHeadphones } from "react-icons/fi";

const features = [
  {
    icon: FiTruck,
    title: "Free Shipping",
    description: "On all orders over $50",
  },
  {
    icon: FiShield,
    title: "Secure Payment",
    description: "100% secure checkout",
  },
  {
    icon: FiRefreshCw,
    title: "Easy Returns",
    description: "7-day return policy",
  },
  {
    icon: FiHeadphones,
    title: "24/7 Support",
    description: "Dedicated customer care",
  },
];

export default function TrustSection() {
  return (
    <section className="bg-bg-muted py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-text sm:text-3xl">
            Why Shop With Us
          </h2>
          <p className="mt-2 text-text-muted">
            Committed to quality and your peace of mind
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center gap-3 rounded-xl border border-border bg-bg p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <feature.icon size={22} />
              </div>
              <div>
                <p className="font-semibold text-text text-sm">
                  {feature.title}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
