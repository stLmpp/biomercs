import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { CategoryService } from '../service/category.service';
import { CategoryWithSubCategoriesAlt } from '@model/forum/category';
import { finalize } from 'rxjs';
import { trackById } from '@util/track-by';
import { TopicService } from '../service/topic.service';
import { LoadingComponent } from '../../shared/components/spinner/loading/loading.component';
import { ModalTitleDirective } from '../../shared/components/modal/modal-title.directive';
import { ModalContentDirective } from '../../shared/components/modal/modal-content.directive';
import { ListDirective, ListControlValue } from '../../shared/components/list/list.directive';
import { StControlCommonModule, StControlModelModule } from '@stlmpp/control';
import { ListItemComponent } from '../../shared/components/list/list-item.component';
import { ModalActionsDirective } from '../../shared/components/modal/modal-actions.directive';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ModalCloseDirective } from '../../shared/components/modal/modal-close.directive';

export interface ForumTopicTransferComponentData {
  idTopic: number;
  idSubCategory: number;
}

export interface ForumTopicTransferComponentResponse {
  pageSubCategory: number;
  idSubCategory: number;
}

@Component({
  selector: 'bio-forum-topic-transfer',
  templateUrl: './forum-topic-transfer.component.html',
  styleUrls: ['./forum-topic-transfer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LoadingComponent,
    ModalTitleDirective,
    ModalContentDirective,
    ListDirective,
    ListControlValue,
    StControlCommonModule,
    StControlModelModule,
    ListItemComponent,
    ModalActionsDirective,
    ButtonComponent,
    ModalCloseDirective,
  ],
})
export class ForumTopicTransferComponent implements OnInit {
  private modalRef =
    inject<ModalRef<ForumTopicTransferComponent, ForumTopicTransferComponentData, ForumTopicTransferComponentResponse>>(
      ModalRef
    );
  private categoryService = inject(CategoryService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private topicService = inject(TopicService);

  constructor() {
    const { idTopic, idSubCategory } = inject<ForumTopicTransferComponentData>(MODAL_DATA);
    this.idSubCategory = idSubCategory;
    this._idTopic = idTopic;
    this.idSubCategoryTo = idSubCategory;
  }

  private readonly _idTopic: number;

  readonly idSubCategory: number;

  loading = true;
  saving = false;
  categories: CategoryWithSubCategoriesAlt[] = [];
  idSubCategoryTo: number;

  readonly trackById = trackById;

  transfer(): void {
    this.saving = true;
    this.modalRef.disableClose = true;
    this.topicService
      .move(this.idSubCategory, this._idTopic, this.idSubCategoryTo)
      .pipe(
        finalize(() => {
          this.saving = false;
          this.modalRef.disableClose = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(pageSubCategory => {
        this.modalRef.close({ idSubCategory: this.idSubCategoryTo, pageSubCategory });
      });
  }

  ngOnInit(): void {
    this.categoryService
      .getAll()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(categories => {
        this.categories = categories;
      });
  }
}
