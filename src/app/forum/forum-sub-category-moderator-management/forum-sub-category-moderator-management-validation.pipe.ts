import { Pipe, PipeTransform } from '@angular/core';
import { SubCategoryModerator } from '@model/forum/sub-category-moderator';

@Pipe({ name: 'forumSubCategoryModeratorManagementValidation' })
export class ForumSubCategoryModeratorManagementValidationPipe implements PipeTransform {
  transform(subCategoryModeratorsSelected: SubCategoryModerator[]): boolean {
    return subCategoryModeratorsSelected.every(subCategoryModerator => subCategoryModerator.id > 0);
  }
}
