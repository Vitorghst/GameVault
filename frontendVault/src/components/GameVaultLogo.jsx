import React from "react";

const GameVaultLogo = ({ compact = false, className = "" }) => {
  return (
    <div className={`gv-logo ${compact ? "compact" : ""} ${className}`.trim()}>
      <span className="gv-logo-mark" aria-hidden="true">
        <span className="gv-logo-monogram">
          <span className="gv-logo-letter gv-logo-letter-g">G</span>
          <span className="gv-logo-letter gv-logo-letter-v">V</span>
        </span>
        <span className="gv-logo-beam" />
      </span>
      <span className="gv-logo-wordmark">
        <span className="gv-logo-wordmark-game">Game</span>
        <span className="gv-logo-wordmark-vault">Vault</span>
      </span>
    </div>
  );
};

export default GameVaultLogo;
