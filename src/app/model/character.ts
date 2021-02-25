import { Base } from './base';
import { CharacterCostume } from './character-costume';

export interface Character extends Base {
  name: string;
  characterCostumes: CharacterCostume[];
}
