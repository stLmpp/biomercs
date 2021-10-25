export interface Moderator {
  id: number;
  idPlayer: number;
  playerPersonaName: string;
}

export interface ModeratorWithInfo extends Moderator {
  deleteAllowed: boolean;
}

export interface ModeratorAddAndDeleteDto {
  add: number[];
  delete: number[];
}
