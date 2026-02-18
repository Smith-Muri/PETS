/**
 * Likes Controller
 * Maneja requests de likes
 */

const likesService = require('../services/likes.service');
const { success, error } = require('../utils/response');

class LikesController {
  /**
   * POST /likes
   * Dar like a mascota (usuario logueado)
   * Body: { petId: string }
   * @returns 409 si ya existe like (UNIQUE violation)
   */
  async like(req, res, next) {
    try {
      const data = req.body;
      const like = await likesService.like(req.userId, data.petId);
      return success(res, like, 201);
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /likes/:petId
   * Remover like a mascota
   */
  async unlike(req, res, next) {
    try {
      await likesService.unlike(req.userId, req.params.petId);
      return success(res, { message: 'Like removido' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /likes/my-likes
   * Obtener lista de petIds que usuario likeó
   */
  async getMyLikes(req, res, next) {
    try {
      const likedPetIds = await likesService.getLikedPetIds(req.userId);
      return success(res, { likedPetIds });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new LikesController();

