// src/components/SearchBar.jsx

import PropTypes from 'prop-types';
import '../styles/SearchBar.css';

function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="search-bar">
      <label htmlFor="searchTicket">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
        </svg>
      </label>
      <input
        id="searchTicket"
        type="text"
        placeholder="Buscar por #Ticket..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}

SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
};

export default SearchBar;
