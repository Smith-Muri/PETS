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
      const anonId = req.headers['x-anonymous-id'];
      if (req.userId) {
        const like = await likesService.like(req.userId, data.petId);
        return success(res, like, 201);
      }
      if (anonId) {
        const like = await likesService.likeAnon(anonId, data.petId);
        return success(res, like, 201);
      }
      const err = new Error('Authentication required or provide X-Anonymous-Id');
      err.statusCode = 401;
      throw err;
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
      const anonId = req.headers['x-anonymous-id'];
      if (req.userId) {
        await likesService.unlike(req.userId, req.params.petId);
        return success(res, { message: 'Like removido' });
      }
      if (anonId) {
        await likesService.unlikeAnon(anonId, req.params.petId);
        return success(res, { message: 'Like removido (anónimo)' });
      }
      const err = new Error('Authentication required or provide X-Anonymous-Id');
      err.statusCode = 401;
      throw err;
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

