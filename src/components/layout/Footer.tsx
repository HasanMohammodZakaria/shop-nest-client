import Link from 'next/link';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 — Logo, description, socials */}
          <div>
            <Link href="/" className="text-xl font-bold text-white">
              Shop<span className="text-primary-light">Nest</span>
            </Link>
            <p className="mt-3 text-sm text-slate-400">
              Your one-stop online shop for quality products at the best prices —
              fast delivery, secure payments, and support you can trust.
            </p>
            <div className="mt-5 flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-slate-400 hover:text-primary-light"
              >
                <FiFacebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-slate-400 hover:text-primary-light"
              >
                <FiInstagram size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-slate-400 hover:text-primary-light"
              >
                <FiTwitter size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-slate-400 hover:text-primary-light"
              >
                <FiYoutube size={18} />
              </a>
            </div>
          </div>

          {/* Column 2 — Shop */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Shop</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li><Link href="/shop" className="hover:text-primary-light">All Products</Link></li>
              <li><Link href="/categories" className="hover:text-primary-light">Categories</Link></li>
              <li><Link href="/wishlist" className="hover:text-primary-light">Wishlist</Link></li>
              <li><Link href="/cart" className="hover:text-primary-light">Cart</Link></li>
            </ul>
          </div>

          {/* Column 3 — Customer Service */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Customer Service
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li><Link href="/contact" className="hover:text-primary-light">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-primary-light">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-primary-light">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-primary-light">Returns & Refunds</Link></li>
            </ul>
          </div>

          {/* Column 4 — Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Company</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-primary-light">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-primary-light">Careers</Link></li>
              <li><Link href="/privacy" className="hover:text-primary-light">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary-light">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-slate-700 pt-6 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} ShopNest. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;