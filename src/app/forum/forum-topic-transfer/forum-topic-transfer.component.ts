import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { CategoryService } from '../service/category.service';
import { CategoryWithSubCategories, CategoryWithSubCategoriesAlt } from '@model/forum/category';
import { finalize } from 'rxjs';
import { TopicService } from '../service/topic.service';
import { trackByFactory } from '@stlmpp/utils';
import { SubCategory } from '@model/forum/sub-category';

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
})
export class ForumTopicTransferComponent implements OnInit {
  constructor(
    @Inject(MODAL_DATA) { idTopic, idSubCategory }: ForumTopicTransferComponentData,
    private modalRef: ModalRef<
      ForumTopicTransferComponent,
      ForumTopicTransferComponentData,
      ForumTopicTransferComponentResponse
    >,
    private categoryService: CategoryService,
    private changeDetectorRef: ChangeDetectorRef,
    private topicService: TopicService
  ) {
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

  readonly trackBySubCategory = trackByFactory<SubCategory>('id');
  readonly trackByCategory = trackByFactory<CategoryWithSubCategories>('id');

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
