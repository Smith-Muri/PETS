const express = require('express');
const likesController = require('../controllers/likes.controller');
const { validateBody } = require('../middleware/validate.middleware');
const { createLikeSchema } = require('../schemas/auth.schema');
const authMiddleware = require('../middleware/auth.middleware');
const optionalAuth = require('../middleware/optionalAuth.middleware');

const router = express.Router();

// Allow POST/DELETE to accept either authenticated users or anonymous via X-Anonymous-Id header.
router.post('/', optionalAuth, validateBody(createLikeSchema), likesController.like.bind(likesController));
router.delete('/:petId', optionalAuth, likesController.unlike.bind(likesController));

// Protected route: only authenticated users can fetch their likes
router.get('/my-likes', authMiddleware, likesController.getMyLikes.bind(likesController));

module.exports = router;
