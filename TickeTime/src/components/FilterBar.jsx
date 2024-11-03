// src/components/FilterBar.jsx

import PropTypes from 'prop-types';
import '../styles/FilterBar.css';

function FilterBar({ filterType, setFilterType, sortOption, setSortOption }) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="filterType">Filtrar:</label>
        <select
          id="filterType"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="Requerimiento">Requerimiento</option>
          <option value="Especial">Especial</option>
          <option value="Falla">Falla</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sortOption">Ordenar por:</label>
        <select
          id="sortOption"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Selecciona</option>
          <option value="caseNumberAsc">Número de Ticket (Ascendente)</option>
          <option value="caseNumberDesc">Número de Ticket (Descendente)</option>
          <option value="creationTimeAsc">Fecha de Creación (Ascendente)</option>
          <option value="creationTimeDesc">Fecha de Creación (Descendente)</option>
        </select>
      </div>
    </div>
  );
}

FilterBar.propTypes = {
  filterType: PropTypes.string.isRequired,
  setFilterType: PropTypes.func.isRequired,
  sortOption: PropTypes.string.isRequired,
  setSortOption: PropTypes.func.isRequired,
};

export default FilterBar;
