const crypto = require('crypto');
const likesRepository = require('../repositories/likes.repository');
const petsService = require('../services/pets.service');

class LikesService {

  /**
  * Dar like a mascota
  * @throws Error 409 si ya existe like
  */
  async like(userId, petId) {
   
    await petsService.getById(petId);

    const exists = await likesRepository.exists(userId, petId);
    if (exists) {
      const err = new Error('Ya has likeado esta mascota');
      err.statusCode = 409;
      throw err;
    }

    const likeId = crypto.randomUUID();
    return likesRepository.create(likeId, userId, petId);
  }

  async unlike(userId, petId) {
    const exists = await likesRepository.exists(userId, petId);
    if (!exists) {
      const err = new Error('No has likeado esta mascota');
      err.statusCode = 404;
      throw err;
    }

    await likesRepository.deleteByUserAndPet(userId, petId);
  }

  async getLikedPetIds(userId) {
    const results = await likesRepository.getByUserId(userId);
    return results.map(r => r.petId);
  }

  async hasLiked(userId, petId) {
    return likesRepository.exists(userId, petId);
  }

  async getLikeCount(petId) {
    return likesRepository.getCountByPetId(petId);
  }
}

module.exports = new LikesService();
