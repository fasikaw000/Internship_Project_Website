import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const hasLoaded = useRef(false);

  // Determine the storage key based on user ID
  const getCartKey = () => (user ? `cart_${user.id}` : "cart_guest");

  // LOAD cart when user changes
  useEffect(() => {
    const key = getCartKey();
    const saved = sessionStorage.getItem(key);
    const parsed = saved ? JSON.parse(saved) : [];

    // If we just logged in, merge guest items into user cart
    if (user && !hasLoaded.current) {
      const guestSaved = sessionStorage.getItem("cart_guest");
      if (guestSaved) {
        const guestItems = JSON.parse(guestSaved);
        if (guestItems.length > 0) {
          // Merge logic: combine and update quantites for duplicates
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
          sessionStorage.removeItem("cart_guest"); // Clear guest cart after migration
          hasLoaded.current = true;
          return;
        }
      }
    }

    setCartItems(parsed);
    hasLoaded.current = true;
  }, [user]);

  // SAVE cart when items change
  useEffect(() => {
    if (!hasLoaded.current) return;
    const key = getCartKey();
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
    sessionStorage.removeItem(getCartKey());
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};

