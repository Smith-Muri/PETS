const express = require('express');
const likesController = require('../controllers/likes.controller');
const { validateBody } = require('../middleware/validate.middleware');
const { createLikeSchema } = require('../schemas/auth.schema');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();


router.use(authMiddleware);

router.post('/', validateBody(createLikeSchema), likesController.like.bind(likesController));
router.delete('/:petId', likesController.unlike.bind(likesController));
router.get('/my-likes', likesController.getMyLikes.bind(likesController));

module.exports = router;
