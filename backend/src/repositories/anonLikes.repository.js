const { run, get, all } = require('../db/database');

class AnonLikesRepository {
  async create(id, anonId, petId) {
    try {
      await run(
        'INSERT INTO anon_likes (id, anonId, petId) VALUES (?, ?, ?)',
        [id, anonId, petId]
      );
      return { id, anonId, petId };
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT' && error.message.includes('UNIQUE')) {
        const err = new Error('Ya has likeado esta mascota (anónimo)');
        err.statusCode = 409;
        throw err;
      }
      throw error;
    }
  }

  async exists(anonId, petId) {
    const result = await get(
      'SELECT id FROM anon_likes WHERE anonId = ? AND petId = ?',
      [anonId, petId]
    );
    return !!result;
  }

  async deleteByAnonAndPet(anonId, petId) {
    await run('DELETE FROM anon_likes WHERE anonId = ? AND petId = ?', [anonId, petId]);
  }

  async getByAnonId(anonId) {
    return all('SELECT petId FROM anon_likes WHERE anonId = ?', [anonId]);
  }

  async getCountByPetId(petId) {
    const result = await get('SELECT COUNT(*) as count FROM anon_likes WHERE petId = ?', [petId]);
    return result?.count || 0;
  }

  async getByPetId(petId) {
    return all('SELECT anonId FROM anon_likes WHERE petId = ?', [petId]);
  }
}

module.exports = new AnonLikesRepository();
