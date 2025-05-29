import { ChangeDetectionStrategy, Component, ComponentRef, ElementRef, EmbeddedViewRef, HostBinding, HostListener, OnDestroy, OnInit, ViewEncapsulation, inject, viewChild } from '@angular/core';
import { CdkPortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { OverlayRef } from '@angular/cdk/overlay';
import { MODAL_LAST_FOCUSED_ELEMENT, ModalConfig } from './modal.config';
import { ConfigurableFocusTrap, ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
import { AnimationEvent } from '@angular/animations';
import { Animations } from '../../animations/animations';

@Component({
  selector: 'bio-modal',
  template: '<ng-template cdkPortalOutlet></ng-template>',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'modal', '[attr.modal]': `''`, '[@scaleIn]': '', '[@fadeOut]': '' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [Animations.scale.in(), Animations.fade.out(100)],
  imports: [CdkPortalOutlet],
})
export class ModalComponent<R = any> implements OnInit, OnDestroy {
  private modalConfig = inject(ModalConfig);
  private overlayRef = inject(OverlayRef);
  private lastFocusedElement = inject<Element | null>(MODAL_LAST_FOCUSED_ELEMENT);
  private configurableFocusTrapFactory = inject(ConfigurableFocusTrapFactory);
  private elementRef = inject(ElementRef);


  private _focusTrap?: ConfigurableFocusTrap;

  readonly portalOutlet = viewChild.required(CdkPortalOutlet);

  @HostBinding('attr.id') get id(): string {
    return this.modalConfig.id;
  }

  private async _initializeTrapFocus(): Promise<void> {
    this._focusTrap = this.configurableFocusTrapFactory.create(this.elementRef.nativeElement);
    if (this.modalConfig.autoFocus) {
      await this._focusTrap.focusInitialElementWhenReady();
    }
  }

  @HostListener('@fadeOut.done', ['$event'])
  onFadeOutAnimation($event: AnimationEvent): void {
    if ($event.toState === 'void') {
      this.overlayRef.dispose();
    }
  }

  attachTemplate<T>(templatePortal: TemplatePortal<T>): EmbeddedViewRef<T> {
    return this.portalOutlet().attachTemplatePortal(templatePortal);
  }

  attachComponent<T>(componentPortal: ComponentPortal<T>): ComponentRef<T> {
    return this.portalOutlet().attachComponentPortal(componentPortal);
  }

  async ngOnInit(): Promise<void> {
    await this._initializeTrapFocus();
  }

  ngOnDestroy(): void {
    if (this.modalConfig.restoreFocus) {
      (this.lastFocusedElement as HTMLElement)?.focus?.();
    }
    this._focusTrap?.destroy();
  }
}
