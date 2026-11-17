const service = require('./agente.service');

/**
 * Controller de Agente.
 * Recibe la petición HTTP, llama al service y arma la respuesta.
 * Los errores se envían a next() para que los procese el errorHandler
 * (traduce errores de PostgreSQL a 400/409 y los httpError a su status).
 */

// GET /agentes  (admite filtros por query string, p. ej. ?estado=...)
const getAll = async (req, res, next) => {
  try {
    const registros = await service.getAll(req.query);
    res.json(registros);
  } catch (error) {
    next(error);
  }
};

// GET /agentes/:id
const getById = async (req, res, next) => {
  try {
    const registro = await service.getById(String(req.params.id));
    if (!registro) return res.status(404).json({ message: 'Agente no encontrado' });
    res.json(registro);
  } catch (error) {
    next(error);
  }
};

// POST /agentes
const create = async (req, res, next) => {
  try {
    const nuevo = await service.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    next(error);
  }
};

// PUT /agentes/:id
const update = async (req, res, next) => {
  try {
    const actualizado = await service.update(String(req.params.id), req.body);
    if (!actualizado) return res.status(404).json({ message: 'Agente no encontrado' });
    res.json(actualizado);
  } catch (error) {
    next(error);
  }
};

// DELETE /agentes/:id
const remove = async (req, res, next) => {
  try {
    const eliminado = await service.remove(String(req.params.id));
    if (!eliminado) return res.status(404).json({ message: 'Agente no encontrado' });
    res.json({ message: 'Agente eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
