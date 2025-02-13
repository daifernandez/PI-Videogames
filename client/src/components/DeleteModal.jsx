import React from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import './Styles/DeleteModal.css';

const DeleteModal = ({ isOpen, onClose, onDelete, itemName }) => {
  return (
    <div className={`delete-modal-overlay ${isOpen ? 'active' : ''}`}>
      <div className="delete-modal">
        <div className="delete-icon">
          <RiDeleteBinLine />
        </div>
        <div className="delete-content">
          <h2 className="delete-title">¿Eliminar {itemName}?</h2>
          <p className="delete-message">
            Esta acción no se puede deshacer. ¿Estás seguro que deseas eliminar este juego?
          </p>
          <div className="delete-buttons">
            <button 
              className="delete-button cancel-button" 
              onClick={onClose}
            >
              Cancelar
            </button>
            <button 
              className="delete-button" 
              onClick={onDelete}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal; 
