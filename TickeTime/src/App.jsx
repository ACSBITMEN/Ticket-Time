// src/App.jsx

import { useState, useEffect } from 'react';
import CaseForm from './components/CaseForm';
import CaseList from './components/CaseList';
import PropTypes from 'prop-types'; 

function App() {
  // Función para inicializar los casos desde localStorage
  const loadInitialCases = () => {
    const storedCases = localStorage.getItem('cases');
    if (storedCases) {
      return JSON.parse(storedCases).map((caseItem) => ({
        ...caseItem,
        caseCreationTime: Number(caseItem.caseCreationTime),
        taskCreationTime: Number(caseItem.taskCreationTime),
      }));
    }
    return [];
  };

  const [cases, setCases] = useState(loadInitialCases);

  // Guardar casos en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('cases', JSON.stringify(cases));
  }, [cases]);

  const addCase = (newCase) => {
    setCases([...cases, newCase]);
  };

  // **Añadir la función removeCase**
  const removeCase = (id) => {
    setCases((prevCases) => prevCases.filter((caseItem) => caseItem.id !== id));
  };

  return (
    <div className='container'>
      <nav>
        <h1 className="text-center">Seguimiento a Tickets</h1>
      </nav>
      <CaseForm addCase={addCase} />
      <CaseList cases={cases} removeCase={removeCase} />
    </div>
  );
}

// (Opcional) Definir PropTypes si `App` recibe props externas
App.propTypes = {
  // Define las props si las hay
};

export default App;
