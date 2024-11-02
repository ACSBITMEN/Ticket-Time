// src/components/CaseItem.jsx

import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import '../styles/CaseItem.css';
import { calculateFollowUpTimes } from '../utils/timeCalculations';
import { format } from 'date-fns-tz';

function CaseItem({ caseData }) {
  const {
    caseNumber,
    type,
    caseCreationTime,
    taskCreationTime,
  } = caseData;

  const caseCreationDate = new Date(caseCreationTime);
  const taskCreationDate = new Date(taskCreationTime);

  const [timeLeft, setTimeLeft] = useState({});
  const [staticTimes, setStaticTimes] = useState({
    internalFollowUpTime: null,
    clientFollowUpTime: null,
    closingFollowUpTime: null,
    caseExpirationTime: null,
    constantFollowUpTime: null,
  });

    // useRef para guardar el intervalo
    const intervalIdRef = useRef(null);

  useEffect(() => {
    const {
      internalFollowUpTime,
      clientFollowUpTime,
      closingFollowUpTime,
      caseExpirationTime,
      constantFollowUpTime,
    } = calculateFollowUpTimes(caseData);

    // Agregar logs para depuración
    console.log('internalFollowUpTime:', internalFollowUpTime);
    console.log('clientFollowUpTime:', clientFollowUpTime);
    console.log('closingFollowUpTime:', closingFollowUpTime);
    console.log('caseExpirationTime:', caseExpirationTime);
    console.log('constantFollowUpTime:', constantFollowUpTime);

   // Guardamos los tiempos estáticos
    setStaticTimes({
    internalFollowUpTime,
    clientFollowUpTime,
    closingFollowUpTime,
    caseExpirationTime,
    constantFollowUpTime,
  });

    // Limpiar intervalo anterior si existe
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }

    // Iniciar el intervalo
    intervalIdRef.current = setInterval(() => {
      const now = new Date();

      setTimeLeft({
        internalFollowUp: internalFollowUpTime.getTime() - now.getTime(),
        clientFollowUp: clientFollowUpTime.getTime() - now.getTime(),
        closingFollowUp: closingFollowUpTime.getTime() - now.getTime(),
        caseExpiration: caseExpirationTime.getTime() - now.getTime(),
        constantFollowUp: constantFollowUpTime.getTime() - now.getTime(),
      });
    }, 1000);

    return () => clearInterval(intervalIdRef.current);
  }, [caseData]); // Solo depende de caseData

  // Función para formatear el tiempo restante
  const formatTimeLeft = (milliseconds) => {
    if (isNaN(milliseconds) || milliseconds <= 0) {
      return 'Tiempo cumplido';
    }
    const totalMinutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
    return `${hours}h ${minutes}m`;
  };

  // Función para formatear las fechas estáticas
  const formatDateTime = (date) => {
    if (!date || isNaN(date.getTime())) {
      return 'Fecha no disponible';
    }
    const timeZone = 'America/Bogota';
    return format(date, 'yyyy-MM-dd HH:mm:ss', { timeZone });
  };

  return (
    <div className="case-item">
      <div className='case-item-date'>
        <h5>Caso {type} #{caseNumber}</h5>
        <p><b>Creación Caso:</b> {formatDateTime(caseCreationDate)}</p>
        <p><b>Creación Tarea:</b> {formatDateTime(taskCreationDate)}</p>
      </div>
      <hr />
      <div className="timers">
        <div className="containerTimerDate">
          <h5>1er Seguimiento Tarea</h5>
          <div className="ContainerTimer">
            <div className='timerStatic'>{formatDateTime(staticTimes.internalFollowUpTime)}</div>
            <div className='StatusTimer'>{formatTimeLeft(timeLeft.internalFollowUp)}</div>
          </div>
        </div>
        <div className="containerTimerDate">
          <h5>1er Avance al Cliente</h5>
          <div className="ContainerTimer">
            <div className='timerStatic'>{formatDateTime(staticTimes.clientFollowUpTime)}</div>
            <div className='StatusTimer'>{formatTimeLeft(timeLeft.clientFollowUp)}</div>
          </div>
        </div>
        <div className="containerTimerDate">
          <h5>Seguimiento Constante</h5>
          <div className="ContainerTimer">
            <div className='timerStatic'>{formatDateTime(staticTimes.constantFollowUpTime)}</div>
            <div className='StatusTimer'>{formatTimeLeft(timeLeft.constantFollowUp)}</div>
          </div>
        </div>
        <div className="containerTimerDate">
          <h5>Seguimiento de Tarea Cierre</h5>
          <div className="ContainerTimer">
            <div className='timerStatic'>{formatDateTime(staticTimes.closingFollowUpTime)}</div>
            <div className='StatusTimer'>{formatTimeLeft(timeLeft.closingFollowUp)}</div>
          </div>
        </div>
        <div className="containerTimerDate">
          <h5>Vencimiento del Caso</h5>
          <div className="ContainerTimer">
            <div className='timerStatic'>{formatDateTime(staticTimes.caseExpirationTime)}</div>
            <div className='StatusTimer'>{formatTimeLeft(timeLeft.caseExpiration)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

CaseItem.propTypes = {
  caseData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    caseNumber: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    caseCreationTime: PropTypes.number.isRequired, // Cambiado a number
    taskCreationTime: PropTypes.number.isRequired, // Cambiado a number
  }).isRequired,
};

export default CaseItem;
