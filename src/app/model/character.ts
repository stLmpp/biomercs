import { CharacterCostume } from './character-costume';

export interface Character {
  id: number;
  name: string;
}

export interface CharacterWithCharacterCostumes extends Character {
  characterCostumes: CharacterCostume[];
}
