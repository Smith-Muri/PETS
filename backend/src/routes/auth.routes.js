/**
 * Auth Routes
 * POST   /auth/register  - Registrar usuario
 * POST   /auth/login     - Login usuario
 * GET    /auth/me        - Obtener usuario logueado
 */

const express = require('express');
const authController = require('../controllers/auth.controller');
const { validateBody } = require('../middleware/validate.middleware');
const { registerSchema, loginSchema } = require('../schemas/auth.schema');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', validateBody(registerSchema), authController.register.bind(authController));
router.post('/login', validateBody(loginSchema), authController.login.bind(authController));
router.get('/me', authMiddleware, authController.getMe.bind(authController));

module.exports = router;
