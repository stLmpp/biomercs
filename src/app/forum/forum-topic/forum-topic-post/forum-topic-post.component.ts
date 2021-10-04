import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output, ViewChild } from '@angular/core';
import { Post, PostUpdateDto } from '@model/forum/post';
import { PlayerService } from '../../../player/player.service';
import { QuillEditorComponent } from 'ngx-quill';
import { PostService } from '../../service/post.service';
import { finalize } from 'rxjs';
import { PostContent } from '@model/forum/post-content';
import { Control, ControlGroup, Validators } from '@stlmpp/control';

interface FormPostContent {
  name: string;
  content: Control<PostContent>;
}

@Component({
  selector: 'bio-forum-topic-post',
  templateUrl: './forum-topic-post.component.html',
  styleUrls: ['./forum-topic-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumTopicPostComponent {
  constructor(private playerService: PlayerService, private postService: PostService) {}

  @ViewChild(QuillEditorComponent) readonly quillEditorComponent!: QuillEditorComponent;

  @Input() post!: Post;
  @Input() topicLocked = false;
  @Input() @HostBinding('class.odd') odd = false;

  @Output() readonly postChange = new EventEmitter<Post>();

  readonly form = new ControlGroup<FormPostContent>({
    name: new Control('', [Validators.required, Validators.maxLength(500)]),
    content: new Control({ ops: [] }, [Validators.required]),
  });

  editing = false;
  postContentEdited: PostContent = { ops: [] };
  postNameEdited = '';
  saving = false;

  readonly quillModules = this.playerService.getMentionQuillModule({
    onSelect: (item, insertItem) =>
      this.playerService.quillMentionOnSelect(this.quillEditorComponent.quillEditor, item, insertItem),
  });

  openEdit(): void {
    this.form.setValue({ name: this.post.name, content: this.post.content });
    this.editing = true;
  }

  closeEdit(): void {
    this.form.reset();
    this.editing = false;
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
        })
      )
      .subscribe(post => {
        this.postChange.emit(post);
        this.closeEdit();
      });
  }
}
