const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getStats,
} = require('../controllers/adminController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// All admin routes require auth and admin role
router.use(auth, adminOnly);

// Admin routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/stats', getStats);

module.exports = router;
