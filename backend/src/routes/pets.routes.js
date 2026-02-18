const express = require('express');
const multer = require('multer');
const path = require('path');
const config = require('../config/env');
const petsController = require('../controllers/pets.controller');
const { validateBody } = require('../middleware/validate.middleware');
const { createPetSchema, updatePetSchema } = require('../schemas/auth.schema');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(config.UPLOAD_DIR, 'pets'));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: config.MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'));
    }
  },
});

// Public routes
router.get('/', petsController.listPublic.bind(petsController));
router.get('/:id', petsController.getById.bind(petsController));

// Private routes (require auth)
router.get('/my/list', authMiddleware, petsController.listMine.bind(petsController));
router.post('/', authMiddleware, upload.single('image'), validateBody(createPetSchema), petsController.create.bind(petsController));
router.put('/:id', authMiddleware, upload.single('image'), validateBody(updatePetSchema), petsController.update.bind(petsController));
router.delete('/:id', authMiddleware, petsController.delete.bind(petsController));
router.patch('/:id/toggle', authMiddleware, petsController.toggle.bind(petsController));

module.exports = router;
