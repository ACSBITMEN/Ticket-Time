// src/components/CaseList.jsx

import PropTypes from 'prop-types';
import CaseItem from './CaseItem';
import '../styles/CaseList.css';

function CaseList({ cases }) {
  return (
    <div className="case-list">
      {cases.length === 0 ? (
        <p>No hay casos registrados.</p>
      ) : (
        cases.map((caseData) => (
          <CaseItem key={caseData.id} caseData={caseData} />
        ))
      )}
    </div>
  );
}

CaseList.propTypes = {
  cases: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CaseList;
