// src/components/CaseForm.jsx

import { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/CaseForm.css';
import { parse } from 'date-fns';

function CaseForm({ addCase, existingCases }) {
  const [caseNumber, setCaseNumber] = useState('');
  const [type, setType] = useState('');

  // Función para obtener la fecha y hora actual en formato compatible con datetime-local
  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localTime = new Date(now.getTime() - offset * 60 * 1000);
    return localTime.toISOString().slice(0, 16);
  };

  const [caseCreationTime, setCaseCreationTime] = useState(getCurrentDateTime());
  const [taskCreationTime, setTaskCreationTime] = useState(getCurrentDateTime());

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones simples
    if (!caseNumber || !type || !caseCreationTime || !taskCreationTime) {
      alert('Por favor, completa todos los campos');
      return;
    }

  // Verificar si el número de caso ya existe
  const isDuplicate = existingCases.some(
    (caseItem) => caseItem.caseNumber.toLowerCase() === caseNumber.toLowerCase()
  );

  if (isDuplicate) {
    alert('Ticket Duplicado: El Número de Ticket ya existe.');
    return;
  }

    // Formato de fecha esperado
    const dateFormat = "yyyy-MM-dd'T'HH:mm";

    // Convertir las fechas ingresadas a objetos Date interpretados como hora local
    const caseCreationDate = parse(caseCreationTime, dateFormat, new Date());
    const taskCreationDate = parse(taskCreationTime, dateFormat, new Date());

    const newCase = {
      id: Date.now(),
      caseNumber,
      type,
      caseCreationTime: caseCreationDate.getTime(),
      taskCreationTime: taskCreationDate.getTime(),
      // Aquí puedes añadir más propiedades necesarias
    };

    addCase(newCase);

    // Limpiar el formulario (opcional)
    setCaseNumber('');
    setType('');
    setCaseCreationTime(getCurrentDateTime());
    setTaskCreationTime(getCurrentDateTime());
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="">
        <div className="containerDates">

          <div className="form-group">
            <label>Número de Ticket</label>
            <input
              placeholder="Ingresa #Ticket..."
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
          Agregar Ticket
        </button>
      </form>
    </>
  );
}

// Agrega las PropTypes para validar los props del componente
CaseForm.propTypes = {
  addCase: PropTypes.func.isRequired,
  existingCases: PropTypes.arrayOf(
    PropTypes.shape({
      caseNumber: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CaseForm;
