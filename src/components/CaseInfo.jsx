// src/components/CaseInfo.jsx

//Este componente puede manejar la información básica del caso
import '../styles/CaseInfo.css'; 
import PropTypes from 'prop-types';

function CaseInfo({ type, caseNumber, caseCreationDate, taskCreationDate, scheduledFollowUp, formatDateTime }) {
  const typeClass = type.toLowerCase();

  return (
    <div className={`case-item-date ${typeClass}`}>
      <h5>
        <p className={`type-pop ${typeClass}`}>{type}</p>
        <b>#{caseNumber}</b>
      </h5>
      <div>
        <p className='date-pop'><b>Ticket:</b> {formatDateTime(caseCreationDate)}</p>
        <p className='date-pop'><b>Tarea:</b> {formatDateTime(taskCreationDate)}</p>
        {scheduledFollowUp ? (
          <p className='date-pop'><b>Programado:</b> {formatDateTime(new Date(scheduledFollowUp))}</p>
        ) : null}
      </div>
    </div>
  );
}

CaseInfo.propTypes = {
  type: PropTypes.string.isRequired,
  caseNumber: PropTypes.string.isRequired,
  caseCreationDate: PropTypes.instanceOf(Date).isRequired,
  taskCreationDate: PropTypes.instanceOf(Date).isRequired,
  scheduledFollowUp: PropTypes.instanceOf(Date), // Cambiado a scheduledFollowUp
  formatDateTime: PropTypes.func.isRequired,
};

export default CaseInfo;


