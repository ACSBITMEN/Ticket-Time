// src/components/CaseItem.jsx

import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import '../styles/CaseItem.css';
import { calculateFollowUpTimes, adjustToNextWorkingHour, addWorkingMinutes, 
        isWorkingHour } from '../utils/timeCalculations';
import { format } from 'date-fns-tz';
import { addMinutes } from 'date-fns';
import Modal from 'react-modal';

// Configurar el elemento root para react-modal
Modal.setAppElement('#root');

function CaseItem({ caseData, removeCase }) { // Añadimos 'removeCase' como prop
  const {
    id, // Asegúrate de que cada caso tiene un 'id' único
    caseNumber,
    type,
    caseCreationTime,
    taskCreationTime,
  } = caseData;

  const caseCreationDate = new Date(caseCreationTime);
  const taskCreationDate = new Date(taskCreationTime);

  const typeClass = type.toLowerCase();

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

  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal

  // useRef para guardar el intervalo
  const intervalIdRef = useRef(null);

  // Cargar el estado de 'completed' desde localStorage al montar el componente
  useEffect(() => {
    const savedCompleted = localStorage.getItem(`completed_${id}`);
    if (savedCompleted) {
      setCompleted(JSON.parse(savedCompleted));
    }
  }, [id]);

  // Cargar 'staticTimes' desde localStorage al montar el componente
  useEffect(() => {
    const savedStaticTimes = localStorage.getItem(`staticTimes_${id}`);
    if (savedStaticTimes) {
      setStaticTimes(JSON.parse(savedStaticTimes, (key, value) => (key.endsWith('Time') ? new Date(value) : value)));
    } else {
      calculateAndSetTimes();
    }
  }, [id]);

  // Función para calcular y establecer los tiempos
  const calculateAndSetTimes = () => {
    const {
      internalFollowUpTime,
      clientFollowUpTime,
      closingFollowUpTime,
      caseExpirationTime,
      constantFollowUpTime,
    } = calculateFollowUpTimes(caseData);

    const newStaticTimes = {
      internalFollowUpTime,
      clientFollowUpTime,
      closingFollowUpTime,
      caseExpirationTime,
      constantFollowUpTime,
    };

    setStaticTimes(newStaticTimes);

    // Guardar 'staticTimes' en localStorage
    localStorage.setItem(`staticTimes_${id}`, JSON.stringify(newStaticTimes));
  };

  useEffect(() => {
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
          : staticTimes.internalFollowUpTime.getTime() - now.getTime(),
        clientFollowUp: completed.clientFollowUp
          ? prevTimeLeft.clientFollowUp
          : staticTimes.clientFollowUpTime.getTime() - now.getTime(),
        closingFollowUp: completed.closingFollowUp
          ? prevTimeLeft.closingFollowUp
          : staticTimes.closingFollowUpTime.getTime() - now.getTime(),
        caseExpiration: completed.caseExpiration
          ? prevTimeLeft.caseExpiration
          : staticTimes.caseExpirationTime.getTime() - now.getTime(),
        constantFollowUp: completed.constantFollowUp
          ? prevTimeLeft.constantFollowUp
          : staticTimes.constantFollowUpTime.getTime() - now.getTime(),
      }));
    }, 1000);

    return () => clearInterval(intervalIdRef.current);
  }, [staticTimes, completed]);

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

    return `'${hours}h ${minutes}m'`;
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

  // Función para manejar el botón "Borrar"
  const handleDelete = () => {
    // Eliminar datos del localStorage
    localStorage.removeItem(`completed_${id}`);
    localStorage.removeItem(`staticTimes_${id}`);
    // Llamar a la función 'removeCase' para eliminar el caso de la lista
    removeCase(id);
  };

  // Función para manejar el botón "Reiniciar"
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

    // Actualizar 'staticTimes' y guardar en localStorage
    const updatedStaticTimes = {
      ...staticTimes,
      constantFollowUpTime: newConstantFollowUpTime,
    };
    setStaticTimes(updatedStaticTimes);
    localStorage.setItem(`staticTimes_${id}`, JSON.stringify(updatedStaticTimes));

    // Reiniciar el estado de 'completed' para 'constantFollowUp'
    const updatedCompleted = {
      ...completed,
      constantFollowUp: false,
    };
    setCompleted(updatedCompleted);
    localStorage.setItem(`completed_${id}`, JSON.stringify(updatedCompleted));
  };

  // Función para abrir el modal
  const openModal = () => {
    setShowModal(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="case-item">
      <div className='case-item-date'>
        <h5>
          <p className={`type-pop ${typeClass}`}>{type}</p>
          <b>#{caseNumber}</b>
        </h5>
        <div>
          <p className='date-pop'><b>Creación Ticket:</b> {formatDateTime(caseCreationDate)}</p>
          <p className='date-pop'><b>Creación Tarea:</b> {formatDateTime(taskCreationDate)}</p>
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

        {/* Seguimiento Constante */}
        <div className="containerTimerDate">
          <h5>Seguimiento Constante</h5>
          <div className="ContainerTimer">
            <div className='timerStatic'>{formatDateTime(staticTimes.constantFollowUpTime)}</div>
            <div className={`StatusTimer ${getStatusClass(timeLeft.constantFollowUp, completed.constantFollowUp)}`}>
              {formatTimeLeft(timeLeft.constantFollowUp, completed.constantFollowUp)}
              <input
                type="checkbox"
                checked={completed.constantFollowUp}
                onChange={(e) => handleCheckboxChange(e, 'constantFollowUp')}
              />
            </div>
            {type !== 'Especial' && (
              <button onClick={handleReset} className="btn-reset">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                </svg>
                Reiniciar
              </button>
            )}  
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
        {/* Botones "Reiniciar" y "Borrar" */}
        <div className="actions">
          <button onClick={openModal} className="btn-delete">
            Borrar
          </button>
        </div>
      </div>

      {/* Modal de confirmación */}
      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Confirmación de Borrado"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        <h2>¿Quieres borrar el Ticket?</h2>
        <div className="modal-actions">
          <button onClick={handleDelete} className="btn-confirm">
            Borrar Ticket
          </button>
          <button onClick={closeModal} className="btn-cancel">
            Cancelar
          </button>
        </div>
      </Modal>
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
  removeCase: PropTypes.func.isRequired, // Añadimos 'removeCase' como prop requerido
};

export default CaseItem;
