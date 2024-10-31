// src/App.jsx
import { useState, useEffect } from 'react';
import CaseForm from './components/CaseForm';
import './styles/App.css';
import { getCasesFromLocalStorage, saveCasesToLocalStorage } from './utils/localStorage';

function App() {
  const [cases, setCases] = useState([]);

  // Al cargar el componente, obtenemos los casos almacenados en LocalStorage
  useEffect(() => {
    const storedCases = getCasesFromLocalStorage();
    setCases(storedCases);
  }, []);

  // Función para agregar un nuevo caso
  const addCase = (newCase) => {
    const updatedCases = [...cases, newCase];
    setCases(updatedCases);
    saveCasesToLocalStorage(updatedCases);
  };

  return (
    <div className="container">
      <h1 className="text-center">Seguimiento a Tickets</h1>
      <CaseForm addCase={addCase} />
      {/* Aquí posteriormente añadiremos la lista de casos */}
    </div>
  );
}

export default App;
