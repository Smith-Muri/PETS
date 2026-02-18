/**
 * Auth Controller
 * Maneja requests de autenticación
 */

const authService = require('../services/auth.service');
const { success, error } = require('../utils/response');

class AuthController {
  /**
   * POST /auth/register
   */
  async register(req, res, next) {
    try {
      const data = req.body;
      const result = await authService.register(data.email, data.password, data.name);
      
      return success(res, result, 201);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /auth/login
   */
  async login(req, res, next) {
    try {
      const data = req.body;
      const result = await authService.login(data.email, data.password);
      
      return success(res, result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /auth/me
   * Obtener datos del usuario logueado (requiere auth middleware)
   */
  async getMe(req, res, next) {
    try {
      const user = await authService.getUser(req.userId);
      return success(res, user);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();

