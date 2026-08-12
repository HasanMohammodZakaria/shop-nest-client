'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FiHeart, FiShoppingCart, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dashboardHref = user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';

  const avatarSrc =
    user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=059669&color=fff`;

  return (
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
          <Link href="/wishlist" aria-label="Wishlist" className="text-text hover:text-primary">
            <FiHeart size={20} />
          </Link>
          <Link href="/cart" aria-label="Cart" className="text-text hover:text-primary">
            <FiShoppingCart size={20} />
          </Link>

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
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-bg py-1 shadow-lg">
                  <Link
                    href={dashboardHref}
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-text hover:bg-bg-muted"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-error hover:bg-bg-muted"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="text-text md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <FiMenu size={24} />
        </button>
      </nav>

      {/* Mobile off-canvas menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 bg-bg p-5 shadow-xl">
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
                <span className="font-medium text-text">{user.name}</span>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <Link href="/shop" onClick={() => setMobileOpen(false)} className="text-text">
                Shop
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-text"
              >
                <FiHeart size={18} /> Wishlist
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-text"
              >
                <FiShoppingCart size={18} /> Cart
              </Link>

              {user ? (
                <>
                  <Link
                    href={dashboardHref}
                    onClick={() => setMobileOpen(false)}
                    className="text-text"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="text-left text-error"
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
  );
};

export default Navbar;