import { trackByFactory } from '@stlmpp/utils';

export interface ScorePlayerAdd {
  idPlayer: number;
  idCharacterCostume: number;
  host?: boolean;
  bulletKills: number;
  description?: string;
  evidence: string;
}

export interface ScorePlayerVW {
  idScorePlayer: number;
  idScore: number;
  idPlayer: number;
  playerPersonaName: string;
  idPlatformGameMiniGameModeCharacterCostume: number;
  isCharacterWorldRecord: boolean;
  idCharacterCostume: number;
  characterCostumeName: string;
  characterCostumeShortName: string;
  idCharacter: number;
  characterName: string;
  host: boolean;
  bulletKills: number;
  description?: string;
  evidence: string;
}

export const trackByScorePlayerVW = trackByFactory<ScorePlayerVW>('idScorePlayer');
