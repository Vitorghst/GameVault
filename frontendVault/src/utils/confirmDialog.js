import toast from 'react-hot-toast';

export const showConfirm = (message, onConfirm) => {
  // Previne múltiplos toasts abertos
  toast.dismiss(); // Fecha qualquer toast aberto antes
  
  toast.custom(
    (t) => (
      <div className={`confirm-toast ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
        <div className="confirm-icon">⚠️</div>
        <h4 className="confirm-title">Confirmar ação</h4>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button
            className="confirm-btn confirm-no"
            onClick={() => {
              toast.dismiss(t.id);
            }}
          >
            Não
          </button>
          <button
            className="confirm-btn confirm-yes"
            onClick={() => {
              toast.dismiss(t.id);
              // Pequeno delay para garantir que o toast feche antes da ação
              setTimeout(() => {
                onConfirm();
              }, 100);
            }}
          >
            Sim
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      position: 'top-center',
      // Evita que o toast seja fechado ao clicar fora
      className: 'confirm-toast-wrapper',
    }
  );
};