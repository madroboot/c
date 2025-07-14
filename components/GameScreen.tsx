
import React, { useState } from 'react';
import { Player, GamePhase, Role, PlayerStatus } from '../types';
import PlayerCircle from './PlayerCircle';
import CentralInfoPanel from './CentralInfoPanel';
import { EyeOpenIcon, EyeClosedIcon } from './icons';

interface GameScreenProps {
  players: Player[];
  phase: GamePhase;
  activePlayerId: string | null;
  selectedTargetId: string | null;
  dayNumber: number;
  announcement: string;
  onPlayerSelect: (id: string) => void;
  onVoteDecision: (decision: boolean) => void;
  onConfirmLynch: () => void;
  onConfirmNightAction: () => void;
  onSkipNightAction: () => void;
  onGoToHome: () => void;
  onEndDay: () => void;
  vampireAction: 'KILL' | 'CONVERT';
  sheriffResult: string | null;
  jesterWasLynched: boolean;
}

const GameScreen: React.FC<GameScreenProps> = ({
  players,
  phase,
  activePlayerId,
  selectedTargetId,
  dayNumber,
  announcement,
  onPlayerSelect,
  onVoteDecision,
  onConfirmLynch,
  onConfirmNightAction,
  onSkipNightAction,
  onGoToHome,
  onEndDay,
  vampireAction,
  sheriffResult,
  jesterWasLynched,
}) => {
  const [showRoles, setShowRoles] = useState(true);
  const containerSize = 450; // A fixed size for the main board area in pixels
  const radius = containerSize * 0.8;
  const numPlayers = players.length;

  const activePlayer = players.find(p => p.id === activePlayerId) || null;

  const isTargetingPhase = phase === GamePhase.NIGHT || phase === GamePhase.DAY_VOTE;
  
  const getTargetablePlayers = () => {
    if(!activePlayer) return players.map(p => p.id);

    // Witch can only target players who are already dead AND are marked as revivable
    if (activePlayer.role === Role.WITCH) {
        return players.filter(p => p.status === PlayerStatus.DEAD && p.canBeRevived).map(p => p.id);
    }
     // Jester can only target alive players
    if (activePlayer.role === Role.JESTER && jesterWasLynched) {
        return players.filter(p => p.status === PlayerStatus.ALIVE).map(p => p.id);
    }
    // Default: target alive players
    return players.filter(p => p.status === PlayerStatus.ALIVE).map(p => p.id);
  }

  const targetablePlayerIds = new Set(getTargetablePlayers());
  
  const witchCanRevive = activePlayer?.role === Role.WITCH && players.some(p => p.status === PlayerStatus.DEAD && p.canBeRevived);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-900 overflow-hidden relative">
        <div className="absolute top-4 left-4 flex items-center gap-4 z-10">
            <button 
                onClick={onGoToHome}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                Volver al Inicio
            </button>
            <button
                onClick={() => setShowRoles(prev => !prev)}
                className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                aria-label={showRoles ? 'Ocultar roles' : 'Mostrar roles'}
            >
                {showRoles ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </button>
        </div>
        <div className="relative" style={{ width: `${containerSize * 2}px`, height: `${containerSize * 2}px` }}>
            {players.map((player, index) => {
              const angle = (index / numPlayers) * 2 * Math.PI - Math.PI / 2; // Start from top
              const x = containerSize + radius * Math.cos(angle);
              const y = containerSize + radius * Math.sin(angle);
              
              return (
                <PlayerCircle
                  key={player.id}
                  player={player}
                  position={{ top: `${y}px`, left: `${x}px` }}
                  isActive={player.id === activePlayerId}
                  isSelectedTarget={player.id === selectedTargetId}
                  onSelect={onPlayerSelect}
                  isTargetable={isTargetingPhase && targetablePlayerIds.has(player.id)}
                  showRole={showRoles}
                />
              );
            })}
            <CentralInfoPanel
              phase={phase}
              activePlayer={activePlayer}
              dayNumber={dayNumber}
              announcement={announcement}
              onVoteDecision={onVoteDecision}
              onConfirmLynch={onConfirmLynch}
              onConfirmNightAction={onConfirmNightAction}
              onSkipNightAction={onSkipNightAction}
              isTargetSelected={selectedTargetId !== null}
              onEndDay={onEndDay}
              vampireAction={vampireAction}
              sheriffResult={sheriffResult}
              witchCanRevive={witchCanRevive}
              jesterWasLynched={jesterWasLynched}
            />
        </div>
    </div>
  );
};

export default GameScreen;