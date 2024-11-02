// src/App.jsx

import { useState, useEffect } from 'react';
import CaseForm from './components/CaseForm';
import CaseList from './components/CaseList';

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

  return (
    <div className='container'>
      <h1 className="text-center">Seguimiento a Tickets</h1>
      <CaseForm addCase={addCase} />
      <CaseList cases={cases} />
    </div>
  );
}

export default App;
