// src/utils/timeCalculations.js

import { utcToZonedTime, format } from 'date-fns-tz';
import {
  addMinutes,
  subMinutes,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  getHours,
  getDay,
  addDays,
} from 'date-fns';

/**
 * Definición del Horario Hábil: 8 a.m. a 5 p.m., de lunes a viernes (sin contar festivos)
 */
const businessStartHour = 8;
const businessEndHour = 17; // 5 p.m.

/**
 * Lista de días festivos (actualiza con las fechas correctas)
 */
const holidays = [
  '2024-11-04', // 4 de noviembre de 2024
  '2024-11-11', // 11 de noviembre de 2024
  '2024-12-25', // 25 de diciembre de 2024
  '2025-01-01', // 1 de Enero de 2025
  '2025-01-06', // 06 de Enero de 2025
  '2025-03-24', // 24 de Marzo de 2025
  '2025-04-17', // 17 de Abril de 2025
  '2025-04-18', // 28 de Abril de 2025
  '2025-06-23', // 23 de Junio de 2025
  '2025-06-30', // 23 de Junio de 2025
  '2025-08-07', // 7 de Agosto de 2025
  '2025-08-18', // 18 de Agosto de 2025
  '2025-10-13', // 13 de Octubre de 2025
  '2025-11-03', // 3 de noviembre de 2025
  '2025-11-17', // 17 de noviembre de 2025
  '2025-12-8', // 8 de diciembre de 2024
  '2025-12-25', // 25 de diciembre de 2024
  '2026-01-01', // 1 de Enero de 2026
  '2026-01-12', // 12 de Enero de 2026
  // Añade más fechas según corresponda
];

/**
 * Función para verificar si una fecha es festivo
 * @param {Date} date - La fecha a verificar
 * @param {string} timeZone - La zona horaria para formatear la fecha
 * @returns {boolean} - Retorna true si la fecha es festiva, de lo contrario false
 */
const isHoliday = (date, timeZone) => {
  const dateString = format(date, 'yyyy-MM-dd', { timeZone });
  return holidays.includes(dateString);
};

/**
 * Función para verificar si una fecha está dentro del Horario Hábil
 * @param {Date} date - La fecha a verificar
 * @returns {boolean} - Retorna true si está dentro del Horario Hábil, de lo contrario false
 */
const isWorkingHour = (date) => {
  const timeZone = 'Etc/GMT+5'; // GMT-5 en nomenclatura de IANA
  const day = getDay(date); // Domingo - Sábado : 0 - 6

  // Verificar si es fin de semana o festivo
  if (day === 0 || day === 6 || isHoliday(date, timeZone)) {
    return false;
  }

  const hour = getHours(date);

  // Verificar si está dentro del horario hábil
  if (hour < businessStartHour || hour >= businessEndHour) {
    return false;
  }

  return true;
};

/**
 * Función para ajustar una fecha al siguiente Horario Hábil
 * @param {Date} date - La fecha a ajustar
 * @returns {Date} - La fecha ajustada al siguiente Horario Hábil
 */
const adjustToNextWorkingHour = (date) => {
  let adjustedDate = new Date(date);

  // Si la fecha está dentro del horario hábil, no ajustar
  if (isWorkingHour(adjustedDate)) {
    return adjustedDate;
  }

  // Ajuste para el mismo día a las 8:00 a.m. si la hora es anterior
  const startOfBusinessDay = setHours(adjustedDate, businessStartHour);
  setMinutes(startOfBusinessDay, 0);
  setSeconds(startOfBusinessDay, 0);
  setMilliseconds(startOfBusinessDay, 0);

  if (adjustedDate < startOfBusinessDay) {
    // Si la hora actual es antes de las 8:00 a.m., ajusta al mismo día a las 8:00 a.m.
    adjustedDate = startOfBusinessDay;
  } else {
    // Mover al siguiente día hábil a las 8:00 a.m.
    adjustedDate = addDays(adjustedDate, 1);
    adjustedDate = setHours(adjustedDate, businessStartHour);
    adjustedDate = setMinutes(adjustedDate, 0);
    adjustedDate = setSeconds(adjustedDate, 0);
    adjustedDate = setMilliseconds(adjustedDate, 0);

    // Incrementar días hasta encontrar un día hábil
    while (!isWorkingHour(adjustedDate)) {
      adjustedDate = addDays(adjustedDate, 1);
      adjustedDate = setHours(adjustedDate, businessStartHour);
      adjustedDate = setMinutes(adjustedDate, 0);
      adjustedDate = setSeconds(adjustedDate, 0);
      adjustedDate = setMilliseconds(adjustedDate, 0);
    }
  }

  return adjustedDate;
};

/**
 * Función para agregar minutos considerando el Horario Hábil
 * @param {Date} startDate - La fecha de inicio
 * @param {number} minutesToAdd - Los minutos a agregar
 * @returns {Date} - La nueva fecha después de agregar los minutos en Horario Hábil
 */
const addWorkingMinutes = (startDate, minutesToAdd) => {
  let remainingMinutes = minutesToAdd;
  let currentDate = new Date(startDate);

  // Asegurar que iniciamos dentro del Horario Hábil
  if (!isWorkingHour(currentDate)) {
    currentDate = adjustToNextWorkingHour(currentDate);
  }

  while (remainingMinutes > 0) {
    let endOfBusinessDay = setHours(currentDate, businessEndHour);
    endOfBusinessDay = setMinutes(endOfBusinessDay, 0);
    endOfBusinessDay = setSeconds(endOfBusinessDay, 0);
    endOfBusinessDay = setMilliseconds(endOfBusinessDay, 0);

    const minutesAvailable = (endOfBusinessDay - currentDate) / (1000 * 60);

    if (remainingMinutes <= minutesAvailable) {
      currentDate = addMinutes(currentDate, remainingMinutes);
      remainingMinutes = 0;
    } else {
      remainingMinutes -= minutesAvailable;
      // Mover al siguiente día hábil
      currentDate = adjustToNextWorkingHour(addMinutes(endOfBusinessDay, 1));
    }
  }
  return currentDate;
};

/**
 * Función para restar minutos considerando el Horario Hábil
 * @param {Date} startDate - La fecha de inicio
 * @param {number} minutesToSubtract - Los minutos a restar
 * @returns {Date} - La nueva fecha después de restar los minutos en Horario Hábil
 */
const subtractWorkingMinutes = (startDate, minutesToSubtract) => {
  let remainingMinutes = minutesToSubtract;
  let currentDate = new Date(startDate);

  /**
   * Función para ajustar una fecha al Horario Hábil anterior
   * @param {Date} date - La fecha a ajustar
   * @returns {Date} - La fecha ajustada al Horario Hábil anterior
   */
  const adjustToPreviousWorkingHour = (date) => {
    let adjustedDate = new Date(date);

    // Si ya está dentro del Horario Hábil, no ajustar
    if (isWorkingHour(adjustedDate)) {
      return adjustedDate;
    }

    // Mover al día hábil anterior a las 5:00 p.m.
    adjustedDate = subMinutes(adjustedDate, 1);
    adjustedDate = setHours(adjustedDate, businessEndHour - 1);
    adjustedDate = setMinutes(adjustedDate, 59);
    adjustedDate = setSeconds(adjustedDate, 59);
    adjustedDate = setMilliseconds(adjustedDate, 999);

    while (!isWorkingHour(adjustedDate)) {
      adjustedDate = subMinutes(adjustedDate, 1440); // Restar 1 día
      adjustedDate = setHours(adjustedDate, businessEndHour - 1);
      adjustedDate = setMinutes(adjustedDate, 59);
      adjustedDate = setSeconds(adjustedDate, 59);
      adjustedDate = setMilliseconds(adjustedDate, 999);
    }

    return adjustedDate;
  };

  // Asegurar que iniciamos dentro del Horario Hábil
  if (!isWorkingHour(currentDate)) {
    currentDate = adjustToPreviousWorkingHour(currentDate);
  }

  while (remainingMinutes > 0) {
    let startOfBusinessDay = setHours(currentDate, businessStartHour);
    startOfBusinessDay = setMinutes(startOfBusinessDay, 0);
    startOfBusinessDay = setSeconds(startOfBusinessDay, 0);
    startOfBusinessDay = setMilliseconds(startOfBusinessDay, 0);

    const minutesAvailable = (currentDate - startOfBusinessDay) / (1000 * 60);

    if (remainingMinutes <= minutesAvailable) {
      currentDate = subMinutes(currentDate, remainingMinutes);
      remainingMinutes = 0;
    } else {
      remainingMinutes -= minutesAvailable;
      // Mover al día hábil anterior
      currentDate = adjustToPreviousWorkingHour(subMinutes(startOfBusinessDay, 1));
    }
  }
  return currentDate;
};

/**
 * Función principal para calcular los tiempos de seguimiento según el tipo de caso
 * @param {Object} caseData - Los datos del caso
 * @returns {Object} - Los tiempos calculados para los seguimientos
 */
const calculateFollowUpTimes = (caseData) => {
  const { type, caseCreationTime, taskCreationTime } = caseData;

  // Definir la zona horaria GMT-5
  const timeZone = 'Etc/GMT+5'; // GMT-5 es Etc/GMT+5 en nomenclatura de IANA

  // Parsear las fechas de entrada en GMT-5
  const caseCreationDate = utcToZonedTime(new Date(caseCreationTime), timeZone);
  const taskCreationDate = utcToZonedTime(new Date(taskCreationTime), timeZone);

  let internalFollowUpTime;
  let clientFollowUpTime;
  let caseExpirationTime;
  let closingFollowUpTime;
  let constantFollowUpTime;

  // Cálculos principales según el tipo de caso
  if (type === 'Falla') {
    // Casos de "Falla": no se considera el Horario Hábil

    internalFollowUpTime = addMinutes(taskCreationDate, 30);
    clientFollowUpTime = addMinutes(caseCreationDate, 40);
    caseExpirationTime = addMinutes(caseCreationDate, 120); // 2 horas
    closingFollowUpTime = subMinutes(caseExpirationTime, 40);
    constantFollowUpTime = addMinutes(caseCreationDate, 30);

  } else if (type === 'Requerimiento') {
    if (isWorkingHour(caseCreationDate)) {
      // Ingresó DENTRO del Horario Hábil
      internalFollowUpTime = addMinutes(taskCreationDate, 60);
      clientFollowUpTime = addMinutes(caseCreationDate, 60);
      caseExpirationTime = addMinutes(caseCreationDate, 240); // 4 horas
      closingFollowUpTime = subMinutes(caseExpirationTime, 40);
      constantFollowUpTime = addMinutes(caseCreationDate, 30);

    } else {
      // Ingresó FUERA del Horario Hábil
      const adjustedCaseCreationDate = adjustToNextWorkingHour(caseCreationDate);
      const adjustedTaskCreationDate = adjustToNextWorkingHour(taskCreationDate);

      internalFollowUpTime = addWorkingMinutes(adjustedTaskCreationDate, 60);
      clientFollowUpTime = addWorkingMinutes(adjustedCaseCreationDate, 60);
      caseExpirationTime = addWorkingMinutes(adjustedCaseCreationDate, 240); // 4 horas
      closingFollowUpTime = subtractWorkingMinutes(caseExpirationTime, 40);
      constantFollowUpTime = addWorkingMinutes(adjustedCaseCreationDate, 30);
    }

  } else if (type === 'Especial') {
    // Casos "Especiales": se usa el campo de "Seguimiento Programado" como base
    const scheduledFollowUp = new Date(caseData.scheduledFollowUpTime); // Nuevo campo ingresado por el usuario
  
    internalFollowUpTime = addMinutes(taskCreationDate, 60);
    clientFollowUpTime = addMinutes(caseCreationDate, 60);
    caseExpirationTime = addMinutes(scheduledFollowUp, 1440); // 24 horas
    closingFollowUpTime = subMinutes(caseExpirationTime, 40);
  
    // Nuevo cálculo para constantFollowUpTime
    constantFollowUpTime = subMinutes(scheduledFollowUp, 30);
  }

  return {
    internalFollowUpTime,
    clientFollowUpTime,
    caseExpirationTime,
    closingFollowUpTime,
    constantFollowUpTime,
  };
};

/**
 * Exportaciones de funciones utilitarias
 */
export {
  calculateFollowUpTimes,
  adjustToNextWorkingHour,
  addWorkingMinutes,
  isWorkingHour,
};
