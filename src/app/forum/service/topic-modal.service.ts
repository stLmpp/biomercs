import { Injectable, inject } from '@angular/core';
import { ModalService } from '@shared/components/modal/modal.service';
import { ModalRef } from '@shared/components/modal/modal-ref';
import type {
  ForumTopicTransferComponent,
  ForumTopicTransferComponentData,
  ForumTopicTransferComponentResponse,
} from '../forum-topic-transfer/forum-topic-transfer.component';

@Injectable({ providedIn: 'root' })
export class TopicModalService {
  private modalService = inject(ModalService);

  async openTransferModal(
    idSubCategory: number,
    idTopic: number
  ): Promise<
    ModalRef<ForumTopicTransferComponent, ForumTopicTransferComponentData, ForumTopicTransferComponentResponse>
  > {
    return this.modalService.openLazy(
      () => import('../forum-topic-transfer/forum-topic-transfer.component').then(m => m.ForumTopicTransferComponent),
      {
        width: '50vw',
        data: { idTopic, idSubCategory },
        module: () =>
          import('../forum-topic-transfer/forum-topic-transfer.module').then(m => m.ForumTopicTransferModule),
      }
    );
  }
}
