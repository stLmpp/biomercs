import { ScoreWorldRecordTypeEnum } from '@model/enum/score-world-record-type';

export interface ScoreWorldRecordHistoryDto {
  idPlatform: number;
  idGame: number;
  idMiniGame: number;
  idMode: number;
  idStage: number;
  idCharacterCostume?: number;
  fromDate?: Date;
  toDate?: Date;
  type: ScoreWorldRecordTypeEnum;
}
