/**
 * Pets Repository
 * Todas las operaciones BD para mascotas
 */

const { run, get, all } = require('../db/database');

class PetsRepository {
  /**
   * Crear mascota
   */
  async create(id, ownerId, name, funFacts, image = null) {
    await run(
      'INSERT INTO pets (id, ownerId, name, funFacts, image) VALUES (?, ?, ?, ?, ?)',
      [id, ownerId, name, funFacts, image]
    );
    return this.getById(id);
  }

  /**
   * Obtener mascota por ID con conteo de likes
   */
  async getById(id) {
    return get(
      `SELECT p.*, COUNT(l.id) as likeCount
       FROM pets p
       LEFT JOIN likes l ON p.id = l.petId
       WHERE p.id = ?
       GROUP BY p.id`,
      [id]
    );
  }

  /**
   * Obtener todas las mascotas públicas (enabled=1) con paginación
   */
  async getPublic(limit = 12, offset = 0) {
    return all(
      `SELECT p.*, COUNT(l.id) as likeCount
       FROM pets p
       LEFT JOIN likes l ON p.id = l.petId
       WHERE p.enabled = 1
       GROUP BY p.id
       ORDER BY p.createdAt DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
  }

  /**
   * Total de mascotas públicas (para paginación)
   */
  async getPublicCount() {
    const result = await get('SELECT COUNT(*) as count FROM pets WHERE enabled = 1');
    return result;
  }

  /**
   * Obtener mascotas de un usuario específico
   */
  async getByOwnerId(ownerId) {
    return all(
      `SELECT p.*, COUNT(l.id) as likeCount
       FROM pets p
       LEFT JOIN likes l ON p.id = l.petId
       WHERE p.ownerId = ?
       GROUP BY p.id
       ORDER BY p.createdAt DESC`,
      [ownerId]
    );
  }

  /**
   * Buscar mascotas públicas por nombre
   */
  async searchPublic(searchTerm, limit = 12, offset = 0) {
    return all(
      `SELECT p.*, COUNT(l.id) as likeCount
       FROM pets p
       LEFT JOIN likes l ON p.id = l.petId
       WHERE p.enabled = 1 AND LOWER(p.name) LIKE LOWER(?)
       GROUP BY p.id
       ORDER BY p.createdAt DESC
       LIMIT ? OFFSET ?`,
      [`%${searchTerm}%`, limit, offset]
    );
  }

  /**
   * Actualizar mascota
   */
  async update(id, updates) {
    const fields = [];
    const values = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.funFacts !== undefined) {
      fields.push('funFacts = ?');
      values.push(updates.funFacts);
    }
    if (updates.image !== undefined) {
      fields.push('image = ?');
      values.push(updates.image);
    }
    if (updates.enabled !== undefined) {
      fields.push('enabled = ?');
      values.push(updates.enabled ? 1 : 0);
    }

    if (fields.length === 0) return this.getById(id);

    fields.push('updatedAt = ?');
    values.push(Math.floor(Date.now() / 1000));
    values.push(id);

    await run(
      `UPDATE pets SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.getById(id);
  }

  /**
   * Toggle enabled/disabled
   */
  async toggle(id) {
    const pet = await get('SELECT enabled FROM pets WHERE id = ?', [id]);
    if (!pet) return null;

    const newEnabled = pet.enabled === 1 ? 0 : 1;
    await run('UPDATE pets SET enabled = ?, updatedAt = ? WHERE id = ?', [
      newEnabled,
      Math.floor(Date.now() / 1000),
      id,
    ]);

    return this.getById(id);
  }

  /**
   * Eliminar mascota
   */
  async delete(id) {
    await run('DELETE FROM pets WHERE id = ?', [id]);
  }

  /**
   * Verificar que mascota pertenece a usuario
   */
  async isOwner(petId, userId) {
    const pet = await get('SELECT ownerId FROM pets WHERE id = ?', [petId]);
    return pet && pet.ownerId === userId;
  }
}

module.exports = new PetsRepository();
