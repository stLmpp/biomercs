import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import ClassicEditor from '@shared/ckeditor/ckeditor';
import { Control, ControlGroup, Validators } from '@stlmpp/control';
import { Post, PostAddDto } from '@model/forum/post';
import { AuthQuery } from '../../../auth/auth.query';
import { PostService } from '../../service/post.service';
import { finalize } from 'rxjs';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { CKEditor5 } from '@ckeditor/ckeditor5-angular/ckeditor';
import { ModalRef } from '@shared/components/modal/modal-ref';

export interface ForumTopicPostReplyComponentData {
  idSubCategory: number;
  idTopic: number;
  topicName: string;
  quote?: Post;
}

@Component({
    selector: 'bio-forum-topic-post-reply',
    templateUrl: './forum-topic-post-reply.component.html',
    styleUrls: ['./forum-topic-post-reply.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ForumTopicPostReplyComponent {
  constructor(
    private modalRef: ModalRef<ForumTopicPostReplyComponent, ForumTopicPostReplyComponentData, Post>,
    @Inject(MODAL_DATA) { quote, topicName, idTopic, idSubCategory }: ForumTopicPostReplyComponentData,
    private authQuery: AuthQuery,
    private postService: PostService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this._idSubCategory = idSubCategory;
    this._idTopic = idTopic;
    this._topicName = topicName;
    this._quote = quote;
    const content = this._quote
      ? `<blockquote><h3>${this._quote.personaNamePlayer} wrote:</h3><hr/>${this._quote.content}</blockquote><p></p>`
      : '<p></p>';
    this.form = new ControlGroup<PostAddDto>({
      name: new Control(`RE: ${topicName}`, { validators: [Validators.required, Validators.maxLength(500)] }),
      content: new Control(content, { validators: [Validators.required] }),
      idTopic: new Control(idTopic),
    });
  }

  private readonly _idSubCategory: number;
  private readonly _idTopic: number;
  private readonly _topicName: string;
  private readonly _quote?: Post;
  readonly form: ControlGroup<PostAddDto>;
  readonly editor = ClassicEditor;

  saving = false;

  onCancel(): void {
    this.modalRef.close();
  }

  onSubmit(): void {
    this.saving = true;
    const dto = this.form.value;
    this.modalRef.disableClose = true;
    this.form.disable();
    this.postService
      .add(this._idSubCategory, this._idTopic, dto)
      .pipe(
        finalize(() => {
          this.saving = false;
          this.form.enable();
          this.modalRef.disableClose = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(post => {
        this.modalRef.close(post);
      });
  }

  onReady(editor: CKEditor5.Editor): void {
    setTimeout(() => {
      editor.editing.view.focus();
      editor.model.change((writer: any) => {
        writer.setSelection(writer.createPositionAt(editor.model.document.getRoot(), 'end'));
      });
    });
    setTimeout(() => {
      editor.ui.view.toolbar._behavior._updateGrouping();
    }, 250);
  }
}
