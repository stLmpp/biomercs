export interface SubCategoryModerator {
  id: number;
  idSubCategory: number;
  idModerator: number;
  idPlayer: number;
  playerPersonaName: string;
}

export interface SubCategoryAddAndDeleteDto {
  add: number[];
  delete: number[];
}
