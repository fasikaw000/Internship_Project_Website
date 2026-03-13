import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const hasLoaded = useRef(false);
  const prevUserRef = useRef(null);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Determine the storage key based on user ID
  const getCartKey = (u) => (u ? `cart_${u.id || u._id}` : "cart_guest");

  // LOAD cart when user changes
  useEffect(() => {
    const key = getCartKey(user);
    const saved = sessionStorage.getItem(key);
    const parsed = saved ? JSON.parse(saved) : [];

    // If we just logged in, merge guest items into user cart
    if (user && !prevUserRef.current) {
      const guestSaved = sessionStorage.getItem("cart_guest");
      if (guestSaved) {
        const guestItems = JSON.parse(guestSaved);
        if (guestItems.length > 0) {
          const merged = [...parsed];
          guestItems.forEach(gItem => {
            const existing = merged.find(m => m._id === gItem._id);
            if (existing) {
              existing.quantity += gItem.quantity;
            } else {
              merged.push(gItem);
            }
          });
          setCartItems(merged);
          sessionStorage.removeItem("cart_guest");
          prevUserRef.current = user;
          hasLoaded.current = true;
          return;
        }
      }
    }

    setCartItems(parsed);
    prevUserRef.current = user;
    hasLoaded.current = true;
  }, [user]);

  // SAVE cart when items change
  useEffect(() => {
    // ONLY save if we have finished loading the current user's state
    // and the user hasn't just changed (to avoid saving old cart to new key)
    if (!hasLoaded.current || prevUserRef.current !== user) return;

    const key = getCartKey(user);
    sessionStorage.setItem(key, JSON.stringify(cartItems));
  }, [cartItems, user]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    openCart(); // Auto-open drawer on add
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQty = (id, value) => {
    const qty = Math.max(1, parseInt(value, 10) || 1);
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: qty } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    const key = getCartKey(user);
    sessionStorage.removeItem(key);
  };

  return (
    <CartContext.Provider
      value={{
        cart: cartItems,
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};

