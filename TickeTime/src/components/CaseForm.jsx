// src/components/CaseForm.jsx

import { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/CaseForm.css';

function CaseForm({ addCase }) {
  const [caseNumber, setCaseNumber] = useState('');
  const [type, setType] = useState('');
  const [caseCreationTime, setCaseCreationTime] = useState('');
  const [taskCreationTime, setTaskCreationTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones simples
    if (!caseNumber || !type || !caseCreationTime || !taskCreationTime) {
      alert('Por favor, completa todos los campos');
      return;
    }

    const newCase = {
      id: Date.now(),
      caseNumber,
      type,
      caseCreationTime,
      taskCreationTime,
      // Aquí puedes añadir más propiedades necesarias
    };

    addCase(newCase);

    // Limpiar el formulario
    setCaseNumber('');
    setType('');
    setCaseCreationTime('');
    setTaskCreationTime('');
  };

  return (
  <>
    <form onSubmit={handleSubmit} className="">
      <div className="containerDates">

        <div className="form-group">
          <label>Número de Caso</label>
          <input
            type="text"
            className="form-control"
            value={caseNumber}
            onChange={(e) => setCaseNumber(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Tipo</label>
          <select
            className="form-control"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Selecciona el tipo</option>
            <option value="Requerimiento">Requerimiento</option>
            <option value="Especial">Especial</option>
            <option value="Falla">Falla</option>
          </select>
        </div>
        <div className="form-group">
          <label>Hora de Creación del Caso</label>
          <input
            type="datetime-local"
            className="form-control"
            value={caseCreationTime}
            onChange={(e) => setCaseCreationTime(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Hora de Creación de la Tarea</label>
          <input
            type="datetime-local"
            className="form-control"
            value={taskCreationTime}
            onChange={(e) => setTaskCreationTime(e.target.value)}
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary mt-3">
        Agregar Caso
      </button>
    </form>
  </>
  );
}

// Agrega las PropTypes para validar los props del componente
CaseForm.propTypes = {
  addCase: PropTypes.func.isRequired,
};

export default CaseForm;
