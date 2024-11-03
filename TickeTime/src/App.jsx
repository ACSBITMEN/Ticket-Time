// src/App.jsx

import { useState, useEffect } from 'react';
import CaseForm from './components/CaseForm';
import CaseList from './components/CaseList';
import FilterBar from './components/FilterBar';
import SearchBar from './components/SearchBar';
import PropTypes from 'prop-types'; 
import './styles/App.css'; // Asegúrate de tener estilos globales si es necesario

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

  // Añadir la función removeCase
  const removeCase = (id) => {
    setCases((prevCases) => prevCases.filter((caseItem) => caseItem.id !== id));
  };

  // Estados para filtrado y ordenamiento
  const [filterType, setFilterType] = useState('');
  const [sortOption, setSortOption] = useState('');

  // Estado para búsqueda
  const [searchQuery, setSearchQuery] = useState('');

  // Función para filtrar, buscar y ordenar casos
  const getFilteredSortedCases = () => {
    let filteredCases = [...cases];

    // Filtrado por tipo
    if (filterType) {
      filteredCases = filteredCases.filter((caseItem) => caseItem.type === filterType);
    }

    // Búsqueda por número de caso
    if (searchQuery) {
      filteredCases = filteredCases.filter((caseItem) =>
        caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Ordenamiento
    switch (sortOption) {
      case 'caseNumberAsc':
        filteredCases.sort((a, b) => a.caseNumber.localeCompare(b.caseNumber));
        break;
      case 'caseNumberDesc':
        filteredCases.sort((a, b) => b.caseNumber.localeCompare(a.caseNumber));
        break;
      case 'creationTimeAsc':
        filteredCases.sort((a, b) => a.caseCreationTime - b.caseCreationTime);
        break;
      case 'creationTimeDesc':
        filteredCases.sort((a, b) => b.caseCreationTime - a.caseCreationTime);
        break;
      default:
        break;
    }

    return filteredCases;
  };

  const displayedCases = getFilteredSortedCases();

  return (
    <div className='container'>
      <nav>
        <h1 className="text-center">Seguimiento a Tickets</h1>
      </nav>
      <CaseForm addCase={addCase} />
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <FilterBar
        filterType={filterType}
        setFilterType={setFilterType}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
      {/* **Cambiar aquí para pasar los casos filtrados y ordenados** */}
      <CaseList cases={displayedCases} removeCase={removeCase} />
    </div>
  );
}

// (Opcional) Definir PropTypes si `App` recibe props externas
App.propTypes = {
  // Define las props si las hay
};

export default App;
