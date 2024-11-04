// src/App.jsx

import { useState, useEffect } from 'react';
import CaseForm from './components/CaseForm';
import CaseList from './components/CaseList';
import FilterBar from './components/FilterBar';
import SearchBar from './components/SearchBar';
import CaseStats from './components/CaseStats';
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
  const [activeStat, setActiveStat] = useState(null); // Estado para la tarjeta activa de estadísticas

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

  // Función para manejar el clic en una tarjeta de estadísticas
  const handleStatClick = (type) => {
    if (activeStat === type) {
      setActiveStat(null); // Desactiva la tarjeta si ya está activa
      setFilterType(''); // Quita el filtro
    } else {
      setActiveStat(type); // Activa la tarjeta seleccionada
      setFilterType(type); // Aplica el filtro
    }
  };

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
        <h1 className="text-center">Tickets Time
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-ticket-perforated-fill" viewBox="0 0 16 16">
            <path d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 0 0 0 3 .5.5 0 0 1 .5.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 1 0 0-3A.5.5 0 0 1 0 6zm4-1v1h1v-1zm1 3v-1H4v1zm7 0v-1h-1v1zm-1-2h1v-1h-1zm-6 3H4v1h1zm7 1v-1h-1v1zm-7 1H4v1h1zm7 1v-1h-1v1zm-8 1v1h1v-1zm7 1h1v-1h-1z"/>
          </svg>
        </h1>
      </nav>
      <CaseForm addCase={addCase} existingCases={cases} />
      <CaseStats cases={cases} setFilterType={setFilterType} activeStat={activeStat} setActiveStat={setActiveStat} handleStatClick={handleStatClick} />
      <div className='containerFilters'>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <FilterBar
          filterType={filterType}
          setFilterType={setFilterType}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
      </div>
      <CaseList cases={displayedCases} removeCase={removeCase} />
    </div>
  );
}

export default App;
