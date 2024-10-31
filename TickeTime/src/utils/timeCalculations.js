// src/utils/timeCalculations.js

export const calculateFollowUpTimes = (caseData) => {
  const { type, caseCreationTime, taskCreationTime } = caseData;

  const caseCreationDate = new Date(caseCreationTime);
  const taskCreationDate = new Date(taskCreationTime);

  let internalFollowUpTime;
  let clientFollowUpTime;
  let closingFollowUpTime;
  let caseExpirationTime;

  if (type === 'Falla') {
    // Seguimiento Interno: 30 minutos después de la creación de la tarea
    internalFollowUpTime = new Date(taskCreationDate.getTime() + 30 * 60 * 1000);

    // Seguimiento al Cliente: 40 minutos después de la creación del caso
    clientFollowUpTime = new Date(caseCreationDate.getTime() + 40 * 60 * 1000);

    // Seguimiento de Cierre: 40 minutos antes de vencer el caso
    caseExpirationTime = new Date(caseCreationDate.getTime() + 2 * 60 * 60 * 1000);
    closingFollowUpTime = new Date(caseExpirationTime.getTime() - 40 * 60 * 1000);
  } else if (type === 'Requerimiento') {
    // Seguimiento Interno: 60 minutos después de la creación de la tarea
    internalFollowUpTime = new Date(taskCreationDate.getTime() + 60 * 60 * 1000);

    // Seguimiento al Cliente: 60 minutos después de la creación del caso
    clientFollowUpTime = new Date(caseCreationDate.getTime() + 60 * 60 * 1000);

    // Seguimiento de Cierre: 40 minutos antes de vencer el caso
    caseExpirationTime = new Date(caseCreationDate.getTime() + 4 * 60 * 60 * 1000);
    closingFollowUpTime = new Date(caseExpirationTime.getTime() - 40 * 60 * 1000);
  } else if (type === 'Especial') {
    // Seguimiento Interno y al Cliente: 2 seguimientos por día (mañana y tarde)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const morningFollowUp = new Date(today.getTime());
    morningFollowUp.setHours(10, 0, 0, 0); // 10:00 AM

    const afternoonFollowUp = new Date(today.getTime());
    afternoonFollowUp.setHours(16, 0, 0, 0); // 4:00 PM

    // Determinar el siguiente seguimiento
    if (now < morningFollowUp) {
      internalFollowUpTime = morningFollowUp;
      clientFollowUpTime = morningFollowUp;
    } else if (now < afternoonFollowUp) {
      internalFollowUpTime = afternoonFollowUp;
      clientFollowUpTime = afternoonFollowUp;
    } else {
      // Programar para el siguiente día
      internalFollowUpTime = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      internalFollowUpTime.setHours(10, 0, 0, 0);
      clientFollowUpTime = internalFollowUpTime;
    }

    // Para "Especial", el Seguimiento de Cierre y Vencimiento del Caso no aplican, pero les asignamos valores para evitar problemas
    closingFollowUpTime = new Date(0); // Fecha Epoch
    caseExpirationTime = new Date(0);
  }

  return {
    internalFollowUpTime,
    clientFollowUpTime,
    closingFollowUpTime,
    caseExpirationTime,
  };
};
