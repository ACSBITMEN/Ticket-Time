// src/App.jsx

import { useState, useEffect } from 'react';
import CaseForm from './components/CaseForm';
import CaseList from './components/CaseList';
import './styles/App.css';
import { getCasesFromLocalStorage, saveCasesToLocalStorage } from './utils/localStorage';

function App() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const storedCases = getCasesFromLocalStorage();
    setCases(storedCases);
  }, []);

  const addCase = (newCase) => {
    const updatedCases = [...cases, newCase];
    setCases(updatedCases);
    saveCasesToLocalStorage(updatedCases);
  };

  return (
    <div className="container">
      <h1 className="text-center">Seguimiento a Tickets</h1>
      <CaseForm addCase={addCase} />
      <CaseList cases={cases} />
    </div>
  );
}

export default App;
