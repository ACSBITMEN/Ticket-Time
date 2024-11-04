// src/components/CaseStats.jsx

import PropTypes from 'prop-types';
import '../styles/CaseStats.css';

function CaseStats({ cases, setFilterType, activeStat, setActiveStat }) {
  const totalCases = cases.length;
  const requerimientoCases = cases.filter(caseItem => caseItem.type === 'Requerimiento').length;
  const fallaCases = cases.filter(caseItem => caseItem.type === 'Falla').length;
  const especialCases = cases.filter(caseItem => caseItem.type === 'Especial').length;

  const handleStatClick = (type) => {
    if (activeStat === type) {
      setActiveStat(null); // Desactiva si ya está activa
      setFilterType(''); // Quita el filtro
    } else {
      setActiveStat(type); // Activa la tarjeta seleccionada
      setFilterType(type); // Aplica el filtro
    }
  };

  return (
    <div className="case-stats">
      <div
        className={`stat-card ${activeStat === null ? 'active' : ''}`}
        onClick={() => handleStatClick(null)}
      >
        <p>{totalCases}</p>
        <h3>Total</h3>
      </div>
      <div
        className={`stat-card ${activeStat === 'Falla' ? 'active' : ''}`}
        onClick={() => handleStatClick('Falla')}
      >
        <p>{fallaCases}</p>
        <h3>Fallas</h3>
      </div>
      <div
        className={`stat-card ${activeStat === 'Requerimiento' ? 'active' : ''}`}
        onClick={() => handleStatClick('Requerimiento')}
      >
        <p>{requerimientoCases}</p>
        <h3>Requerimientos</h3>
      </div>
      <div
        className={`stat-card ${activeStat === 'Especial' ? 'active' : ''}`}
        onClick={() => handleStatClick('Especial')}
      >
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
  activeStat: PropTypes.string,
  setActiveStat: PropTypes.func.isRequired,
};

export default CaseStats;
