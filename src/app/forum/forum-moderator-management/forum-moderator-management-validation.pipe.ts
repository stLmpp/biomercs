import { Pipe, PipeTransform } from '@angular/core';
import { ModeratorWithInfo } from '@model/forum/moderator';

@Pipe({ name: 'forumModeratorManagementValidation' })
export class ForumModeratorManagementValidationPipe implements PipeTransform {
  transform(moderatorsSelected: ModeratorWithInfo[]): boolean {
    return moderatorsSelected.every(moderator => moderator.id > 0);
  }
}
