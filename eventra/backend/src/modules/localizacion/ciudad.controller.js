const service = require('./ciudad.service');

/**
 * Controller de Ciudad.
 * Recibe la petición HTTP, llama al service y arma la respuesta.
 * Los errores se envían a next() para que los procese el errorHandler
 * (traduce errores de PostgreSQL a 400/409 y los httpError a su status).
 */

// GET /ciudades  (admite filtros por query string, p. ej. ?estado=...)
const getAll = async (req, res, next) => {
  try {
    const registros = await service.getAll(req.query);
    res.json(registros);
  } catch (error) {
    next(error);
  }
};

// GET /ciudades/:id
const getById = async (req, res, next) => {
  try {
    const registro = await service.getById(String(req.params.id));
    if (!registro) return res.status(404).json({ message: 'Ciudad no encontrada' });
    res.json(registro);
  } catch (error) {
    next(error);
  }
};

// POST /ciudades
const create = async (req, res, next) => {
  try {
    const nuevo = await service.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    next(error);
  }
};

// PUT /ciudades/:id
const update = async (req, res, next) => {
  try {
    const actualizado = await service.update(String(req.params.id), req.body);
    if (!actualizado) return res.status(404).json({ message: 'Ciudad no encontrada' });
    res.json(actualizado);
  } catch (error) {
    next(error);
  }
};

// DELETE /ciudades/:id
const remove = async (req, res, next) => {
  try {
    const eliminado = await service.remove(String(req.params.id));
    if (!eliminado) return res.status(404).json({ message: 'Ciudad no encontrada' });
    res.json({ message: 'Ciudad eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
