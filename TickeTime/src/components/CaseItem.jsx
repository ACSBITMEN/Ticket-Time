// src/components/CaseItem.jsx

import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import '../styles/CaseItem.css';
import { calculateFollowUpTimes } from '../utils/timeCalculations';
import { format } from 'date-fns-tz';

function CaseItem({ caseData }) {
  const {
    id, // Asegúrate de que cada caso tiene un 'id' único
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

  const [completed, setCompleted] = useState({
    internalFollowUp: false,
    clientFollowUp: false,
    closingFollowUp: false,
    caseExpiration: false,
    constantFollowUp: false,
  });

  // useRef para guardar el intervalo
  const intervalIdRef = useRef(null);

  // Cargar el estado de 'completed' desde localStorage al montar el componente
  useEffect(() => {
    const savedCompleted = localStorage.getItem(`completed_${id}`);
    if (savedCompleted) {
      setCompleted(JSON.parse(savedCompleted));
    }
  }, [id]);

  useEffect(() => {
    const {
      internalFollowUpTime,
      clientFollowUpTime,
      closingFollowUpTime,
      caseExpirationTime,
      constantFollowUpTime,
    } = calculateFollowUpTimes(caseData);

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

      setTimeLeft((prevTimeLeft) => ({
        internalFollowUp: completed.internalFollowUp
          ? prevTimeLeft.internalFollowUp
          : internalFollowUpTime.getTime() - now.getTime(),
        clientFollowUp: completed.clientFollowUp
          ? prevTimeLeft.clientFollowUp
          : clientFollowUpTime.getTime() - now.getTime(),
        closingFollowUp: completed.closingFollowUp
          ? prevTimeLeft.closingFollowUp
          : closingFollowUpTime.getTime() - now.getTime(),
        caseExpiration: completed.caseExpiration
          ? prevTimeLeft.caseExpiration
          : caseExpirationTime.getTime() - now.getTime(),
        constantFollowUp: completed.constantFollowUp
          ? prevTimeLeft.constantFollowUp
          : constantFollowUpTime.getTime() - now.getTime(),
      }));
    }, 1000);

    return () => clearInterval(intervalIdRef.current);
  }, [caseData, completed]);

  // Función para formatear el tiempo restante
  const formatTimeLeft = (milliseconds, isCompleted) => {
    if (isCompleted) {
      return 'Completado';
    }
    if (isNaN(milliseconds) || milliseconds <= 0) {
      return 'Tiempo vencido';
    }
    const totalMinutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `' ${hours}h ${minutes}m '`;
  };

  // Función para formatear las fechas estáticas
  const formatDateTime = (date) => {
    if (!date || isNaN(date.getTime())) {
      return 'Fecha no disponible';
    }
    const timeZone = 'America/Bogota';
    return format(date, 'yyyy-MM-dd HH:mm:ss', { timeZone });
  };

  // Función para manejar el cambio en los checks
  const handleCheckboxChange = (event, key) => {
    const updatedCompleted = {
      ...completed,
      [key]: event.target.checked,
    };
    setCompleted(updatedCompleted);
    // Guardar el estado actualizado en localStorage
    localStorage.setItem(`completed_${id}`, JSON.stringify(updatedCompleted));
  };

  // Función para determinar la clase CSS según el estado
  const getStatusClass = (milliseconds, isCompleted) => {
    if (isCompleted) {
      return 'completed';
    } else if (milliseconds <= 0) {
      return 'expired';
    } else {
      return 'pending';
    }
  };

  return (
    <div className="case-item">
      <div className='case-item-date'>
        <h5>Ticket #{caseNumber} - {type} </h5>
        <div className='container-case-item-date'>
        <p><b>Creación Ticket:</b> {formatDateTime(caseCreationDate)}</p>
        <p><b>Creación Tarea:</b> {formatDateTime(taskCreationDate)}</p>
        </div>
      </div>
      <div className="timers">
        {/* Seguimiento Interno */}
        <div className="containerTimerDate">
          <h5>1er Seguimiento Tarea</h5>
          <div className="ContainerTimer">
            <div className='timerStatic'>{formatDateTime(staticTimes.internalFollowUpTime)}</div>
            <div className={`StatusTimer ${getStatusClass(timeLeft.internalFollowUp, completed.internalFollowUp)}`}>
              {formatTimeLeft(timeLeft.internalFollowUp, completed.internalFollowUp)}
              <input
                type="checkbox"
                checked={completed.internalFollowUp}
                onChange={(e) => handleCheckboxChange(e, 'internalFollowUp')}
              />
            </div>
          </div>
        </div>

        {/* Seguimiento al Cliente */}
        <div className="containerTimerDate">
          <h5>1er Avance al Cliente</h5>
          <div className="ContainerTimer">
            <div className='timerStatic'>{formatDateTime(staticTimes.clientFollowUpTime)}</div>
            <div className={`StatusTimer ${getStatusClass(timeLeft.clientFollowUp, completed.clientFollowUp)}`}>
              {formatTimeLeft(timeLeft.clientFollowUp, completed.clientFollowUp)}
              <input
                type="checkbox"
                checked={completed.clientFollowUp}
                onChange={(e) => handleCheckboxChange(e, 'clientFollowUp')}
              />
            </div>
          </div>
        </div>

        {/* Seguimiento de Cierre */}
        <div className="containerTimerDate">
          <h5>Seguimiento de Tarea Cierre</h5>
          <div className="ContainerTimer">
            <div className='timerStatic'>{formatDateTime(staticTimes.closingFollowUpTime)}</div>
            <div className={`StatusTimer ${getStatusClass(timeLeft.closingFollowUp, completed.closingFollowUp)}`}>
              {formatTimeLeft(timeLeft.closingFollowUp, completed.closingFollowUp)}
              <input
                type="checkbox"
                checked={completed.closingFollowUp}
                onChange={(e) => handleCheckboxChange(e, 'closingFollowUp')}
              />
            </div>
          </div>
        </div>

        {/* Seguimiento Constante */}
        <div className="containerTimerDate">
          <h5>Seguimiento Constante</h5>
          <div className="ContainerTimer">
            <div className='timerStatic'>{formatDateTime(staticTimes.constantFollowUpTime)}</div>
            <div className={`StatusTimer ${getStatusClass(timeLeft.constantFollowUp, completed.constantFollowUp)}`}>
              <p>{formatTimeLeft(timeLeft.constantFollowUp, completed.constantFollowUp)}</p>
              <input
                type="checkbox"
                checked={completed.constantFollowUp}
                onChange={(e) => handleCheckboxChange(e, 'constantFollowUp')}
              />
            </div>
            <button>Reiniciar</button>
          </div>
        </div>

        {/* Vencimiento del Caso */}
        <div className="containerTimerDate">
          <h5>Vencimiento del Caso</h5>
          <div className="ContainerTimer">
            <div className='timerStatic'>{formatDateTime(staticTimes.caseExpirationTime)}</div>
            <div className={`StatusTimer ${getStatusClass(timeLeft.caseExpiration, completed.caseExpiration)}`}>
              {formatTimeLeft(timeLeft.caseExpiration, completed.caseExpiration)}
              <input
                type="checkbox"
                checked={completed.caseExpiration}
                onChange={(e) => handleCheckboxChange(e, 'caseExpiration')}
              />
            </div>
          </div>
        </div>
        <div className='statusEnd'>
          <button>Borrar</button>
        </div>
      </div>
    </div>
  );
}

CaseItem.propTypes = {
  caseData: PropTypes.shape({
    id: PropTypes.number.isRequired, // Asegúrate de que 'id' es requerido y único
    caseNumber: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    caseCreationTime: PropTypes.number.isRequired,
    taskCreationTime: PropTypes.number.isRequired,
  }).isRequired,
};

export default CaseItem;
