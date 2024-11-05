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
            {/* Aquí puedes insertar el SVG del icono de reiniciar */}
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


