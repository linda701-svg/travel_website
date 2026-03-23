import React, { createContext, useState, useContext, useEffect } from 'react';

// IMPORTANT: Ensure that upon successful user login/registration,
// you save both the received 'token' and the 'userId' (user's _id)
// to localStorage. Example:
// localStorage.setItem('token', response.token);
// localStorage.setItem('userId', response.data._id);
// This is crucial for authentication and fetching user-specific data.

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [cartError, setCartError] = useState(null);

  // Helper to get authentication headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token'); // Assuming token is stored here
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  // Fetch cart from backend on initial load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoadingCart(true);
        const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
        const response = await fetch('/api/v1/cart', { headers });
        if (response.status === 401) {
          setCartError('Please log in to view your cart.');
          setCartItems([]);
          setLoadingCart(false);
          return;
        }
        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }
        const data = await response.json();
        const fetchedItems = data.data.items.map(item => {
          const isTour = !!item.tourId;
          const resource = item.tourId || item.productId;
          return {
            id: resource._id,
            name: isTour ? resource.title : resource.name,
            imageUrl: isTour ? resource.image : (resource.imageUrl || resource.image),
            price: item.priceAtAdded,
            quantity: item.quantity,
            _id: item._id,
            isTour: isTour
          };
        });
        setCartItems(fetchedItems);
      } catch (err) {
        console.error('Failed to load cart from backend:', err);
        setCartError(err.message);
        setCartItems([]);
      } finally {
        setLoadingCart(false);
      }
    };
    fetchCart();
  }, []);

  const addToCart = async (product, isTour = false) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('Please log in to add items to cart.');
        return;
      }

      const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
      const body = isTour ? { tourId: product.id || product._id, quantity: 1 } : { productId: product.id || product._id, quantity: 1 };

      const response = await fetch('/api/v1/cart', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }
      const data = await response.json();
      const updatedItems = data.data.items.map(item => {
        const itemIsTour = !!item.tourId;
        const resource = item.tourId || item.productId;
        return {
          id: resource._id,
          name: itemIsTour ? resource.title : resource.name,
          imageUrl: itemIsTour ? resource.image : (resource.imageUrl || resource.image),
          price: item.priceAtAdded,
          quantity: item.quantity,
          _id: item._id,
          isTour: itemIsTour
        };
      });
      setCartItems(updatedItems);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setCartError(err.message);
    }
  };

  const removeFromCart = async (itemId) => { // itemId here refers to the tourId initially, but for backend needs cartItem._id
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return; // Or handle as error

      // Find the _id of the cart item to remove from the local state first
      const cartItemToRemove = cartItems.find(item => item.id === itemId);
      if (!cartItemToRemove || !cartItemToRemove._id) {
        console.error('Cart item to remove not found or has no _id:', itemId);
        return;
      }

      const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
      const response = await fetch(`/api/v1/cart/${cartItemToRemove._id}`, { // Use the _id of the cart item
        method: 'DELETE',
        headers: headers,
      });
      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }
      const data = await response.json();
      const updatedItems = data.data.items.map(item => {
        const itemIsTour = !!item.tourId;
        const resource = item.tourId || item.productId;
        return {
          id: resource._id,
          name: itemIsTour ? resource.title : resource.name,
          imageUrl: itemIsTour ? resource.image : (resource.imageUrl || resource.image),
          price: item.priceAtAdded,
          quantity: item.quantity,
          _id: item._id,
          isTour: itemIsTour
        };
      });
      setCartItems(updatedItems);
    } catch (err) {
      console.error('Error removing from cart:', err);
      setCartError(err.message);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => { // itemId refers to tourId initially
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const cartItemToUpdate = cartItems.find(item => item.id === itemId);
      if (!cartItemToUpdate || !cartItemToUpdate._id) {
        console.error('Cart item to update not found or has no _id:', itemId);
        return;
      }

      const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
      const response = await fetch(`/api/v1/cart/${cartItemToUpdate._id}`, { // Use the _id of the cart item
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (!response.ok) {
        throw new Error('Failed to update item quantity');
      }
      const data = await response.json();
      const updatedItems = data.data.items.map(item => {
        const itemIsTour = !!item.tourId;
        const resource = item.tourId || item.productId;
        return {
          id: resource._id,
          name: itemIsTour ? resource.title : resource.name,
          imageUrl: itemIsTour ? resource.image : (resource.imageUrl || resource.image),
          price: item.priceAtAdded,
          quantity: item.quantity,
          _id: item._id,
          isTour: itemIsTour
        };
      });
      setCartItems(updatedItems);
    } catch (err) {
      console.error('Error updating quantity:', err);
      setCartError(err.message);
    }
  };

  const clearCart = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
      const response = await fetch('/api/v1/cart', {
        method: 'DELETE',
        headers: headers,
      });
      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }
      setCartItems([]); // Clear local state after successful backend clear
    } catch (err) {
      console.error('Error clearing cart:', err);
      setCartError(err.message);
    }
  };


  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, getCartTotal, updateQuantity, loadingCart, cartError }}>
      {children}
    </CartContext.Provider>
  );
};
