const service = require('./persona.service');

/**
 * Controller de Persona.
 * Recibe la petición HTTP, llama al service y arma la respuesta.
 * Los errores se envían a next() para que los procese el errorHandler
 * (traduce errores de PostgreSQL a 400/409 y los httpError a su status).
 */

// GET /personas  (admite filtros por query string, p. ej. ?estado=...)
const getAll = async (req, res, next) => {
  try {
    const registros = await service.getAll(req.query);
    res.json(registros);
  } catch (error) {
    next(error);
  }
};

// GET /personas/:id
const getById = async (req, res, next) => {
  try {
    const registro = await service.getById(String(req.params.id));
    if (!registro) return res.status(404).json({ message: 'Persona no encontrada' });
    res.json(registro);
  } catch (error) {
    next(error);
  }
};

// POST /personas
const create = async (req, res, next) => {
  try {
    const nuevo = await service.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    next(error);
  }
};

// PUT /personas/:id
const update = async (req, res, next) => {
  try {
    const actualizado = await service.update(String(req.params.id), req.body);
    if (!actualizado) return res.status(404).json({ message: 'Persona no encontrada' });
    res.json(actualizado);
  } catch (error) {
    next(error);
  }
};

// DELETE /personas/:id
const remove = async (req, res, next) => {
  try {
    const eliminado = await service.remove(String(req.params.id));
    if (!eliminado) return res.status(404).json({ message: 'Persona no encontrada' });
    res.json({ message: 'Persona eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
