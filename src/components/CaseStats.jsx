// src/components/CaseStats.jsx

import PropTypes from 'prop-types';
import '../styles/CaseStats.css';

function CaseStats({ cases, setFilterType }) {
  const totalCases = cases.length;
  const requerimientoCases = cases.filter(caseItem => caseItem.type === 'Requerimiento').length;
  const fallaCases = cases.filter(caseItem => caseItem.type === 'Falla').length;
  const especialCases = cases.filter(caseItem => caseItem.type === 'Especial').length;

  return (
    <div className="case-stats">
      <div className="stat-card" onClick={() => setFilterType('')}>
        <p>{totalCases}</p>
        <h3>Total</h3>
      </div>
      <div className="stat-card" onClick={() => setFilterType('Falla')}>
        <p>{fallaCases}</p>
        <h3>Fallas</h3>
      </div>
      <div className="stat-card" onClick={() => setFilterType('Requerimiento')}>
        <p>{requerimientoCases}</p>
        <h3>Requerimientos</h3>
      </div>
      <div className="stat-card" onClick={() => setFilterType('Especial')}>
        <p>{especialCases}</p>
        <h3>Especiales</h3>
      </div>
    </div>
  );
}

CaseStats.propTypes = {
  cases: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      staticTimes: PropTypes.shape({
        caseExpirationTime: PropTypes.number,
      }),
    })
  ).isRequired,
  setFilterType: PropTypes.func.isRequired,
};

export default CaseStats;
