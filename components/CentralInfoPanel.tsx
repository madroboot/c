import React from 'react';
import { Player, GamePhase, Role } from '../types';
import { ROLE_DETAILS, VAMPIRE_ROLES } from '../constants';

interface CentralInfoPanelProps {
  phase: GamePhase;
  activePlayer: Player | null;
  dayNumber: number;
  announcement: string;
  onVoteDecision: (decision: boolean) => void;
  onConfirmLynch: () => void;
  onEndDay: () => void;
  vampireAction: 'KILL' | 'CONVERT';
  sheriffResult: string | null;
  witchCanRevive: boolean;
  jesterWasLynched: boolean;
  onConfirmNightAction?: () => void;
  onSkipNightAction?: () => void;
  isTargetSelected?: boolean;
}

const CentralInfoPanel: React.FC<CentralInfoPanelProps> = ({
  phase,
  activePlayer,
  dayNumber,
  announcement,
  onVoteDecision,
  onConfirmLynch,
  onEndDay,
  vampireAction,
  sheriffResult,
  witchCanRevive,
  jesterWasLynched,
  onConfirmNightAction,
  onSkipNightAction,
  isTargetSelected,
}) => {
  const renderContent = () => {
    switch (phase) {
      case GamePhase.NIGHT:
        if (activePlayer) {
          const roleDetails = ROLE_DETAILS[activePlayer.role];
          let actionText = roleDetails.description;
          if(VAMPIRE_ROLES.includes(activePlayer.role)) {
              actionText = vampireAction === 'KILL' ? "Elige a quién matar." : "Elige a quién convertir.";
          }
          if(activePlayer.role === Role.JESTER && jesterWasLynched){
              actionText = "Has sido linchado. Elige a quién matar esta noche."
          }

          return (
            <div className="text-center flex flex-col justify-center items-center h-full">
              <div className="flex-grow flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold text-yellow-400">Turno de {activePlayer.name}</h2>
                <p className="text-4xl font-extrabold my-2">{activePlayer.role}</p>
                <p className="text-lg text-gray-300 mb-3">{actionText}</p>
                {activePlayer.role === Role.VETERAN && <p>Alertas restantes: <span className="font-bold text-xl">{activePlayer.abilityUses.alerts}</span></p>}
                {activePlayer.role === Role.DOCTOR && <p>Autocuraciones restantes: <span className="font-bold text-xl">{activePlayer.abilityUses.selfHeals}</span></p>}
                {activePlayer.role === Role.BODYGUARD && <p>Autoprotecciones restantes: <span className="font-bold text-xl">{activePlayer.abilityUses.selfGuards}</span></p>}
                {activePlayer.role === Role.SHERIFF && sheriffResult && <p className="mt-2 text-2xl text-cyan-400 animate-pulse">{sheriffResult}</p>}
              </div>
              
              <div className="w-full">
                {activePlayer.role === Role.VETERAN ? (
                    <div className="flex flex-col gap-2 items-center">
                        <button
                            onClick={onConfirmNightAction}
                            disabled={activePlayer.abilityUses.alerts <= 0}
                            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105"
                        >
                            Ponerse en Alerta
                        </button>
                        <button
                            onClick={onSkipNightAction}
                            className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg"
                        >
                            No hacer nada
                        </button>
                    </div>
                ) : activePlayer.role === Role.WITCH ? (
                    <div className="flex flex-col gap-2 items-center">
                        <p className="mb-2">Pociones restantes: <span className="font-bold text-xl">{activePlayer.abilityUses.revive}</span></p>
                        <button
                            onClick={onConfirmNightAction}
                            disabled={activePlayer.abilityUses.revive <= 0 || !witchCanRevive || !isTargetSelected}
                            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg text-lg"
                        >
                            Revivir Jugador
                        </button>
                        <button
                            onClick={onSkipNightAction}
                            className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg mt-2"
                        >
                            No hacer nada
                        </button>
                    </div>
                ) : onConfirmNightAction ? (
                    <button
                        onClick={onConfirmNightAction}
                        disabled={!isTargetSelected}
                        className="mt-4 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105"
                    >
                        Confirmar Acción
                    </button>
                ) : null}
              </div>
            </div>
          );
        }
        return null;
      
      case GamePhase.DAY_ANNOUNCEMENT:
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Amanecer - Día {dayNumber}</h2>
            <p className="text-xl text-gray-300 mb-6">{announcement}</p>
            <button onClick={() => onVoteDecision(true)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105">
              Ir a Votación
            </button>
          </div>
        );

      case GamePhase.DAY_VOTE:
        return (
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Votación</h2>
                <p className="text-xl text-gray-300 mb-6">Selecciona un jugador para linchar o termina el día.</p>
                <div className="flex justify-center gap-4">
                     <button onClick={onConfirmLynch} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105">
                        Confirmar Linchamiento
                    </button>
                    <button onClick={onEndDay} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105">
                        Terminar Día
                    </button>
                </div>
            </div>
        );
      
      case GamePhase.GAME_OVER:
        return (
          <div className="text-center">
            <h2 className="text-5xl font-bold text-yellow-500 mb-4">¡Partida Terminada!</h2>
            <p className="text-2xl text-gray-200">{announcement}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 max-w-xs max-h-xs bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center p-6 border-4 border-gray-700">
      <div className="w-full h-full flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default CentralInfoPanel;