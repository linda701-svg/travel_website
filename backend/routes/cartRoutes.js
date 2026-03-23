const express = require('express');
const {
    getCart,
    addItemToCart,
    updateCartItemQuantity,
    removeItemFromCart,
    clearCart
} = require('../controllers/cartController');

const router = express.Router();

// You would typically have authentication middleware here, e.g., protect
const { protect } = require('../middleware/auth');

// Apply protection to all cart routes for authenticated users
router.use(protect); // Uncomment this in a real app

router.route('/')
    .get(getCart) // Get user's cart
    .post(addItemToCart) // Add item to cart
    .delete(clearCart); // Clear user's cart

router.route('/:itemId')
    .put(updateCartItemQuantity) // Update quantity of a specific item
    .delete(removeItemFromCart); // Remove a specific item from cart

module.exports = router;
