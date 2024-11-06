// src/components/CaseList.jsx

import PropTypes from 'prop-types';
import CaseItem from './CaseItem.jsx';

function CaseList({ cases, removeCase, updateCase }) {
  return (
    <div className="case-list">
      {cases.length === 0 ? (
        <p>No hay casos disponibles.</p>
      ) : (
        cases.map((caseData) => (
          <CaseItem
            key={caseData.id}
            caseData={caseData}
            removeCase={removeCase}
            updateCase={updateCase} // Pasamos updateCase como prop a cada CaseItem
          />
        ))
      )}
    </div>
  );
}

CaseList.propTypes = {
  cases: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeCase: PropTypes.func.isRequired,
  updateCase: PropTypes.func.isRequired, // Añadimos updateCase como propType requerido
};

export default CaseList;
