import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { Animations } from '@shared/animations/animations';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';
import { AnimationEvent } from '@angular/animations';

@Component({
  selector: '[bioCollapsed],[bioExpanded]',
  template:
    '<div *ngIf="!bioCollapsed" @collapse (@collapse.start)="onCollapseStart($event)" (@collapse.done)="onCollapseDone($event)"><ng-content></ng-content></div>',
  styles: [':host.bio-collapsed-animating { overflow: hidden !important; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [Animations.collapse.collapse(), Animations.skipFirstAnimation()],
  host: { '[@skipFirstAnimation]': '' },
})
export class CollapseComponent {
  constructor(private renderer2: Renderer2, private elementRef: ElementRef) {}

  private _bioCollapsed = false;
  private _isRunning = 0;

  @Input()
  set bioExpanded(bioExpanded: BooleanInput) {
    this._bioCollapsed = !coerceBooleanProperty(bioExpanded);
  }

  @Input()
  get bioCollapsed(): boolean {
    return this._bioCollapsed;
  }
  set bioCollapsed(bioCollapsed: boolean) {
    this._bioCollapsed = coerceBooleanProperty(bioCollapsed);
  }

  @Output() readonly animationStart = new EventEmitter<AnimationEvent>();
  @Output() readonly animationDone = new EventEmitter<AnimationEvent>();

  onCollapseStart($event: AnimationEvent): void {
    this.renderer2.addClass(this.elementRef.nativeElement, 'bio-collapsed-animating');
    this.animationStart.emit($event);
    this._isRunning++;
  }

  onCollapseDone($event: AnimationEvent): void {
    this._isRunning = Math.max(this._isRunning - 1, 0);
    if (!this._isRunning) {
      this.renderer2.removeClass(this.elementRef.nativeElement, 'bio-collapsed-animating');
    }
    this.animationDone.emit($event);
  }

  static ngAcceptInputType_bioCollapsed: BooleanInput;
}
