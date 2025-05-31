import { ChangeDetectionStrategy, Component, Input, input } from '@angular/core';
import { Score } from '@model/score';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';
import { mdiAccountStar, mdiTrophy, mdiTrophyAward } from '@mdi/js';
import { trackById } from '@util/track-by';
import { IconMdiComponent } from '../../shared/components/icon/icon-mdi.component';
import { TooltipDirective } from '../../shared/components/tooltip/tooltip.directive';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { UrlPreviewComponent } from '../../shared/url-preview/url-preview.component';
import { AuthDateFormatPipe } from '../../auth/shared/auth-date-format.pipe';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'bio-score-info',
  templateUrl: './score-info.component.html',
  styleUrls: ['./score-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IconMdiComponent,
    TooltipDirective,
    ButtonComponent,
    RouterLink,
    IconComponent,
    UrlPreviewComponent,
    AuthDateFormatPipe,
    DecimalPipe,
  ],
})
export class ScoreInfoComponent {
  private _showWorldRecord = false;
  private _showApprovalDate = false;

  readonly score = input.required<Score>();

  @Input()
  get showWorldRecord(): boolean {
    return this._showWorldRecord;
  }
  set showWorldRecord(showWorldRecord: boolean) {
    this._showWorldRecord = coerceBooleanProperty(showWorldRecord);
  }

  @Input()
  get showApprovalDate(): boolean {
    return this._showApprovalDate;
  }

  set showApprovalDate(showApprovalDate: boolean) {
    this._showApprovalDate = coerceBooleanProperty(showApprovalDate);
  }

  readonly mdiTrophy = mdiTrophy;
  readonly mdiTrophyAward = mdiTrophyAward;
  readonly mdiAccountStar = mdiAccountStar;

  readonly trackById = trackById;

  static ngAcceptInputType_showWorldRecord: BooleanInput;
  static ngAcceptInputType_showApprovalDate: BooleanInput;
}
