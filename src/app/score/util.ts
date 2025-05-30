import { NgxCurrencyInputMode, NgxCurrencyConfig } from 'ngx-currency';
import { ColDef } from '@shared/components/table/col-def';
import { Score } from '@model/score';
import { formatNumber } from '@angular/common';
import { ScorePlayer } from '@model/score-player';
import { AuthDateFormatPipe } from '../auth/shared/auth-date-format.pipe';

export const scoreCurrencyMask: Partial<NgxCurrencyConfig> = {
  align: 'left',
  allowNegative: false,
  nullable: true,
  allowZero: true,
  inputMode: NgxCurrencyInputMode.Natural,
  precision: 0,
};

export function getScoreDefaultColDefs<T extends Score = Score>(authDateFormatPipe: AuthDateFormatPipe): ColDef<T>[] {
  return [
    { property: 'platformShortName', title: 'Platform', tooltip: 'platformName', width: '80px' },
    { property: 'gameShortName', title: 'Game', tooltip: 'gameName', width: '80px', orderBy: true },
    { property: 'miniGameName', title: 'Mini game', width: '250px', orderBy: true },
    { property: 'modeName', title: 'Mode', width: '80px', orderBy: true },
    { property: 'stageShortName', title: 'Stage', tooltip: 'stageName', width: '80px', orderBy: true },
    {
      property: 'score',
      title: 'Score',
      width: '150px',
      style: { justifyContent: 'flex-end', paddingRight: '1.25rem' },
      formatter: value => formatNumber(value as any, 'pt-BR', '1.0-0'),
      orderBy: true,
    },
    {
      property: 'creationDate',
      title: 'Creation date',
      width: '125px',
      formatter: value => authDateFormatPipe.transform(value as any),
      orderBy: true,
    },
    {
      property: 'lastUpdatedDate',
      title: 'Last updated date',
      width: '140px',
      formatter: value => authDateFormatPipe.transform(value as any),
      orderBy: true,
    },
    {
      property: 'scorePlayers',
      title: 'Player(s)',
      formatter: scorePlayers =>
        (scorePlayers as unknown as ScorePlayer[]).map(scorePlayer => scorePlayer.playerPersonaName).join(' | '),
      tooltip: true,
      tooltipPosition: 'left',
    },
  ];
}
