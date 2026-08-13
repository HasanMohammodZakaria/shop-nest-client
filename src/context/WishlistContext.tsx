"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getMyWishlist, addToWishlist, removeFromWishlist } from "@/lib/api/wishlist";

interface WishlistContextType {
  wishlistedIds: Set<string>;
  count: number;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  refreshWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, token } = useAuth();
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());

  const refreshWishlist = useCallback(() => {
    if (!token) {
      setWishlistedIds(new Set());
      return;
    }
    getMyWishlist(token)
      .then((items) => {
        setWishlistedIds(new Set(items.map((item) => item.productId)));
      })
      .catch(() => {
        // silently ignore — wishlist badge just won't update
      });
  }, [token]);

  // Whenever the logged-in user changes (login/logout), re-sync the wishlist
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshWishlist();
  }, [user, refreshWishlist]);

  const toggleWishlist = async (productId: string) => {
    if (!token) return;

    const alreadyWishlisted = wishlistedIds.has(productId);

    // Optimistic update — update the UI immediately, before the API responds,
    // so the heart icon and Navbar badge feel instant.
    setWishlistedIds((prev) => {
      const next = new Set(prev);
      if (alreadyWishlisted) next.delete(productId);
      else next.add(productId);
      return next;
    });

    try {
      if (alreadyWishlisted) {
        await removeFromWishlist(productId, token);
      } else {
        await addToWishlist(productId, token);
      }
    } catch {
      // Revert on failure
      setWishlistedIds((prev) => {
        const next = new Set(prev);
        if (alreadyWishlisted) next.add(productId);
        else next.delete(productId);
        return next;
      });
      throw new Error("Failed to update wishlist");
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistedIds,
        count: wishlistedIds.size,
        isWishlisted: (productId) => wishlistedIds.has(productId),
        toggleWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}