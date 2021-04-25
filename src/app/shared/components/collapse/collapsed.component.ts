import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { Animations } from '@shared/animations/animations';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
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
export class CollapsedComponent {
  constructor(private renderer2: Renderer2, private elementRef: ElementRef) {}

  private _bioCollapsed = false;

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
  }

  onCollapseDone($event: AnimationEvent): void {
    this.renderer2.removeClass(this.elementRef.nativeElement, 'bio-collapsed-animating');
    this.animationDone.emit($event);
  }

  static ngAcceptInpuType_bioCollapsed: BooleanInput;
}
