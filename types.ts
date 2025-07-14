
export enum Role {
  MAFIA = "Mafia",
  VETERAN = "Veterano",
  DOCTOR = "Médico",
  JESTER = "Payaso",
  VAMPIRE = "Vampiro",
  VAMPIRE_JOVEN = "Vampiro Joven",
  VAMPIRE_VIEJO = "Vampiro Viejo",
  WITCH = "Bruja",
  ESCORT = "Escort",
  BODYGUARD = "Guardaespaldas",
  SHERIFF = "Sheriff",
  TOWNSPEOPLE = "Pueblo"
}

export enum PlayerStatus {
  ALIVE = "Vivo",
  DEAD = "Muerto",
}

export enum GamePhase {
  SETUP = "SETUP",
  NIGHT = "NIGHT",
  DAY_ANNOUNCEMENT = "DAY_ANNOUNCEMENT",
  DAY_VOTE = "DAY_VOTE",
  GAME_OVER = "GAME_OVER",
}

export enum Faction {
  TOWN = "Pueblo",
  MAFIA = "Mafia",
  VAMPIRE = "Vampiros",
  NEUTRAL = "Neutral"
}

export type Screen = 'setup' | 'roles' | 'game';

export interface Player {
  id: string;
  name: string;
  role: Role;
  status: PlayerStatus;
  faction: Faction;
  isProtected: boolean;
  isBlocked: boolean;
  isAlerting: boolean;
  markedForLynch: boolean;
  abilityUses: { [key: string]: number };
  hasGun?: boolean; // For Sheriff check
  canBeRevived: boolean;
  convertedOnDay: number | null;
}

export interface NightAction {
    actorId: string;
    targetId: string | null;
    role: Role;
    type: 'KILL' | 'PROTECT' | 'BLOCK' | 'INVESTIGATE' | 'ALERT' | 'GUARD' | 'REVIVE' | 'CONVERT';
}