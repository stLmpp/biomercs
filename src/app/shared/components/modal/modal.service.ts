import {
  ElementRef,
  Inject,
  Injectable,
  Injector,
  OnDestroy,
  TemplateRef,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ModalRef } from './modal-ref';
import { MODAL_DATA, MODAL_DEFAULT_CONFIG, MODAL_LAST_FOCUSED_ELEMENT, ModalConfig } from './modal.config';
import { coerceArray } from '@angular/cdk/coercion';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { ModalComponent } from './modal.component';
import { DOCUMENT } from '@angular/common';
import { DynamicLoaderService, LazyFn } from '../../../core/dynamic-loader.service';

@Injectable()
export class ModalService implements OnDestroy {
  constructor(
    @Inject(MODAL_DEFAULT_CONFIG) private modalDefaultConfig: ModalConfig,
    private overlay: Overlay,
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document,
    private dynamicLoaderService: DynamicLoaderService
  ) {}

  private _modalMap = new Map<string, ModalRef>();

  private _mergeConfig<D = any>(config?: Partial<ModalConfig>): ModalConfig<D> {
    return new ModalConfig<D>({ ...this.modalDefaultConfig, ...config });
  }

  private _createOverlayConfig<D = any>(config: ModalConfig<D>): OverlayConfig {
    return new OverlayConfig({
      ...config,
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: config.scrollStrategy ?? this.overlay.scrollStrategies.block(),
      panelClass: [...coerceArray(config.panelClass ?? ''), 'modal-container'],
      backdropClass: [...coerceArray(config.backdropClass ?? ''), 'modal-backdrop'],
    });
  }

  private _createOverlayRef<D = any>(config: ModalConfig<D>): OverlayRef {
    return this.overlay.create(this._createOverlayConfig(config));
  }

  private _createContainerPortal<D = any>(
    config: ModalConfig<D>,
    overlayRef: OverlayRef,
    lastFocusedElement: Element | null,
    modalRef: ModalRef
  ): ComponentPortal<ModalComponent> {
    const injector = Injector.create({
      parent: config.viewContainerRef?.injector ?? this.injector,
      providers: [
        { provide: ModalConfig, useValue: config },
        { provide: OverlayRef, useValue: overlayRef },
        { provide: MODAL_LAST_FOCUSED_ELEMENT, useValue: lastFocusedElement },
        { provide: ModalRef, useValue: modalRef },
        { provide: MODAL_DATA, useValue: config.data },
      ],
    });
    return new ComponentPortal(ModalComponent, config.viewContainerRef, injector, config.componentFactoryResolver);
  }

  private _createComponentPortal<T = any, D = any>(
    component: Type<T>,
    config: ModalConfig<D>,
    injector: Injector
  ): ComponentPortal<T> {
    return new ComponentPortal<T>(component, config.viewContainerRef, injector, config.componentFactoryResolver);
  }

  private _createTemplatePortal<T = any, D = any>(
    template: TemplateRef<T>,
    modalRef: ModalRef,
    config: ModalConfig<D>,
    viewContainerRef: ViewContainerRef
  ): TemplatePortal<T> {
    return new TemplatePortal<T>(template, viewContainerRef, { $implicit: config.data, modalRef } as any);
  }

  open<T = any, D = any, R = any>(
    component: Type<T> | TemplateRef<T>,
    _config?: Partial<ModalConfig<D>>
  ): ModalRef<T, D, R> {
    const config = this._mergeConfig(_config);
    const overlayRef = this._createOverlayRef(config);
    const lastFocusedElement = this.document.activeElement;
    const modalRef = new ModalRef(config.id, overlayRef, config);
    const containerPortal = this._createContainerPortal(config, overlayRef, lastFocusedElement, modalRef);
    const containerRef = overlayRef.attach(containerPortal);
    if (component instanceof TemplateRef) {
      const templatePortal = this._createTemplatePortal(
        component,
        modalRef,
        config,
        config.viewContainerRef ?? containerRef.injector.get(ViewContainerRef)
      );
      containerRef.instance.attachTemplate(templatePortal);
    } else {
      const componentPortal = this._createComponentPortal(component, config, containerRef.injector);
      const componentRef = containerRef.instance.attachComponent(componentPortal);
      modalRef.componentInstance = componentRef.instance;
    }
    modalRef.data = config.data;
    this._modalMap.set(config.id, modalRef);
    modalRef.onClose$.subscribe(() => {
      this._modalMap.delete(config.id);
    });
    return modalRef;
  }

  async openLazy<T = any, D = any, R = any>(
    componentFn: LazyFn,
    config?: Partial<ModalConfig & { module: LazyFn }>
  ): Promise<ModalRef<T, D, R>> {
    if (config?.module) {
      await this.dynamicLoaderService.loadModule(config.module);
    }
    const component = await componentFn();
    return this.open(component, config);
  }

  findClosestModal(element: ElementRef<HTMLElement>): ModalRef | undefined {
    let parent = element.nativeElement.parentElement;
    while (!parent?.classList.contains('modal') && !parent?.hasAttribute('modal')) {
      parent = parent?.parentElement ?? null;
    }
    return this._modalMap.get(parent?.id);
  }

  close(id: string): void {
    this._modalMap.get(id)?.close();
  }

  closeAll(): void {
    for (const [, modalRef] of this._modalMap) {
      modalRef.close();
    }
  }

  getModalRefById(id: string): ModalRef | undefined {
    return this._modalMap.get(id);
  }

  ngOnDestroy(): void {
    this.closeAll();
  }
}
