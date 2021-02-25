export interface ScorePlayerAdd {
  idPlayer: number;
  idCharacterCostume: number;
  host?: boolean;
  bulletKills: number;
  description?: string;
  evidence: string;
}

export interface ScorePlayerVW {
  idScore: number;
  idPlayer: number;
  playerPersonaName: string;
  idPlatformGameMiniGameModeCharacterCostume: number;
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
