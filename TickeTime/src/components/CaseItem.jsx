// src/components/CaseItem.jsx

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/CaseItem.css';
import { calculateFollowUpTimes } from '../utils/timeCalculations';

function CaseItem({ caseData }) {
  const {
    caseNumber,
    type,
    caseCreationTime,
    taskCreationTime,
  } = caseData;

  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const {
      internalFollowUpTime,
      clientFollowUpTime,
      closingFollowUpTime,
      caseExpirationTime,
    } = calculateFollowUpTimes(caseData);

    const intervalId = setInterval(() => {
      const now = new Date();

      setTimeLeft({
        internalFollowUp: internalFollowUpTime - now,
        clientFollowUp: clientFollowUpTime - now,
        closingFollowUp: closingFollowUpTime - now,
        caseExpiration: caseExpirationTime - now,
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [caseData]);

  // Función para formatear el tiempo restante
  const formatTimeLeft = (milliseconds) => {
    if (isNaN(milliseconds) || milliseconds <= 0) {
      return '00h 00m';
    }
    const totalMinutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="case-item">
      <div className='case-item-date'>
        <h5>Caso {type} #{caseNumber}</h5>
        <p><b>Creación Caso:</b> {new Date(caseCreationTime).toLocaleString()}</p>
        <p><b>Creación Tarea:</b> {new Date(taskCreationTime).toLocaleString()}</p>
      </div>
      <hr />
      <div className="timers">
        <div className="containerTimerDate">
          <h5>Seguimiento Tarea</h5>
          <div className="ContainerTimer">
            <div className='timerStatic'>Aqui ira Fecha/Hora Estatica</div>
            <div className='StatusTimer'>{formatTimeLeft(timeLeft.internalFollowUp)}</div>
          </div>
        </div>
        <div className="containerTimerDate">
          <h5>1er Avance al Cliente</h5>
          <div className="ContainerTimer">
            <div className='timerStatic'>Aqui ira Fecha/Hora Estatica</div>
            <div className='StatusTimer'>{formatTimeLeft(timeLeft.clientFollowUp)}</div>
          </div>
        </div>
        <div className="containerTimerDate">
          <h5>Seguimiento de Tarea Cierre</h5>
          <div className="ContainerTimer">
            <div className='timerStatic'>Aqui ira Fecha/Hora Estatica</div>
            <div className='StatusTimer'>{formatTimeLeft(timeLeft.closingFollowUp)}</div>
          </div>
        </div>
        <div className="containerTimerDate">
          <h5>Vencimiento del Caso</h5>
          <div className="ContainerTimer">
            <div className='timerStatic'>Aqui ira Fecha/Hora Estatica</div>
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
    caseCreationTime: PropTypes.string.isRequired,
    taskCreationTime: PropTypes.string.isRequired,
  }).isRequired,
};

export default CaseItem;
