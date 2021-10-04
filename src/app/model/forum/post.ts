import { PostContent } from '@model/forum/post-content';

export interface Post {
  id: number;
  name: string;
  content: PostContent;
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
  content?: PostContent;
}
