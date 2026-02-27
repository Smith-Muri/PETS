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
    if (typeof image === 'undefined') image = null;
    // If enabled is provided as 1/0/true/false, handle it; otherwise rely on DB default
    // Backwards-compatible signature: create(id, ownerId, name, funFacts, image, enabled)
    const args = Array.from(arguments);
    const providedEnabled = args.length >= 6 ? args[5] : undefined;

    if (providedEnabled === undefined) {
      await run(
        'INSERT INTO pets (id, ownerId, name, funFacts, image) VALUES (?, ?, ?, ?, ?)',
        [id, ownerId, name, funFacts, image]
      );
    } else {
      const enabledValue = (providedEnabled === '1' || providedEnabled === 1 || providedEnabled === true) ? 1 : 0;
      await run(
        'INSERT INTO pets (id, ownerId, name, funFacts, image, enabled) VALUES (?, ?, ?, ?, ?, ?)',
        [id, ownerId, name, funFacts, image, enabledValue]
      );
    }
    return this.getById(id);
  }

  /**
   * Obtener mascota por ID con conteo de likes
   */
  async getById(id) {
    return get(
      `SELECT p.*, 
         COALESCE(lc.count, 0) + COALESCE(ac.count, 0) as likeCount
       FROM pets p
       LEFT JOIN (
         SELECT petId, COUNT(*) as count FROM likes GROUP BY petId
       ) lc ON p.id = lc.petId
       LEFT JOIN (
         SELECT petId, COUNT(*) as count FROM anon_likes GROUP BY petId
       ) ac ON p.id = ac.petId
       WHERE p.id = ?`,
      [id]
    );
  }

  /**
   * Obtener todas las mascotas públicas (enabled=1) con paginación
   */
  async getPublic(limit = 12, offset = 0) {
    return all(
      `SELECT p.*, COALESCE(lc.count, 0) + COALESCE(ac.count, 0) as likeCount
       FROM pets p
       LEFT JOIN (
         SELECT petId, COUNT(*) as count FROM likes GROUP BY petId
       ) lc ON p.id = lc.petId
       LEFT JOIN (
         SELECT petId, COUNT(*) as count FROM anon_likes GROUP BY petId
       ) ac ON p.id = ac.petId
       WHERE p.enabled = 1
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
      `SELECT p.*, COALESCE(lc.count, 0) + COALESCE(ac.count, 0) as likeCount
       FROM pets p
       LEFT JOIN (
         SELECT petId, COUNT(*) as count FROM likes GROUP BY petId
       ) lc ON p.id = lc.petId
       LEFT JOIN (
         SELECT petId, COUNT(*) as count FROM anon_likes GROUP BY petId
       ) ac ON p.id = ac.petId
       WHERE p.ownerId = ?
       ORDER BY p.createdAt DESC`,
      [ownerId]
    );
  }

  /**
   * Buscar mascotas públicas por nombre
   */
  async searchPublic(searchTerm, limit = 12, offset = 0) {
    return all(
      `SELECT p.*, COALESCE(lc.count, 0) + COALESCE(ac.count, 0) as likeCount
       FROM pets p
       LEFT JOIN (
         SELECT petId, COUNT(*) as count FROM likes GROUP BY petId
       ) lc ON p.id = lc.petId
       LEFT JOIN (
         SELECT petId, COUNT(*) as count FROM anon_likes GROUP BY petId
       ) ac ON p.id = ac.petId
       WHERE p.enabled = 1 AND LOWER(p.name) LIKE LOWER(?)
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
