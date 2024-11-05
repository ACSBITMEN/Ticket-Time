import Modal from 'react-modal';
import PropTypes from 'prop-types';

function ActionsModal({ isOpen, onRequestClose, onDelete }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirmación de Borrado"
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
      <h2>¿Quieres borrar el Ticket?</h2>
      <div className="modal-actions">
        <button onClick={onDelete} className="btn-confirm">
          Borrar Ticket
        </button>
        <button onClick={onRequestClose} className="btn-cancel">
          Cancelar
        </button>
      </div>
    </Modal>
  );
}

ActionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ActionsModal;
