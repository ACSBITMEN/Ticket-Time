// src/components/TimerSection.jsx

//Este componente puede encargarse de cada bloque de temporizador (por ejemplo, "1er Seguimiento Tarea", "1er Avance al Cliente", etc.). Cada uno de estos componentes tendría la lógica para formatear el tiempo restante, el estado (completado, pendiente, vencido) y el control del checkbox.

import PropTypes from 'prop-types';

function TimerSection({ title, staticTime, timeLeft, completed, onCheckboxChange, formatDateTime, formatTimeLeft, getStatusClass, onReset }) {
  return (
    <div className="containerTimerDate">
      <h5>{title}</h5>
      <div className="ContainerTimer">
        <div className='timerStatic'>{formatDateTime(staticTime)}</div>
        <div className={`StatusTimer ${getStatusClass(timeLeft, completed)}`}>
          {formatTimeLeft(timeLeft, completed)}
          <input
            type="checkbox"
            checked={completed}
            onChange={onCheckboxChange}
          />
        </div>
        {onReset && (
          <button onClick={onReset} className="btn-reset">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
            </svg>
            Reiniciar
          </button>
        )}
      </div>
    </div>
  );
}

TimerSection.propTypes = {
  title: PropTypes.string.isRequired,
  staticTime: PropTypes.instanceOf(Date),
  timeLeft: PropTypes.number,
  completed: PropTypes.bool.isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
  formatDateTime: PropTypes.func.isRequired,
  formatTimeLeft: PropTypes.func.isRequired,
  getStatusClass: PropTypes.func.isRequired,
  onReset: PropTypes.func, // Hacemos esta prop opcional
};

export default TimerSection;


