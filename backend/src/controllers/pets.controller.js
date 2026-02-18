const petsService = require('../services/pets.service');
const likesService = require('../services/likes.service');
const { success, error } = require('../utils/response');

class PetsController {
  async create(req, res, next) {
    try {
      const data = req.body;
      const imageFile = req.file?.filename || null;
      const pet = await petsService.create(req.userId, data.name, data.funFacts, imageFile);
      return success(res, pet, 201);
    } catch (err) {
      next(err);
    }
  }

  async listPublic(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const search = req.query.search || null;

      const result = await petsService.listPublic(page, limit, search);

      if (req.userId) {
        const likedIds = await likesService.getLikedPetIds(req.userId);
        result.data = result.data.map(pet => ({
          ...pet,
          likedByMe: likedIds.includes(pet.id),
        }));
      } else {
        result.data = result.data.map(pet => ({
          ...pet,
          likedByMe: false,
        }));
      }

      return success(res, result);
    } catch (err) {
      next(err);
    }
  }


  async getById(req, res, next) {
    try {
      const pet = await petsService.getById(req.params.id);

      
      if (req.userId) {
        pet.likedByMe = await likesService.hasLiked(req.userId, pet.id);
      } else {
        pet.likedByMe = false;
      }

      return success(res, pet);
    } catch (err) {
      next(err);
    }
  }


  async listMine(req, res, next) {
    try {
      const pets = await petsService.listByOwnerId(req.userId);
      return success(res, pets);
    } catch (err) {
      next(err);
    }
  }


  async update(req, res, next) {
    try {
      const data = req.body;
      const updates = { ...data };
      
      if (req.file?.filename) {
        updates.image = req.file.filename;
      }

      const pet = await petsService.update(req.params.id, req.userId, updates);
      return success(res, pet);
    } catch (err) {
      next(err);
    }
  }


  async delete(req, res, next) {
    try {
      await petsService.delete(req.params.id, req.userId);
      return success(res, { message: 'Mascota eliminada' });
    } catch (err) {
      next(err);
    }
  }


  async toggle(req, res, next) {
    try {
      const pet = await petsService.toggle(req.params.id, req.userId);
      return success(res, pet);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PetsController();
