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
  scoreStatusDescription: string;
  idScoreStatus: number;
  scorePlayers: ScorePlayerVW[];
  creationDate: Date;
  lastUpdatedDate: Date | null;
  isWorldRecord: boolean;
  isCharacterWorldRecord: boolean;
  isCombinationWorldRecord: boolean;
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
  idCharacterCostume: number;
  characterName: string;
  characterCostumeName: string;
  characterCostumeShortName: string;
  scores: (ScoreVW | undefined)[];
}

export interface ScoreTableWorldRecordWithoutUndefined extends ScoreTableWorldRecord {
  scores: ScoreVW[];
}

export interface ScoreTopTableWorldRecordWithoutUndefined extends ScoreTopTableWorldRecord {
  scoreTables: ScoreTableWorldRecordWithoutUndefined[];
}

export const trackByScoreVW = trackByFactory<ScoreVW>('idScore');

export enum ScoreGatewayEvents {
  updateCountApprovals = 'updateCountApprovals',
}

export interface ScoreSearch {
  page: number;
  limit: number;
  idScoreStatus?: ScoreStatusEnum;
  worldRecord?: boolean | null | undefined;
  characterWorldRecord?: boolean | null | undefined;
  combinationWorldRecord?: boolean | null | undefined;
  score?: string | null | undefined;
  idPlatforms: number[] | null | undefined;
  idGames: number[] | null | undefined;
  idMiniGames: number[] | null | undefined;
  idModes: number[] | null | undefined;
  idStages: number[] | null | undefined;
  idCharacterCostumes: number[] | null | undefined;
  onlyMyScores?: boolean;
}
