const { run, get, all } = require('../db/database');

class UsersRepository {

  async create(id, email, name, passwordHash) {
    await run(
      'INSERT INTO users (id, email, name, passwordHash) VALUES (?, ?, ?, ?)',
      [id, email, name, passwordHash]
    );
    return this.getById(id);
  }

  async findByEmail(email) {
    return get('SELECT * FROM users WHERE email = ?', [email]);
  }


  async getById(id) {
    return get('SELECT id, email, name, createdAt FROM users WHERE id = ?', [id]);
  }

  /**
   * Actualizar usuario
   */
  async update(id, updates) {
    const fields = [];
    const values = [];
    
    if (updates.name) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.email) {
      fields.push('email = ?');
      values.push(updates.email);
    }
    
    fields.push('updatedAt = ?');
    values.push(Math.floor(Date.now() / 1000));
    values.push(id);

    if (fields.length === 1) return; // Solo updatedAt, skip
    
    await run(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return this.getById(id);
  }

  /**
   * Eliminar usuario (cascada elimina pets y likes)
   */
  async delete(id) {
    await run('DELETE FROM users WHERE id = ?', [id]);
  }
}

module.exports = new UsersRepository();
