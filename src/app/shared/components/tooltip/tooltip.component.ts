import { ChangeDetectionStrategy, Component, HostListener, Input, ViewEncapsulation } from '@angular/core';
import { Nullable } from '../../type/nullable';
import { Animations } from '../../animations/animations';
import { Subject } from 'rxjs';
import { AnimationEvent } from '@angular/animations';

@Component({
  selector: 'bio-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'tooltip', '[@scaleIn]': '', '[@fadeInOut]': '' },
  animations: [Animations.scale.in(), Animations.fade.inOut()],
})
export class TooltipComponent {
  @Input() content!: Nullable<string | number>;

  readonly onAnimationEnd$ = new Subject<void>();

  @HostListener('@fadeInOut.done', ['$event'])
  onFadeInOutDone($event: AnimationEvent): void {
    if ($event.toState === 'void') {
      this.onAnimationEnd$.next();
      this.onAnimationEnd$.complete();
    }
  }
}
