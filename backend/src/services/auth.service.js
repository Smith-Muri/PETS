const crypto = require('crypto');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');
const usersRepository = require('../repositories/users.repository');

class AuthService {
 
  async register(email, password, name) {

    const existing = await usersRepository.findByEmail(email);
    if (existing) {
      const err = new Error('Email ya registrado');
      err.statusCode = 409;
      throw err;
    }

 
    const passwordHash = await hashPassword(password);


    const userId = crypto.randomUUID();
    const user = await usersRepository.create(userId, email, name, passwordHash);


    const token = generateToken({ userId: user.id, email: user.email });

    return { user, token };
  }


  async login(email, password) {

    const user = await usersRepository.findByEmail(email);
    if (!user) {
      const err = new Error('Email o contraseña incorrectos');
      err.statusCode = 401;
      throw err;
    }


    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      const err = new Error('Email o contraseña incorrectos');
      err.statusCode = 401;
      throw err;
    }


    const token = generateToken({ userId: user.id, email: user.email });

    return { user, token };
  }


  async getUser(userId) {
    const user = await usersRepository.getById(userId);
    if (!user) {
      const err = new Error('Usuario no encontrado');
      err.statusCode = 404;
      throw err;
    }
    return user;
  }
}

module.exports = new AuthService();
