'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import {
  FiHeart,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiChevronDown,
  FiUser,
  FiPackage,
  FiHeart as FiWishlist,
  FiBox,
  FiPlusSquare,
  FiGrid,
  FiUsers,
} from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import Button from '@/components/ui/Button';
import CartDrawer from './CartDrawer';
import { useRouter } from 'next/navigation';

interface DashboardLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const router = useRouter(); 
  const { count: wishlistCount } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const userLinks: DashboardLink[] = [
    { label: 'My Profile', href: '/dashboard/profile', icon: <FiUser size={16} /> },
    { label: 'My Orders', href: '/dashboard/orders', icon: <FiPackage size={16} /> },
    { label: 'My Wishlist', href: '/dashboard/wishlist', icon: <FiWishlist size={16} /> },
  ];

  const adminLinks: DashboardLink[] = [
    { label: 'Manage Products', href: '/dashboard/products', icon: <FiBox size={16} /> },
    { label: 'Add Product', href: '/dashboard/products/new', icon: <FiPlusSquare size={16} /> },
    { label: 'Manage Categories', href: '/dashboard/categories', icon: <FiGrid size={16} /> },
    { label: 'Manage Users', href: '/dashboard/users', icon: <FiUsers size={16} /> },
  ];

  const dashboardLinks = user?.role === 'ADMIN' ? adminLinks : userLinks;

  const avatarSrc =
    user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=059669&color=fff`;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-bg">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-secondary">
            Shop<span className="text-primary">Nest</span>
          </Link>

          {/* Desktop right side */}
          <div className="hidden items-center gap-6 md:flex">
            <Link href="/shop" className="text-sm font-medium text-text hover:text-primary">
              Shop
            </Link>

            <Link
              href="/dashboard/wishlist"
              aria-label="Wishlist"
              className="relative text-text hover:text-primary"
            >
              <FiHeart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart icon — now toggles the drawer instead of navigating */}
            <button
              onClick={() => setCartOpen((v) => !v)}
              aria-label="Cart"
              className="relative text-text hover:text-primary"
            >
              <FiShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {!user ? (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full pr-1"
                >
                  <Image
                    src={avatarSrc}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-text">{user.name}</span>
                  <FiChevronDown size={16} className="text-text-muted" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-bg py-1 shadow-lg">
                    <div className="border-b border-border px-4 py-2">
                      <p className="text-sm font-medium text-text truncate">{user.name}</p>
                      <p className="text-xs text-text-muted truncate">{user.email}</p>
                    </div>

                    {dashboardLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-bg-muted"
                      >
                        {link.icon}
                        {link.label}
                      </Link>
                    ))}

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                        router.push("/login");
                      }}
                      className="mt-1 block w-full border-t border-border px-4 py-2 text-left text-sm text-error hover:bg-bg-muted"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => setCartOpen((v) => !v)} aria-label="Cart" className="relative text-text">
              <FiShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>
            <button
              className="text-text"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <FiMenu size={24} />
            </button>
          </div>
        </nav>

        {/* Mobile off-canvas menu (navigation links, unrelated to cart) */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-72 overflow-y-auto bg-bg p-5 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-lg font-bold text-secondary">
                  Shop<span className="text-primary">Nest</span>
                </span>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <FiX size={22} className="text-text" />
                </button>
              </div>

              {user && (
                <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
                  <Image
                    src={avatarSrc}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-text">{user.name}</p>
                    <p className="truncate text-xs text-text-muted">{user.email}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4">
                <Link href="/shop" onClick={() => setMobileOpen(false)} className="text-text">
                  Shop
                </Link>
                <Link
                  href="/dashboard/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-text"
                >
                  <FiHeart size={18} /> Wishlist
                  {wishlistCount > 0 && (
                    <span className="ml-1 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-text"
                >
                  <FiShoppingCart size={18} /> Cart
                  {totalItems > 0 && (
                    <span className="ml-1 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {user ? (
                  <>
                    <div className="mt-2 border-t border-border pt-4">
                      <p className="mb-2 text-xs font-semibold uppercase text-text-muted">
                        Dashboard
                      </p>
                      <div className="flex flex-col gap-3">
                        {dashboardLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 text-text"
                          >
                            {link.icon}
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        logout();
                        router.push("/login");
                      }}
                      className="mt-2 border-t border-border pt-4 text-left text-error"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full">Login</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Cart drawer — lives outside <header> so its fixed positioning covers the full screen */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;