import { IdDescription } from '@model/id-description';

export enum ScoreWorldRecordTypeEnum {
  WorldRecord = 'World Record',
  CharacterWorldRecord = 'Character World Record',
  CombinationWorldRecord = 'Combination World Record',
}

export function getScoreWorldRecordTypes(): IdDescription[] {
  return [
    {
      id: 1,
      description: ScoreWorldRecordTypeEnum.WorldRecord,
    },
    {
      id: 2,
      description: ScoreWorldRecordTypeEnum.CharacterWorldRecord,
    },
    {
      id: 3,
      description: ScoreWorldRecordTypeEnum.CombinationWorldRecord,
    },
  ];
}
