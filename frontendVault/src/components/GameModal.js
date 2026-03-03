import React, { useState, useEffect } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
const GameModal = ({ game, isOpen, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    status: game?.status || "quero jogar",
    hoursPlayed: game?.hoursPlayed || 0,
    achievements: game?.achievements || 0,
    personalRating: game?.personalRating || 0,
    notes: game?.notes || "",
  });

  useEffect(() => {
  if (game) {
    setFormData({
      status: game.status || "quero jogar",
      hoursPlayed: game.hoursPlayed || 0,
      achievements: game.achievements || 0,
      personalRating: game.personalRating || 0,
      notes: game.notes || "",
    });
  }
}, [game]);

  console.log(game)

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...game, ...formData });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="edit-add">
          <div style={{ padding: '0px 8px 0px 0px'}}>
            <h2>{game?._id ? "Editar Jogo" : "Adicionar Jogo"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
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
                  type="text"
                  min="0"
                  value={formData.hoursPlayed}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hoursPlayed: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Conquistas</label>
                <input
                  type="text"
                  min="0"
                  value={formData.achievements}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      achievements: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Avaliação (0-5 estrelas)</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const rating = formData.personalRating;

                    const isFull = star <= Math.floor(rating);
                    const isHalf =
                      star === Math.ceil(rating) && rating % 1 !== 0;

                    const handleClick = () => {
                      // Se a estrela clicada é maior que a avaliação atual
                      if (star > rating) {
                        // Se não tem avaliação ou está em meia, coloca meia
                        if (rating === 0 || rating % 1 !== 0) {
                          setFormData({ ...formData, personalRating: star });
                        } else {
                          setFormData({
                            ...formData,
                            personalRating: star - 0.5,
                          });
                        }
                      }
                      // Se clicou na mesma estrela
                      else if (star === Math.ceil(rating)) {
                        if (rating % 1 === 0) {
                          // Se é cheia, vira meia
                          setFormData({
                            ...formData,
                            personalRating: star - 0.5,
                          });
                        } else {
                          // Se é meia, mantém ou avança
                          setFormData({ ...formData, personalRating: star });
                        }
                      }
                      // Se clicou em estrela menor
                      else if (star < rating) {
                        setFormData({ ...formData, personalRating: star });
                      }
                    };

                    return (
                      <span
                        key={star}
                        className={`star ${isFull ? "full" : ""} ${isHalf ? "half" : ""}`}
                        onClick={handleClick}
                      >
                        ★
                      </span>
                    );
                  })}
                  <span className="rating-value">
                    {formData.personalRating.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>Anotações</label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Suas impressões sobre o jogo..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={onClose}>
                  Cancelar
                </button>

                <button type="submit" className="save-btn">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModal;
