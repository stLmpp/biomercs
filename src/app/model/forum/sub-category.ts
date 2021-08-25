import { Moderator } from '@model/forum/moderator';

export interface SubCategory {
  id: number;
  name: string;
  description: string;
  idCategory: number;
  order: number;
  deletedDate?: Date;
}

export interface SubCategoryWithModeratorsInfo extends SubCategory {
  moderators: Moderator[];
  playerPersonaNameLastPost?: string;
  idPlayerLastPost?: number;
  topicNameLastPost?: string;
  idTopicLastPost?: number;
  lastPostDate?: string;
  topicCount: number;
  postCount: number;
  hasNewPosts: boolean;
}

export interface SubCategoryAddDto {
  name: string;
  description: string;
  idCategory: number;
}

export interface SubCategoryUpdateDto {
  name: string | undefined;
  description: string | undefined;
  idCategory: number | undefined;
  deleted: boolean;
  restored: boolean;
}
