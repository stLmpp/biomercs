import { Injectable, inject } from '@angular/core';
import { ModalRef } from '@shared/components/modal/modal-ref';
import type {
  ForumSubCategoryModeratorManagementComponent,
  ForumSubCategoryModeratorManagementComponentData,
} from '../forum-sub-category-moderator-management/forum-sub-category-moderator-management.component';
import { Moderator } from '@model/forum/moderator';
import { ModalService } from '@shared/components/modal/modal.service';

@Injectable({ providedIn: 'root' })
export class SubCategoryModeratorModalService {
  private modalService = inject(ModalService);

  async openModeratorManagement(
    data: ForumSubCategoryModeratorManagementComponentData
  ): Promise<
    ModalRef<
      ForumSubCategoryModeratorManagementComponent,
      ForumSubCategoryModeratorManagementComponentData,
      Moderator[]
    >
  > {
    return this.modalService.openLazy(
      () =>
        import('../forum-sub-category-moderator-management/forum-sub-category-moderator-management.component').then(
          m => m.ForumSubCategoryModeratorManagementComponent
        ),
      {
        width: 'clamp(300px, 60vw, 80vw)',
        data,
        module: () =>
          import('../forum-sub-category-moderator-management/forum-sub-category-moderator-management.module').then(
            m => m.ForumSubCategoryModeratorManagementModule
          ),
      }
    );
  }
}
