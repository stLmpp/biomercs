import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { Moderator } from '@model/forum/moderator';
import { SubCategoryModeratorService } from '../service/sub-category-moderator.service';
import { finalize, map, OperatorFunction } from 'rxjs';
import { SubCategoryModerator } from '@model/forum/sub-category-moderator';
import { trackById } from '@util/track-by';
import { ModeratorService } from '../service/moderator.service';
import { orderBy } from 'st-utils';

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
})
export class ForumSubCategoryModeratorManagementComponent implements OnInit {
  constructor(
    @Inject(MODAL_DATA) { nameSubCategory, idSubCategory }: ForumSubCategoryModeratorManagementComponentData,
    private modalRef: ModalRef<
      ForumSubCategoryModeratorManagementComponent,
      ForumSubCategoryModeratorManagementComponentData,
      Moderator[]
    >,
    private subCategoryModeratorService: SubCategoryModeratorService,
    private changeDetectorRef: ChangeDetectorRef,
    private moderatorService: ModeratorService
  ) {
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
