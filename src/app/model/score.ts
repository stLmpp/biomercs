import { ScorePlayerAdd, ScorePlayerUpdateDto, ScorePlayerVW } from './score-player';
import { ScoreStatusEnum } from '@model/enum/score-status.enum';
import { Stage } from '@model/stage';
import { PaginationMetaVW } from '@model/pagination';
import { trackByFactory } from '@stlmpp/utils';

export interface ScoreAdd {
  idPlatform: number;
  idGame: number;
  idMiniGame: number;
  idMode: number;
  idStage: number;
  score: number;
  maxCombo: number;
  time: string;
  scorePlayers: ScorePlayerAdd[];
}

export interface ScoreVW {
  idPlatformGameMiniGameModeStage: number;
  idPlatformGameMiniGameMode: number;
  idPlatformGameMiniGame: number;
  idGameMiniGame: number;
  idPlatform: number;
  platformName: string;
  platformShortName: string;
  idGame: number;
  gameName: string;
  gameShortName: string;
  idMiniGame: number;
  miniGameName: string;
  idScore: number;
  idStage: number;
  stageName: string;
  stageShortName: string;
  idMode: number;
  modeName: string;
  score: number;
  maxCombo: number;
  time: string;
  approvalDate?: Date;
  status: ScoreStatusEnum;
  scorePlayers: ScorePlayerVW[];
  creationDate: Date;
  lastUpdatedDate: Date | null;
  isWorldRecord: boolean;
  isCharacterWorldRecord: boolean;
  isCombinationWorldRecord: boolean;
  combinationWorldRecordEndDate: Date | null;
  worldRecordEndDate: Date | null;
}

export interface ScoreTableVW {
  idPlayer: number;
  personaName: string;
  total: number;
  position: number;
  scores: (ScoreVW | undefined)[];
}

export interface ScoreTopTableVW {
  stages: Stage[];
  scoreTables: ScoreTableVW[];
  meta: PaginationMetaVW;
}

export interface ScoreChangeRequestsFulfilDto {
  time?: string;
  score?: number;
  maxCombo?: number;
  scorePlayers: ScorePlayerUpdateDto[];
  idsScoreChangeRequests: number[];
}

export interface ScoreTopTableWorldRecord {
  stages: Stage[];
  scoreTables: ScoreTableWorldRecord[];
}

export interface ScoreTableWorldRecord {
  idCharacter: number;
  idCharacterCustome: number;
  characterName: string;
  characterCostumeName: string;
  characterCostumeShortName: string;
  scores: (ScoreVW | undefined)[];
}

export const trackByScoreVW = trackByFactory<ScoreVW>('idScore');
