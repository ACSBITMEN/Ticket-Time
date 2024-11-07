// src/components/CaseItem.jsx

import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import '../styles/CaseItem.css';
import { calculateFollowUpTimes, adjustToNextWorkingHour, addWorkingMinutes, isWorkingHour } from '../utils/timeCalculations';
import { format } from 'date-fns-tz';
import { addMinutes, subMinutes } from 'date-fns';
import CaseInfo from './CaseInfo';
import TimerSection from './TimerSection';
import ActionsModal from './ActionsModal';

function CaseItem({ caseData, removeCase, updateCase }) {
  const { id, caseNumber, type, caseCreationTime, taskCreationTime } = caseData;

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

  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [scheduledFollowUp, setScheduledFollowUp] = useState(
    caseData.scheduledFollowUpTime ? new Date(caseData.scheduledFollowUpTime).toISOString().slice(0, 16) : ''
  );
  
  const intervalIdRef = useRef(null);


  useEffect(() => {
    const savedCompleted = localStorage.getItem(`completed_${id}`);
    if (savedCompleted) {
      setCompleted(JSON.parse(savedCompleted));
    }
  }, [id]);

  useEffect(() => {
    const savedStaticTimes = localStorage.getItem(`staticTimes_${id}`);
    if (savedStaticTimes) {
      setStaticTimes(JSON.parse(savedStaticTimes, (key, value) => (key.endsWith('Time') ? new Date(value) : value)));
    } else {
      calculateAndSetTimes();
    }
  }, [id]);

  const calculateAndSetTimes = () => {
    const times = calculateFollowUpTimes(caseData);
    setStaticTimes(times);
    localStorage.setItem(`staticTimes_${id}`, JSON.stringify(times));
  };

  useEffect(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }

    intervalIdRef.current = setInterval(() => {
      const now = new Date();
      setTimeLeft((prev) => ({
        internalFollowUp: completed.internalFollowUp || !staticTimes.internalFollowUpTime
          ? prev.internalFollowUp
          : staticTimes.internalFollowUpTime.getTime() - now.getTime(),
        clientFollowUp: completed.clientFollowUp || !staticTimes.clientFollowUpTime
          ? prev.clientFollowUp
          : staticTimes.clientFollowUpTime.getTime() - now.getTime(),
        closingFollowUp: completed.closingFollowUp || !staticTimes.closingFollowUpTime
          ? prev.closingFollowUp
          : staticTimes.closingFollowUpTime.getTime() - now.getTime(),
        caseExpiration: completed.caseExpiration || !staticTimes.caseExpirationTime
          ? prev.caseExpiration
          : staticTimes.caseExpirationTime.getTime() - now.getTime(),
        constantFollowUp: completed.constantFollowUp || !staticTimes.constantFollowUpTime
          ? prev.constantFollowUp
          : staticTimes.constantFollowUpTime.getTime() - now.getTime(),
      }));
    }, 1000);
    

    return () => clearInterval(intervalIdRef.current);
  }, [staticTimes, completed]);

  const formatTimeLeft = (milliseconds, isCompleted) => {
    if (isCompleted) return 'Completado';
    if (isNaN(milliseconds) || milliseconds <= 0) return 'Tiempo vencido';

    const totalMinutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const formatDateTime = (date) => {
    if (!date || isNaN(date.getTime())) return 'Fecha no disponible';
    const timeZone = 'America/Bogota';
    return format(date, 'yyyy-MM-dd HH:mm:ss', { timeZone });
  };

  const handleCheckboxChange = (key) => (event) => {
    const updatedCompleted = { ...completed, [key]: event.target.checked };
    setCompleted(updatedCompleted);
    localStorage.setItem(`completed_${id}`, JSON.stringify(updatedCompleted));
  };

  const getStatusClass = (milliseconds, isCompleted) => {
    if (isCompleted) return 'completed';
    return milliseconds <= 0 ? 'expired' : 'pending';
  };

  const handleDelete = () => {
    localStorage.removeItem(`completed_${id}`);
    localStorage.removeItem(`staticTimes_${id}`);
    removeCase(id);
  };

  const handleReset = () => {
    const now = new Date();
    let newConstantFollowUpTime;
    const scheduledFollowUp = caseData.scheduledFollowUpTime ? new Date(caseData.scheduledFollowUpTime) : null;
  
    if (scheduledFollowUp) {
      // Casos con scheduledFollowUp
      if (now < scheduledFollowUp) {
        // Antes de la fecha programada
        newConstantFollowUpTime = subMinutes(scheduledFollowUp, 30);
      } else {
        // Después de la fecha programada
        newConstantFollowUpTime = addMinutes(now, 30);
      }
    } else {
      // Casos sin scheduledFollowUp
      if (type === 'Requerimiento') {
        if (isWorkingHour(now)) {
          // Dentro del horario hábil
          newConstantFollowUpTime = addMinutes(now, 30);
        } else {
          // Fuera del horario hábil, ajustar al siguiente horario hábil
          const adjustedNow = adjustToNextWorkingHour(now);
          newConstantFollowUpTime = addWorkingMinutes(adjustedNow, 30);
        }
      } else if (type === 'Falla') {
        // Para "Falla", siempre es ahora + 30 minutos
        newConstantFollowUpTime = addMinutes(now, 30);
      }
    }
  
    if (newConstantFollowUpTime) {
      setStaticTimes((prev) => ({
        ...prev,
        constantFollowUpTime: newConstantFollowUpTime,
      }));
      localStorage.setItem(`staticTimes_${id}`, JSON.stringify({
        ...staticTimes,
        constantFollowUpTime: newConstantFollowUpTime,
      }));
  
      setCompleted((prev) => ({
        ...prev,
        constantFollowUp: false,
      }));
      localStorage.setItem(`completed_${id}`, JSON.stringify({
        ...completed,
        constantFollowUp: false,
      }));
    } else {
      console.warn('No se pudo actualizar el tiempo de seguimiento constante');
    }
  };
  

  const handleReprogram = () => {
    if (scheduledFollowUp) {
      const scheduledFollowUpDate = new Date(scheduledFollowUp);
      const now = new Date();
  
      // Validación para asegurarse de que scheduledFollowUp sea una fecha futura
      if (scheduledFollowUpDate <= now) {
        alert("Por favor selecciona una fecha futura para el seguimiento programado.");
        return; // Salir de la función si la fecha es en el pasado
      }
  
      if (!isNaN(scheduledFollowUpDate.getTime())) {
        const updatedCaseData = {
          ...caseData,
          scheduledFollowUpTime: scheduledFollowUpDate.getTime(),
        };
  
        // Asegúrate de que `updateCase` esté definido antes de llamarlo
        if (typeof updateCase === 'function') {
          updateCase(updatedCaseData);
        }
      }
    }
    closeModal();
  };

  

  const openModal = (action) => {
    setModalAction(action);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  return (
    <div className="case-item">
      <CaseInfo
        type={type}
        caseNumber={caseNumber}
        caseCreationDate={caseCreationDate}
        taskCreationDate={taskCreationDate}
        scheduledFollowUp={scheduledFollowUp}
        formatDateTime={formatDateTime}
      />

      <div className="timers">
        <TimerSection
          title="(1) Seguimiento Tarea"
          staticTime={staticTimes.internalFollowUpTime}
          timeLeft={timeLeft.internalFollowUp}
          completed={completed.internalFollowUp}
          onCheckboxChange={handleCheckboxChange('internalFollowUp')}
          formatDateTime={formatDateTime}
          formatTimeLeft={formatTimeLeft}
          getStatusClass={getStatusClass}
        />
        <TimerSection
          title="(1) Avance al Cliente"
          staticTime={staticTimes.clientFollowUpTime}
          timeLeft={timeLeft.clientFollowUp}
          completed={completed.clientFollowUp}
          onCheckboxChange={handleCheckboxChange('clientFollowUp')}
          formatDateTime={formatDateTime}
          formatTimeLeft={formatTimeLeft}
          getStatusClass={getStatusClass}
        />
        <TimerSection
          title="Seguimiento de Cierre"
          staticTime={staticTimes.closingFollowUpTime}
          timeLeft={timeLeft.closingFollowUp}
          completed={completed.closingFollowUp}
          onCheckboxChange={handleCheckboxChange('closingFollowUp')}
          formatDateTime={formatDateTime}
          formatTimeLeft={formatTimeLeft}
          getStatusClass={getStatusClass}
        />
        <TimerSection
          title="Vencimiento Ticket"
          staticTime={staticTimes.caseExpirationTime}
          timeLeft={timeLeft.caseExpiration}
          completed={completed.caseExpiration}
          onCheckboxChange={handleCheckboxChange('caseExpiration')}
          formatDateTime={formatDateTime}
          formatTimeLeft={formatTimeLeft}
          getStatusClass={getStatusClass}
        />
        <TimerSection
          title="Seguimiento Constante"
          staticTime={staticTimes.constantFollowUpTime}
          timeLeft={timeLeft.constantFollowUp}
          completed={completed.constantFollowUp}
          onCheckboxChange={handleCheckboxChange('constantFollowUp')}
          formatDateTime={formatDateTime}
          formatTimeLeft={formatTimeLeft}
          getStatusClass={getStatusClass}
          onReset={handleReset} // Se pasa handleReset solo a este TimerSection
        />

      </div>
      <div className="actions">
        <button onClick={() => openModal('delete')} className="btn-delete">Borrar</button>
        <button onClick={() => openModal('reprogram')} className="btn-frezzer">Reprogramar</button>
      </div>

      <ActionsModal
        isOpen={showModal}
        onRequestClose={closeModal}
        onConfirm={modalAction === 'delete' ? handleDelete : handleReprogram}
        actionType={modalAction}
        scheduledFollowUp={scheduledFollowUp}
        setScheduledFollowUp={setScheduledFollowUp}
      />
    </div>
  );
}

CaseItem.propTypes = {
  caseData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    caseNumber: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    caseCreationTime: PropTypes.number.isRequired,
    taskCreationTime: PropTypes.number.isRequired,
    scheduledFollowUpTime: PropTypes.number,
  }).isRequired,
  removeCase: PropTypes.func.isRequired,
  updateCase: PropTypes.func.isRequired,
};

export default CaseItem;
