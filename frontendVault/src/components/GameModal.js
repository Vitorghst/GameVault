import React, { useState } from 'react';

const GameModal = ({ game, isOpen, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    status: game?.status || 'quero jogar',
    hoursPlayed: game?.hoursPlayed || 0,
    achievements: game?.achievements || 0,
    personalRating: game?.personalRating || 0,
    notes: game?.notes || ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...game, ...formData });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{game?._id ? 'Editar Jogo' : 'Adicionar Jogo'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="jogando">Jogando</option>
              <option value="zerado">Zerado</option>
              <option value="abandonado">Abandonado</option>
              <option value="quero jogar">Quero Jogar</option>
              <option value="favorito">Favorito</option>
            </select>
          </div>

          <div className="form-group">
            <label>Horas Jogadas</label>
            <input
              type="number"
              min="0"
              value={formData.hoursPlayed}
              onChange={(e) => setFormData({...formData, hoursPlayed: parseInt(e.target.value) || 0})}
            />
          </div>

          <div className="form-group">
            <label>Conquistas</label>
            <input
              type="number"
              min="0"
              value={formData.achievements}
              onChange={(e) => setFormData({...formData, achievements: parseInt(e.target.value) || 0})}
            />
          </div>

          <div className="form-group">
            <label>Nota Pessoal (0-10)</label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.5"
              value={formData.personalRating}
              onChange={(e) => setFormData({...formData, personalRating: parseFloat(e.target.value) || 0})}
            />
          </div>

          <div className="form-group">
            <label>Anotações</label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Suas impressões sobre o jogo..."
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="save-btn">
              Salvar
            </button>
            {game?._id && (
              <button 
                type="button" 
                className="delete-btn"
                onClick={() => {
                  if (window.confirm('Remover jogo da coleção?')) {
                    onDelete(game._id);
                  }
                }}
              >
                Remover
              </button>
            )}
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GameModal;