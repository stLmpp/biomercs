import { ScorePlayerAdd, ScorePlayerVW } from './score-player';
import { ScoreStatusEnum } from '@model/enum/score-status.enum';
import { Stage } from '@model/stage';
import { PaginationMetaVW } from '@model/pagination';

export interface ScoreAdd {
  idPlatform: number;
  idGame: number;
  idMiniGame: number;
  idMode: number;
  idStage: number;
  score: number;
  maxCombo: number;
  time: string;
  dateAchieved?: Date;
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
  dateAchieved?: Date;
  status: ScoreStatusEnum;
  scorePlayers: ScorePlayerVW[];
  creationDate: Date;
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
