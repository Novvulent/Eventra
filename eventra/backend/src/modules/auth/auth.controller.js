const service = require('./auth.service');

/**
 * Controller de autenticación.
 */

// POST /auth/login
const login = async (req, res, next) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
    }
    const usuario = await service.login({ correo, password });
    res.json(usuario);
  } catch (error) {
    next(error);
  }
};

// POST /auth/register  (cliente o agente)
const register = async (req, res, next) => {
  try {
    const nuevo = await service.register(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    next(error);
  }
};

module.exports = { login, register };
