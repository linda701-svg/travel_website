const express = require('express');
const { getUsers, deleteUser, toggleBlockUser } = require('../controllers/userController');

const router = express.Router();

// Assuming admin protection middleware would be added here
// const { protect, authorize } = require('../middleware/auth');
// router.route('/').get(protect, authorize('admin'), getUsers);

router.route('/').get(getUsers); // For now, public for testing
router.route('/:id').delete(deleteUser); // Route for deleting a user
router.route('/:id/block').put(toggleBlockUser); // Route for blocking/unblocking a user

module.exports = router;
