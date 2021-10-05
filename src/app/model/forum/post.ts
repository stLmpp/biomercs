export interface Post {
  id: number;
  name: string;
  content: string;
  idTopic: number;
  idPlayer: number;
  deletedDate?: Date;
  personaNamePlayer: string;
  postCount: number;
  idRegion: number;
  nameRegion: string;
  shortNameRegion: string;
  editAllowed: boolean;
  deleteAllowed: boolean;
}

export interface PostUpdateDto {
  name?: string;
  content?: string;
}
