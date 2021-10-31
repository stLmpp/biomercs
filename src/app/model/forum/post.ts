export interface Post {
  id: number;
  name: string;
  content: string;
  idTopic: number;
  idPlayer: number;
  deletedDate?: Date;
  personaNamePlayer: string;
  avatarPlayer?: string | null;
  postCount: number;
  idRegion: number;
  nameRegion: string;
  shortNameRegion: string;
  editAllowed: boolean;
  deleteAllowed: boolean;
  firstPost: boolean;
}

export interface PostUpdateDto {
  name?: string;
  content?: string;
}

export interface PostAddDto {
  name: string;
  content: string;
  idTopic: number;
}
