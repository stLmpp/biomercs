export interface ScorePlayerAdd {
  idPlayer: number;
  idCharacterCostume: number;
  host?: boolean;
  bulletKills: number;
  description?: string;
  evidence: string;
}

export interface ScorePlayer {
  id: number;
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

export interface ScorePlayerUpdateDto {
  id: number;
  host?: boolean;
  bulletKills?: number;
  description?: string;
  evidence?: string;
}
