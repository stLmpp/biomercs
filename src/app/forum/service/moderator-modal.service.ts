import { Injectable, inject } from '@angular/core';
import { ModalService } from '@shared/components/modal/modal.service';
import { ModalRef } from '@shared/components/modal/modal-ref';
import type { ForumModeratorManagementComponent } from '../forum-moderator-management/forum-moderator-management.component';

@Injectable({ providedIn: 'root' })
export class ModeratorModalService {
  private modalService = inject(ModalService);


  management(): Promise<ModalRef<ForumModeratorManagementComponent>> {
    return this.modalService.openLazy(
      () =>
        import('../forum-moderator-management/forum-moderator-management.component').then(
          m => m.ForumModeratorManagementComponent
        ),
      {
        module: () =>
          import('../forum-moderator-management/forum-moderator-management.module').then(
            m => m.ForumModeratorManagementModule
          ),
        width: 'clamp(300px, 60vw, 80vw)',
      }
    );
  }
}
