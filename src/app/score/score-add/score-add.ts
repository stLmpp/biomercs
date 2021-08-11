import { Control, ControlGroup, Validators } from '@stlmpp/control';
import { ScorePlayerAdd } from '@model/score-player';
import { ScoreAdd } from '@model/score';

export function generateScorePlayerControlGroup(
  partial?: Partial<ScorePlayerAddForm>
): ControlGroup<ScorePlayerAddForm> {
  return new ControlGroup<ScorePlayerAddForm>({
    bulletKills: new Control(partial?.bulletKills ?? 0),
    description: new Control(partial?.description ?? '', [Validators.required, Validators.maxLength(1000)]),
    host: new Control(partial?.host ?? false),
    idPlayer: new Control(partial?.idPlayer ?? null, [Validators.required]),
    idPlayerPersonaName: new Control(partial?.idPlayerPersonaName ?? null),
    personaName: new Control(partial?.personaName ?? ''),
    evidence: new Control(partial?.evidence ?? '', [Validators.required, Validators.url, Validators.maxLength(1000)]),
    idCharacterCostume: new Control(partial?.idCharacterCostume ?? null, [Validators.required]),
  });
}

export interface ScorePlayerAddForm extends Omit<ScorePlayerAdd, 'idPlayer' | 'idCharacterCostume'> {
  personaName: string;
  idPlayer: number | null;
  idPlayerPersonaName: string | null;
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
