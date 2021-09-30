export interface Post {
  id: number;
  name: string;
  post: string;
  idTopic: number;
  idPlayer: number;
  deletedDate?: Date;
  personaNamePlayer: string;
  postCount: number;
  idRegionPlayer: number;
  nameRegionPlayer: string;
  shortNameRegionPlayer: string;
  editAllowed: boolean;
  deleteAllowed: boolean;
}
