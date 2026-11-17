const service = require('./reportes.service');

/**
 * Controller de reportes (solo lectura).
 * Los reportes mensuales reciben ?anio=AAAA (por defecto 2026).
 */

const ANIO_POR_DEFECTO = 2026;
const getAnio = (req) => Number(req.query.anio) || ANIO_POR_DEFECTO;

// Reporte: general
const general = async (req, res, next) => {
  try {
    res.json(await service.general(getAnio(req)));
  } catch (error) {
    next(error);
  }
};

// Reporte: promedio de ingresos por agente
const promedioIngresosAgente = async (req, res, next) => {
  try {
    res.json(await service.promedioIngresosAgente());
  } catch (error) {
    next(error);
  }
};

// Reporte: promedio de ingresos por cliente
const promedioIngresosCliente = async (req, res, next) => {
  try {
    res.json(await service.promedioIngresosCliente());
  } catch (error) {
    next(error);
  }
};

// Reporte: ingresos mensuales
const ingresosMensuales = async (req, res, next) => {
  try {
    res.json(await service.ingresosMensuales(getAnio(req)));
  } catch (error) {
    next(error);
  }
};

// Reporte: reservas por evento y mes
const reservasEventoMes = async (req, res, next) => {
  try {
    res.json(await service.reservasEventoMes(getAnio(req)));
  } catch (error) {
    next(error);
  }
};

// Reporte: eventos por agente y ciudad
const eventosAgenteCiudad = async (req, res, next) => {
  try {
    res.json(await service.eventosAgenteCiudad());
  } catch (error) {
    next(error);
  }
};

// Reporte: eventos por ubicación
const eventosUbicacion = async (req, res, next) => {
  try {
    res.json(await service.eventosUbicacion());
  } catch (error) {
    next(error);
  }
};

// Reporte: historial de reservas por cliente
const historialReservasCliente = async (req, res, next) => {
  try {
    res.json(await service.historialReservasCliente());
  } catch (error) {
    next(error);
  }
};

// Reporte: reservas canceladas
const reservasCanceladas = async (req, res, next) => {
  try {
    res.json(await service.reservasCanceladas());
  } catch (error) {
    next(error);
  }
};

// Reporte: eventos cancelados
const eventosCancelados = async (req, res, next) => {
  try {
    res.json(await service.eventosCancelados());
  } catch (error) {
    next(error);
  }
};

module.exports = {
  general,
  promedioIngresosAgente,
  promedioIngresosCliente,
  ingresosMensuales,
  reservasEventoMes,
  eventosAgenteCiudad,
  eventosUbicacion,
  historialReservasCliente,
  reservasCanceladas,
  eventosCancelados
};
