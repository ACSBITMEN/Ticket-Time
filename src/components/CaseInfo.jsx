// src/components/CaseInfo.jsx

//Este componente puede manejar la información básica del caso

import PropTypes from 'prop-types';

function CaseInfo({ type, caseNumber, caseCreationDate, taskCreationDate, formatDateTime }) {
  const typeClass = type.toLowerCase();

  return (
    <div className="case-item-date">
      <h5>
        <p className={`type-pop ${typeClass}`}>{type}</p>
        <b>#{caseNumber}</b>
      </h5>
      <div>
        <p className='date-pop'><b>Creación Ticket:</b> {formatDateTime(caseCreationDate)}</p>
        <p className='date-pop'><b>Creación Tarea:</b> {formatDateTime(taskCreationDate)}</p>
      </div>
    </div>
  );
}

CaseInfo.propTypes = {
  type: PropTypes.string.isRequired,
  caseNumber: PropTypes.string.isRequired,
  caseCreationDate: PropTypes.instanceOf(Date).isRequired,
  taskCreationDate: PropTypes.instanceOf(Date).isRequired,
  formatDateTime: PropTypes.func.isRequired,
};

export default CaseInfo;
