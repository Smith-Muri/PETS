const { run, get, all } = require('../db/database');

class LikesRepository {

  /**
  * Likes repository methods
  * create: may throw on UNIQUE constraint violation
  */
  async create(id, userId, petId) {
    try {
      await run(
        'INSERT INTO likes (id, userId, petId) VALUES (?, ?, ?)',
        [id, userId, petId]
      );
      return { id, userId, petId };
    } catch (error) {
  
      if (error.code === 'SQLITE_CONSTRAINT' && error.message.includes('UNIQUE')) {
        const err = new Error('Ya has likeado esta mascota');
        err.statusCode = 409;
        throw err;
      }
      throw error;
    }
  }

  async exists(userId, petId) {
    const result = await get(
      'SELECT id FROM likes WHERE userId = ? AND petId = ?',
      [userId, petId]
    );
    return !!result;
  }

  async getById(id) {
    return get('SELECT * FROM likes WHERE id = ?', [id]);
  }

  async getByUserId(userId) {
    return all('SELECT petId FROM likes WHERE userId = ?', [userId]);
  }


  async getCountByPetId(petId) {
    const result = await get(
      'SELECT COUNT(*) as count FROM likes WHERE petId = ?',
      [petId]
    );
    return result?.count || 0;
  }


  async getByPetId(petId) {
    return all('SELECT userId FROM likes WHERE petId = ?', [petId]);
  }


  async delete(id) {
    await run('DELETE FROM likes WHERE id = ?', [id]);
  }


  async deleteByUserAndPet(userId, petId) {
    await run(
      'DELETE FROM likes WHERE userId = ? AND petId = ?',
      [userId, petId]
    );
  }
}

module.exports = new LikesRepository();
