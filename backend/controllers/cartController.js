const Cart = require('../models/Cart');
const Tour = require('../models/Tour');

// Helper function to get user ID from request (assuming auth middleware)
const getUserId = (req) => {
    return req.user ? req.user.id : null;
};

// @desc    Get user's cart
// @route   GET /api/v1/cart
// @access  Private
exports.getCart = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ success: false, error: 'User not authenticated.' });
        }

        let cart = await Cart.findOne({ userId }).populate('items.tourId');

        if (!cart) {
            cart = await Cart.create({ userId, items: [] });
        }

        res.status(200).json({
            success: true,
            data: cart,
        });
    } catch (err) {
        console.error('Error getting cart:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Add item to cart or update quantity
// @route   POST /api/v1/cart
// @access  Private
exports.addItemToCart = async (req, res, next) => {
    try {
        const { tourId, quantity } = req.body;
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({ success: false, error: 'User not authenticated.' });
        }
        if (!tourId || !quantity || quantity < 1) {
            return res.status(400).json({ success: false, error: 'Please provide valid tourId and quantity.' });
        }

        const tour = await Tour.findById(tourId);
        if (!tour) return res.status(404).json({ success: false, error: 'Tour not found.' });
        const itemPrice = tour.price;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = await Cart.create({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item =>
            item.tourId?.toString() === tourId
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
            cart.items[itemIndex].priceAtAdded = itemPrice;
        } else {
            cart.items.push({
                tourId,
                quantity,
                priceAtAdded: itemPrice,
            });
        }

        await cart.save();
        await cart.populate('items.tourId');

        res.status(200).json({
            success: true,
            data: cart,
        });
    } catch (err) {
        console.error('Error adding item to cart:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update item quantity in cart
// @route   PUT /api/v1/cart/:itemId
// @access  Private
exports.updateCartItemQuantity = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({ success: false, error: 'User not authenticated.' });
        }
        if (!quantity || quantity < 1) {
            return res.status(400).json({ success: false, error: 'Please provide a valid quantity.' });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, error: 'Cart not found.' });
        }

        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
            await cart.populate('items.tourId');
            res.status(200).json({ success: true, data: cart });
        } else {
            return res.status(404).json({ success: false, error: 'Item not found in cart.' });
        }
    } catch (err) {
        console.error('Error updating cart item quantity:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/:itemId
// @access  Private
exports.removeItemFromCart = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({ success: false, error: 'User not authenticated.' });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, error: 'Cart not found.' });
        }

        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => item._id.toString() !== itemId);

        if (cart.items.length === initialLength) {
            return res.status(404).json({ success: false, error: 'Item not found in cart.' });
        }

        await cart.save();
        await cart.populate('items.tourId');
        res.status(200).json({ success: true, data: cart });
    } catch (err) {
        console.error('Error removing item from cart:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Clear user's cart
// @route   DELETE /api/v1/cart
// @access  Private
exports.clearCart = async (req, res, next) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({ success: false, error: 'User not authenticated.' });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, error: 'Cart not found.' });
        }

        cart.items = [];
        await cart.save();
        await cart.populate('items.tourId');
        res.status(200).json({ success: true, data: cart });
    } catch (err) {
        console.error('Error clearing cart:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
