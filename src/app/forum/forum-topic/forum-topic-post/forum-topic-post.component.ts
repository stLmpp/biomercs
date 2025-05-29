import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, Output, inject } from '@angular/core';
import { Post, PostUpdateDto } from '@model/forum/post';
import { PlayerService } from '../../../player/player.service';
import { PostService } from '../../service/post.service';
import { combineLatest, finalize, map, ReplaySubject, tap } from 'rxjs';
import { Control, ControlGroup, Validators } from '@stlmpp/control';
import ClassicEditor from '@shared/ckeditor/ckeditor';
import { DialogService } from '@shared/components/modal/dialog/dialog.service';
import { TopicService } from '../../service/topic.service';
import { ActivatedRoute } from '@angular/router';
import { SimpleChangesCustom } from '@util/util';
import { ForumService } from '../../service/forum.service';

@Component({
  selector: 'bio-forum-topic-post',
  templateUrl: './forum-topic-post.component.html',
  styleUrls: ['./forum-topic-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumTopicPostComponent implements AfterViewInit, OnChanges {
  private playerService = inject(PlayerService);
  private postService = inject(PostService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private dialogService = inject(DialogService);
  private topicService = inject(TopicService);
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private activatedRoute = inject(ActivatedRoute);
  private forumService = inject(ForumService);


  private readonly _post$ = new ReplaySubject<Post>();

  @Input() idSubCategory!: number;
  @Input() post!: Post;
  @Input() topicLocked = false;
  @Input() @HostBinding('class.odd') odd = false;
  @Input() loadingReply = false;

  @Output() readonly postChange = new EventEmitter<Post>();
  @Output() readonly postDelete = new EventEmitter<Post>();
  @Output() readonly postQuote = new EventEmitter<Post>();
  @Output() readonly topicDelete = new EventEmitter<void>();

  readonly isOnline$ = combineLatest([this._post$, this.forumService.usersOnline$]).pipe(
    map(([post, usersOnline]) => usersOnline.some(user => user.idPlayer === post.idPlayer))
  );

  @HostBinding('class.highlight')
  get highlight(): boolean {
    return this.post.id === this._getFragment();
  }

  readonly editor = ClassicEditor;

  readonly form = new ControlGroup<Required<PostUpdateDto>>({
    name: new Control('', [Validators.required, Validators.maxLength(500)]),
    content: new Control('<p></p>', [Validators.required]),
  });

  readonly name$ = this.form.get('name').value$;

  editing = false;
  saving = false;

  private _getFragment(): number {
    return +(this.activatedRoute.snapshot.fragment ?? 0);
  }

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
      .update(this.idSubCategory, this.post.idTopic, this.post.id, postUpdateDto)
      .pipe(
        finalize(() => {
          this.saving = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(() => {
        this.postChange.emit({ ...this.post, ...postUpdateDto });
        this.closeEdit();
      });
  }

  delete(): void {
    if (this.post.firstPost) {
      this.dialogService.confirm({
        title: 'Delete topic?',
        content: `This action can't be undone`,
        buttons: [
          'Cancel',
          {
            title: 'Delete',
            action: () =>
              this.topicService.delete(this.idSubCategory, this.post.idTopic).pipe(
                tap(() => {
                  this.topicDelete.emit();
                })
              ),
          },
        ],
      });
    } else {
      this.dialogService.confirm({
        title: 'Delete post?',
        content: `This action can't be undone`,
        buttons: [
          'Cancel',
          {
            title: 'Delete',
            action: () =>
              this.postService.delete(this.idSubCategory, this.post.idTopic, this.post.id).pipe(
                tap(() => {
                  this.postDelete.emit(this.post);
                })
              ),
          },
        ],
      });
    }
  }

  ngAfterViewInit(): void {
    const idPost = this._getFragment();
    if (!idPost) {
      return;
    }
    if (idPost === this.post.id) {
      setTimeout(() => {
        this.elementRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }

  ngOnChanges(changes: SimpleChangesCustom<ForumTopicPostComponent>): void {
    if (changes.post?.currentValue) {
      this._post$.next(changes.post.currentValue);
    }
  }
}
