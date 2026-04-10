import React, { useState, useEffect } from "react";
import { FaClock, FaGamepad, FaStar, FaTimes, FaTrash, FaTrophy } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const GameModal = ({ game, isOpen, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    status: game?.status || "quero jogar",
    hoursPlayed: game?.hoursPlayed || 0,
    achievements: game?.achievements || 0,
    personalRating: game?.personalRating || 0,
    notes: game?.notes || "",
  });
  const [numericInputs, setNumericInputs] = useState({
    hoursPlayed: String(game?.hoursPlayed ?? 0),
    achievements: String(game?.achievements ?? 0),
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
      setNumericInputs({
        hoursPlayed: String(game.hoursPlayed ?? 0),
        achievements: String(game.achievements ?? 0),
      });
    }
  }, [game]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...game,
      ...formData,
      hoursPlayed: numericInputs.hoursPlayed === "" ? 0 : parseInt(numericInputs.hoursPlayed, 10) || 0,
      achievements: numericInputs.achievements === "" ? 0 : parseInt(numericInputs.achievements, 10) || 0,
    });
  };

  const handleNumericChange = (field, value) => {
    if (!/^\d*$/.test(value)) {
      return;
    }

    setNumericInputs((previous) => ({
      ...previous,
      [field]: value,
    }));

    setFormData((previous) => ({
      ...previous,
      [field]: value === "" ? 0 : parseInt(value, 10) || 0,
    }));
  };

  const handleStepChange = (field, delta) => {
    const currentValue = numericInputs[field] === "" ? 0 : parseInt(numericInputs[field], 10) || 0;
    const nextValue = Math.max(0, currentValue + delta);

    setNumericInputs((previous) => ({
      ...previous,
      [field]: String(nextValue),
    }));

    setFormData((previous) => ({
      ...previous,
      [field]: nextValue,
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="edit-add">
          <div className="modal-shell">
            <div className="modal-header-block">
              <div className="modal-game-preview">
                <div className="modal-game-preview-cover">
                  <img
                    src={
                      game?.cover?.url?.replace("t_thumb", "t_cover_big") ||
                      game?.cover ||
                      "https://via.placeholder.com/160x200?text=No+Image"
                    }
                    alt={game?.name || "Jogo"}
                  />
                </div>
                <div className="modal-game-preview-content">
                  <span className="modal-kicker">
                    {game?._id ? "Ajuste seu progresso" : "Novo item no cofre"}
                  </span>
                  <h2>{game?._id ? "Editar jogo" : "Adicionar jogo"}</h2>
                  <p className="modal-game-title">{game?.name || "Seu jogo"}</p>
                  <div className="modal-quick-stats">
                    <span><FaGamepad /> {formData.status}</span>
                    <span><FaClock /> {formData.hoursPlayed}h</span>
                    <span><FaTrophy /> {formData.achievements}</span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-form-grid">
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
                  <label>Horas jogadas</label>
                  <div className="number-input-shell">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={numericInputs.hoursPlayed}
                      onChange={(e) => handleNumericChange("hoursPlayed", e.target.value)}
                      placeholder="0"
                    />
                    <div className="number-stepper">
                      <button
                        type="button"
                        className="number-step-btn"
                        onClick={() => handleStepChange("hoursPlayed", 1)}
                        aria-label="Aumentar horas jogadas"
                      >
                        <FiChevronUp />
                      </button>
                      <button
                        type="button"
                        className="number-step-btn"
                        onClick={() => handleStepChange("hoursPlayed", -1)}
                        aria-label="Diminuir horas jogadas"
                      >
                        <FiChevronDown />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Conquistas</label>
                  <div className="number-input-shell">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={numericInputs.achievements}
                      onChange={(e) => handleNumericChange("achievements", e.target.value)}
                      placeholder="0"
                    />
                    <div className="number-stepper">
                      <button
                        type="button"
                        className="number-step-btn"
                        onClick={() => handleStepChange("achievements", 1)}
                        aria-label="Aumentar conquistas"
                      >
                        <FiChevronUp />
                      </button>
                      <button
                        type="button"
                        className="number-step-btn"
                        onClick={() => handleStepChange("achievements", -1)}
                        aria-label="Diminuir conquistas"
                      >
                        <FiChevronDown />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Minha nota</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const rating = formData.personalRating;
                      const isFull = star <= Math.floor(rating);
                      const isHalf =
                        star === Math.ceil(rating) && rating % 1 !== 0;

                      const handleClick = () => {
                        if (star > rating) {
                          if (rating === 0 || rating % 1 !== 0) {
                            setFormData({ ...formData, personalRating: star });
                          } else {
                            setFormData({
                              ...formData,
                              personalRating: star - 0.5,
                            });
                          }
                        } else if (star === Math.ceil(rating)) {
                          if (rating % 1 === 0) {
                            setFormData({
                              ...formData,
                              personalRating: star - 0.5,
                            });
                          } else {
                            setFormData({ ...formData, personalRating: star });
                          }
                        } else if (star < rating) {
                          setFormData({ ...formData, personalRating: star });
                        }
                      };

                      return (
                        <button
                          key={star}
                          type="button"
                          className={`star ${isFull ? "full" : ""} ${isHalf ? "half" : ""}`}
                          onClick={handleClick}
                        >
                          ★
                        </button>
                      );
                    })}
                    <span className="rating-value">
                      <FaStar />
                      {formData.personalRating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Anotações</label>
                <textarea
                  rows="4"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="O que você achou do jogo, onde parou, o que quer lembrar depois..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={onClose}>
                  Cancelar
                </button>

                <button type="submit" className="save-btn">
                  Salvar alterações
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
