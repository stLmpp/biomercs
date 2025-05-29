import { Injectable, inject } from '@angular/core';
import { ModalService } from '@shared/components/modal/modal.service';
import type {
  ForumTopicPostReplyComponent,
  ForumTopicPostReplyComponentData,
} from '../forum-topic/forum-topic-post-reply/forum-topic-post-reply.component';
import { ModalRef } from '@shared/components/modal/modal-ref';

@Injectable({ providedIn: 'root' })
export class PostModalService {
  private modalService = inject(ModalService);


  async openReply(
    data: ForumTopicPostReplyComponentData
  ): Promise<ModalRef<ForumTopicPostReplyComponent, ForumTopicPostReplyComponentData>> {
    return this.modalService.openLazy(
      () =>
        import('../forum-topic/forum-topic-post-reply/forum-topic-post-reply.component').then(
          m => m.ForumTopicPostReplyComponent
        ),
      {
        width: '80vw',
        data,
        module: () =>
          import('../forum-topic/forum-topic-post-reply/forum-topic-post-reply.module').then(
            m => m.ForumTopicPostReplyModule
          ),
      }
    );
  }
}
