// src/components/CaseList.jsx

import PropTypes from 'prop-types'; // Asegúrate de importar PropTypes
import CaseItem from './CaseItem.jsx';

function CaseList({ cases, removeCase }) {
  return (
    <div className="case-list">
      {cases.length === 0 ? (
        <p>No hay casos disponibles.</p>
      ) : (
        cases.map((caseData) => (
          <CaseItem key={caseData.id} caseData={caseData} removeCase={removeCase} />
        ))
      )}
    </div>
  );
}

CaseList.propTypes = {
  cases: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeCase: PropTypes.func.isRequired,
};

export default CaseList;