import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { Post, PostUpdateDto } from '@model/forum/post';
import { PlayerService } from '../../../player/player.service';
import { PostService } from '../../service/post.service';
import { finalize } from 'rxjs';
import { Control, ControlGroup, Validators } from '@stlmpp/control';
import ClassicEditor from '@shared/ckeditor/ckeditor';

@Component({
  selector: 'bio-forum-topic-post',
  templateUrl: './forum-topic-post.component.html',
  styleUrls: ['./forum-topic-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumTopicPostComponent {
  constructor(
    private playerService: PlayerService,
    private postService: PostService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  @Input() post!: Post;
  @Input() topicLocked = false;
  @Input() @HostBinding('class.odd') odd = false;

  @Output() readonly postChange = new EventEmitter<Post>();

  readonly editor = ClassicEditor;

  readonly form = new ControlGroup<Required<PostUpdateDto>>({
    name: new Control('', [Validators.required, Validators.maxLength(500)]),
    content: new Control('<p></p>', [Validators.required]),
  });

  readonly name$ = this.form.get('name').value$;

  editing = false;
  saving = false;

  openEdit(): void {
    this.form.setValue({ name: this.post.name, content: this.post.content });
    this.editing = true;
  }

  closeEdit(): void {
    this.editing = false;
    this.form.reset();
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }
    const postUpdateDto: PostUpdateDto = {};
    const { name, content } = this.form.controls;
    if (name.dirty) {
      postUpdateDto.name = name.value;
    }
    if (content.dirty) {
      postUpdateDto.content = content.value;
    }
    this.saving = true;
    this.postService
      .update(this.post.idTopic, this.post.id, postUpdateDto)
      .pipe(
        finalize(() => {
          this.saving = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(post => {
        this.postChange.emit(post);
        this.closeEdit();
      });
  }
}
