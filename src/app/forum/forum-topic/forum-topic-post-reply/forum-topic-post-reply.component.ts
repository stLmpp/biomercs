import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import ClassicEditor from '@shared/ckeditor/ckeditor';
import { Control, ControlGroup, Validators } from '@stlmpp/control';
import { Post, PostAddDto } from '@model/forum/post';
import { AuthQuery } from '../../../auth/auth.query';
import { PostService } from '../../service/post.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'bio-forum-topic-post-reply',
  templateUrl: './forum-topic-post-reply.component.html',
  styleUrls: ['./forum-topic-post-reply.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumTopicPostReplyComponent implements OnInit {
  constructor(
    private authQuery: AuthQuery,
    private postService: PostService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  @Input() idTopic!: number;
  @Input() topicName!: string;

  @Output() readonly cancel = new EventEmitter<void>();
  @Output() readonly afterSubmit = new EventEmitter<Post>();

  readonly form = new ControlGroup<PostAddDto>({
    name: new Control('', { validators: [Validators.required, Validators.maxLength(500)], initialFocus: true }),
    content: new Control('<p></p>', [Validators.required]),
    idTopic: new Control(-1),
    idPlayer: new Control(this.authQuery.getUser()!.idPlayer!),
  });

  readonly editor = ClassicEditor;

  saving = false;

  onCancel(): void {
    this.cancel.emit();
  }

  onSubmit(): void {
    this.saving = true;
    const dto = this.form.value;
    this.form.disable();
    this.postService
      .add(this.idTopic, dto)
      .pipe(
        finalize(() => {
          this.saving = false;
          this.form.enable();
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(post => {
        this.afterSubmit.emit(post);
      });
  }

  ngOnInit(): void {
    this.form.patchValue({ idTopic: this.idTopic, name: `RE: ${this.topicName}` });
  }
}
