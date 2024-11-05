import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import '../styles/CaseItem.css';
import { calculateFollowUpTimes, adjustToNextWorkingHour, addWorkingMinutes, isWorkingHour } from '../utils/timeCalculations';
import { format } from 'date-fns-tz';
import { addMinutes } from 'date-fns';
import CaseInfo from './CaseInfo';
import TimerSection from './TimerSection';
import ActionsModal from './ActionsModal';

function CaseItem({ caseData, removeCase }) {
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
  
    if (type === 'Falla') {
      newConstantFollowUpTime = addMinutes(now, 30);
    } else if (type === 'Requerimiento') {
      if (isWorkingHour(now)) {
        newConstantFollowUpTime = addMinutes(now, 30);
      } else {
        const adjustedNow = adjustToNextWorkingHour(now);
        newConstantFollowUpTime = addWorkingMinutes(adjustedNow, 30);
      }
    }
  
    if (newConstantFollowUpTime) { // Verifica que newConstantFollowUpTime no sea undefined
      const updatedStaticTimes = {
        ...staticTimes,
        constantFollowUpTime: newConstantFollowUpTime,
      };
      setStaticTimes(updatedStaticTimes);
      localStorage.setItem(`staticTimes_${id}`, JSON.stringify(updatedStaticTimes));
  
      const updatedCompleted = {
        ...completed,
        constantFollowUp: false,
      };
      setCompleted(updatedCompleted);
      localStorage.setItem(`completed_${id}`, JSON.stringify(updatedCompleted));
    } else {
      console.warn('No se pudo actualizar el tiempo de seguimiento constante');
    }
  };
  

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="case-item">
      <CaseInfo
        type={type}
        caseNumber={caseNumber}
        caseCreationDate={caseCreationDate}
        taskCreationDate={taskCreationDate}
        formatDateTime={formatDateTime}
      />

      <div className="timers">
        <TimerSection
          title="1er Seguimiento Tarea"
          staticTime={staticTimes.internalFollowUpTime}
          timeLeft={timeLeft.internalFollowUp}
          completed={completed.internalFollowUp}
          onCheckboxChange={handleCheckboxChange('internalFollowUp')}
          formatDateTime={formatDateTime}
          formatTimeLeft={formatTimeLeft}
          getStatusClass={getStatusClass}
        />
        <TimerSection
          title="1er Avance al Cliente"
          staticTime={staticTimes.clientFollowUpTime}
          timeLeft={timeLeft.clientFollowUp}
          completed={completed.clientFollowUp}
          onCheckboxChange={handleCheckboxChange('clientFollowUp')}
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
        <TimerSection
          title="Seguimiento de Tarea Cierre"
          staticTime={staticTimes.closingFollowUpTime}
          timeLeft={timeLeft.closingFollowUp}
          completed={completed.closingFollowUp}
          onCheckboxChange={handleCheckboxChange('closingFollowUp')}
          formatDateTime={formatDateTime}
          formatTimeLeft={formatTimeLeft}
          getStatusClass={getStatusClass}
        />
        <TimerSection
          title="Vencimiento del Caso"
          staticTime={staticTimes.caseExpirationTime}
          timeLeft={timeLeft.caseExpiration}
          completed={completed.caseExpiration}
          onCheckboxChange={handleCheckboxChange('caseExpiration')}
          formatDateTime={formatDateTime}
          formatTimeLeft={formatTimeLeft}
          getStatusClass={getStatusClass}
        />

        <div className="actions">
          <button onClick={openModal} className="btn-delete">Borrar</button>
        </div>
      </div>

      <ActionsModal
        isOpen={showModal}
        onRequestClose={closeModal}
        onDelete={handleDelete}
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
  }).isRequired,
  removeCase: PropTypes.func.isRequired,
};

export default CaseItem;