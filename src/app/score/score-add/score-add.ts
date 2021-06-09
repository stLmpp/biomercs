import { ControlBuilder, ControlGroup, Validators } from '@stlmpp/control';
import { ScorePlayerAdd } from '@model/score-player';
import { ScoreAdd } from '@model/score';

export function generateScorePlayerControlGroup(controlBuilder: ControlBuilder): ControlGroup<ScorePlayerAddForm> {
  return controlBuilder.group<ScorePlayerAddForm>({
    bulletKills: [0],
    description: ['', [Validators.required]],
    host: [false],
    idPlayer: [null, [Validators.required]],
    personaName: [''],
    evidence: ['', [Validators.required, Validators.url]],
    idCharacterCostume: [null, [Validators.required]],
  });
}

export interface ScorePlayerAddForm extends Omit<ScorePlayerAdd, 'idPlayer' | 'idCharacterCostume'> {
  personaName: string;
  idPlayer: number | null;
  idCharacterCostume: number | null;
}

export interface ScoreAddForm
  extends Omit<ScoreAdd, 'idGame' | 'idMiniGame' | 'idStage' | 'idMode' | 'idPlatform' | 'scorePlayers'> {
  idGame: number | null;
  idMiniGame: number | null;
  idMode: number | null;
  idPlatform: number | null;
  idStage: number | null;
  scorePlayers: ScorePlayerAddForm[];
}
