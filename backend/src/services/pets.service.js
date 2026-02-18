const crypto = require('crypto');
const petsRepository = require('../repositories/pets.repository');

class PetsService {
  async _getAndAssertOwner(petId, ownerId) {
    const pet = await petsRepository.getById(petId);
    if (!pet) {
      const err = new Error('Mascota no encontrada');
      err.statusCode = 404;
      throw err;
    }
    if (pet.ownerId !== ownerId) {
      const err = new Error('No tienes permisos para editar esta mascota');
      err.statusCode = 403;
      throw err;
    }
    return pet;
  }

  async create(ownerId, name, funFacts, image = null) {
    const petId = crypto.randomUUID();
    return petsRepository.create(petId, ownerId, name, funFacts, image);
  }


  async getById(petId) {
    const pet = await petsRepository.getById(petId);
    if (!pet) {
      const err = new Error('Mascota no encontrada');
      err.statusCode = 404;
      throw err;
    }
    return pet;
  }


  async listPublic(page = 1, limit = 12, search = null) {
    const offset = (page - 1) * limit;

    let pets, totalCount;

    if (search && search.trim()) {
      pets = await petsRepository.searchPublic(search.trim(), limit, offset);
      const countResults = await petsRepository.searchPublic(search.trim(), 999999, 0);
      totalCount = countResults.length;
    } else {
      pets = await petsRepository.getPublic(limit, offset);
      const countResult = await petsRepository.getPublicCount();
      totalCount = countResult.count;
    }

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: pets,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        hasMore: page < totalPages,
      },
    };
  }
  async listByOwnerId(ownerId) {
    return petsRepository.getByOwnerId(ownerId);
  }
  async update(petId, ownerId, updates) {
    await this._getAndAssertOwner(petId, ownerId);
    return petsRepository.update(petId, updates);
  }


  async toggle(petId, ownerId) {
    await this._getAndAssertOwner(petId, ownerId);
    return petsRepository.toggle(petId);
  }

  async delete(petId, ownerId) {
    await this._getAndAssertOwner(petId, ownerId);
    await petsRepository.delete(petId);
  }
}

module.exports = new PetsService();
