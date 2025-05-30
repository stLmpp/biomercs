import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { Moderator } from '@model/forum/moderator';
import { SubCategoryModeratorService } from '../service/sub-category-moderator.service';
import { finalize, map, OperatorFunction } from 'rxjs';
import { SubCategoryModerator } from '@model/forum/sub-category-moderator';
import { trackById } from '@util/track-by';
import { ModeratorService } from '../service/moderator.service';
import { orderBy } from 'st-utils';
import { LoadingComponent } from '../../shared/components/spinner/loading/loading.component';
import { ModalTitleDirective } from '../../shared/components/modal/modal-title.directive';
import { ModalContentDirective } from '../../shared/components/modal/modal-content.directive';
import { MultiSelectComponent } from '../../shared/multi-select/multi-select.component';
import { ListDirective } from '../../shared/components/list/list.directive';
import { MultiSelectItemsComponent } from '../../shared/multi-select/multi-select-items.component';
import { LoadingDirective } from '../../shared/components/spinner/loading/loading.directive';
import { ListItemComponent } from '../../shared/components/list/list-item.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { PrefixDirective } from '../../shared/components/common/prefix.directive';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ListItemLineDirective } from '../../shared/components/list/list-item-line.directive';
import { ModalActionsDirective } from '../../shared/components/modal/modal-actions.directive';
import { ModalCloseDirective } from '../../shared/components/modal/modal-close.directive';
import { StUtilsArrayModule } from '@stlmpp/utils';
import { ForumSubCategoryModeratorManagementValidationPipe } from './forum-sub-category-moderator-management-validation.pipe';

let uid = -1;

export interface ForumSubCategoryModeratorManagementComponentData {
  idSubCategory: number;
  nameSubCategory: string;
}

@Component({
  selector: 'bio-forum-sub-category-moderator-management',
  templateUrl: './forum-sub-category-moderator-management.component.html',
  styleUrls: ['./forum-sub-category-moderator-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LoadingComponent,
    ModalTitleDirective,
    ModalContentDirective,
    MultiSelectComponent,
    ListDirective,
    MultiSelectItemsComponent,
    LoadingDirective,
    ListItemComponent,
    ButtonComponent,
    PrefixDirective,
    IconComponent,
    ListItemLineDirective,
    ModalActionsDirective,
    ModalCloseDirective,
    StUtilsArrayModule,
    ForumSubCategoryModeratorManagementValidationPipe,
  ],
})
export class ForumSubCategoryModeratorManagementComponent implements OnInit {
  private modalRef =
    inject<
      ModalRef<
        ForumSubCategoryModeratorManagementComponent,
        ForumSubCategoryModeratorManagementComponentData,
        Moderator[]
      >
    >(ModalRef);
  private subCategoryModeratorService = inject(SubCategoryModeratorService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private moderatorService = inject(ModeratorService);

  constructor() {
    const { idSubCategory, nameSubCategory } = inject<ForumSubCategoryModeratorManagementComponentData>(MODAL_DATA);
    this.idSubCategory = idSubCategory;
    this.nameSubCategory = nameSubCategory;
  }

  readonly idSubCategory: number;
  readonly nameSubCategory: string;
  readonly subCategoryModeratorsDeletedMap = new Map<number, number>();

  subCategoryModeratorsSelected: SubCategoryModerator[] = [];
  subCategoryModerators: SubCategoryModerator[] = [];
  subCategoryModeratorsSelectedSearch = '';

  loading = true;
  loadingModerators = false;
  saving = false;
  readonly trackById = trackById;

  private _mapModeratorsToSubCategoryModerators(): OperatorFunction<Moderator[], SubCategoryModerator[]> {
    return map(moderators =>
      moderators.map(moderator => {
        const id = this.subCategoryModeratorsDeletedMap.get(moderator.id);
        if (id) {
          this.subCategoryModeratorsDeletedMap.delete(moderator.id);
        }
        return {
          idPlayer: moderator.idPlayer,
          idModerator: moderator.id,
          playerPersonaName: moderator.playerPersonaName,
          id: id ?? uid--,
          idSubCategory: this.idSubCategory,
        };
      })
    );
  }

  private _getIdModeratorsSelected(): number[] {
    return this.subCategoryModeratorsSelected.map(subCategoryModerator => subCategoryModerator.idModerator);
  }

  onRemoveItem(subCategoryModerator: SubCategoryModerator): void {
    if (subCategoryModerator.id > 0) {
      this.subCategoryModeratorsDeletedMap.set(subCategoryModerator.idModerator, subCategoryModerator.id);
    }
    this.subCategoryModeratorsSelected = this.subCategoryModeratorsSelected.filter(
      _subCategoryModerator => _subCategoryModerator.id !== subCategoryModerator.id
    );
    this.subCategoryModerators = orderBy([...this.subCategoryModerators, subCategoryModerator], 'playerPersonaName');
  }

  onAllRemoved(): void {
    for (const moderator of this.subCategoryModeratorsSelected) {
      if (moderator.id > 0) {
        this.subCategoryModeratorsDeletedMap.set(moderator.idModerator, moderator.id);
      }
    }
    this.subCategoryModerators = orderBy(
      [...this.subCategoryModerators, ...this.subCategoryModeratorsSelected],
      'playerPersonaName'
    );
    this.subCategoryModeratorsSelected = [];
  }

  onSelectItem(subCategoryModerator: SubCategoryModerator): void {
    if (subCategoryModerator.id > 0) {
      this.subCategoryModeratorsDeletedMap.delete(subCategoryModerator.idModerator);
    }
    this.subCategoryModerators = this.subCategoryModerators.filter(
      _subCategoryModerator => _subCategoryModerator.id !== subCategoryModerator.id
    );
    this.subCategoryModeratorsSelected = orderBy(
      [...this.subCategoryModeratorsSelected, subCategoryModerator],
      'playerPersonaName'
    );
  }

  onAllSelected(): void {
    for (const moderator of this.subCategoryModerators) {
      if (moderator.id > 0) {
        this.subCategoryModeratorsDeletedMap.delete(moderator.idModerator);
      }
    }
    this.subCategoryModeratorsSelected = orderBy(
      [...this.subCategoryModeratorsSelected, ...this.subCategoryModerators],
      'playerPersonaName'
    );
    this.subCategoryModerators = [];
  }

  onSearch(term: string): void {
    if (term.length < 3) {
      this.subCategoryModerators = [];
      this.changeDetectorRef.markForCheck();
      return;
    }
    this.loadingModerators = true;
    this.moderatorService
      .search(term, this._getIdModeratorsSelected())
      .pipe(
        finalize(() => {
          this.loadingModerators = false;
          this.changeDetectorRef.markForCheck();
        }),
        this._mapModeratorsToSubCategoryModerators()
      )
      .subscribe(moderators => {
        this.subCategoryModerators = moderators;
      });
  }

  save(): void {
    this.saving = true;
    const add = this.subCategoryModeratorsSelected
      .filter(subCategoryModerator => subCategoryModerator.id < 0)
      .map(subCategoryModerator => subCategoryModerator.idModerator);
    this.subCategoryModeratorService
      .addAndDelete(this.idSubCategory, { delete: [...this.subCategoryModeratorsDeletedMap.values()], add })
      .pipe(
        finalize(() => {
          this.saving = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(subCategoryModerators => {
        this.modalRef.close(
          subCategoryModerators.map(({ idModerator, idPlayer, playerPersonaName }) => ({
            idPlayer,
            playerPersonaName,
            id: idModerator,
          }))
        );
      });
  }

  ngOnInit(): void {
    this.subCategoryModeratorService
      .getBySubCategory(this.idSubCategory)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(subCategoryModerators => {
        this.subCategoryModeratorsSelected = subCategoryModerators;
      });
  }
}
