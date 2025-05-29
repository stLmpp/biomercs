import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { Control, ControlGroup, Validators } from '@stlmpp/control';
import { TopicAddDto } from '@model/forum/topic';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@shared/ckeditor/ckeditor';
import { TopicService } from '../service/topic.service';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { finalize } from 'rxjs';

@Component({
  selector: 'bio-forum-topic-new',
  templateUrl: './forum-topic-new.component.html',
  styleUrls: ['./forum-topic-new.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumTopicNewComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private topicService = inject(TopicService);
  private changeDetectorRef = inject(ChangeDetectorRef);


  readonly form = new ControlGroup<TopicAddDto>({
    name: new Control('', { validators: [Validators.required, Validators.maxLength(150)] }),
    content: new Control('<p></p>', { validators: [Validators.required] }),
  });

  readonly editor = ClassicEditor;

  saving = false;

  onGoBack(): void {
    this.router.navigate(['../../'], { relativeTo: this.activatedRoute }).then();
  }

  onSubmit(): void {
    const idSubCategory = +(this.activatedRoute.snapshot.paramMap.get(RouteParamEnum.idSubCategory) ?? -1);
    this.saving = true;
    const dto = this.form.value;
    this.form.disable();
    this.topicService
      .add(idSubCategory, dto)
      .pipe(
        finalize(() => {
          this.saving = false;
          this.form.enable();
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(response => {
        this.router
          .navigate(['../../../', response.page, 'topic', response.idTopic, 'page', 1], {
            relativeTo: this.activatedRoute,
          })
          .then();
      });
  }
}
