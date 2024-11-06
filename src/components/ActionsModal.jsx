// src/components/ActionsModal.jsx

import Modal from 'react-modal';
import PropTypes from 'prop-types';
import '../styles/ActionsModal.css';

function ActionsModal({ isOpen, onRequestClose, onConfirm, actionType, scheduledFollowUp, setScheduledFollowUp }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={actionType === 'delete' ? 'Confirmación de Borrado' : 'Reprogramar Seguimiento'}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      {actionType === 'delete' ? (
        <>
          <h2>¿Quieres borrar el Ticket?</h2>
          <div className="modal-actions">
            <button onClick={onConfirm} className="btn-confirm">Borrar Ticket</button>
            <button onClick={onRequestClose} className="btn-cancel">Cancelar</button>
          </div>
        </>
      ) : (
        <>
          <h2>¿Quieres Reprogramar el seguimiento?</h2>
          <div className="form-group">
            <label htmlFor="scheduledFollowUp">Tiempo Programado</label>
            <input
              type="datetime-local"
              id="scheduledFollowUp"
              name="scheduledFollowUp"
              className="form-control"
              value={scheduledFollowUp}
              onChange={(e) => setScheduledFollowUp(e.target.value)}
              min={new Date().toISOString().slice(0, 16)} // Se deshabilitan las fechas en pasado
              required
            />
          </div>
          <div className="modal-actions scheduledFollowUp">
            <button onClick={onConfirm} className="btn-confirm">Reprogramar</button>
            <button onClick={onRequestClose} className="btn-cancel">Cancelar</button>
          </div>
        </>
      )}
    </Modal>
  );
}

ActionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  actionType: PropTypes.string.isRequired,
  scheduledFollowUp: PropTypes.string,
  setScheduledFollowUp: PropTypes.func,
};

export default ActionsModal;
