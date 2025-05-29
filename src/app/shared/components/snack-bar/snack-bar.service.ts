import { Injectable, Injector, inject } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { SnackBarComponent } from './snack-bar.component';
import { SNACK_BAR_DEFAULT_CONFIG, SnackBarConfig } from './snack-bar.config';
import { ComponentPortal } from '@angular/cdk/portal';
import { coerceArray } from 'st-utils';
import { take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SnackBarService {
  private overlay = inject(Overlay);
  private defaultSnackBarConfig = inject<SnackBarConfig>(SNACK_BAR_DEFAULT_CONFIG);
  private injector = inject(Injector);

  private _snackBarMap = new Map<string, SnackBarComponent>();

  open(title: string, _config?: Partial<SnackBarConfig>): SnackBarComponent {
    const config = new SnackBarConfig({ ...this.defaultSnackBarConfig, ..._config, message: title });
    const overlayRef = this.overlay.create(
      new OverlayConfig({
        hasBackdrop: false,
        positionStrategy: this.overlay.position().global().bottom('1rem').centerHorizontally(),
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        panelClass: [...coerceArray(config.panelClass ?? ''), 'snack-bar-container'],
        maxWidth: '90vw',
        minWidth: '300px',
      })
    );
    const parentInjector = config.viewContainerRef?.injector ?? this.injector;
    const injector = Injector.create({
      parent: parentInjector,
      providers: [
        { provide: SnackBarConfig, useValue: config },
        { provide: OverlayRef, useValue: overlayRef },
      ],
    });
    const componentPortal = new ComponentPortal(
      SnackBarComponent,
      config.viewContainerRef,
      injector,
      config.componentFactoryResolver
    );
    const componentRef = overlayRef.attach(componentPortal);
    componentRef.instance.actionObservable = config.actionObservable;
    componentRef.instance.action = config.action;
    componentRef.instance.message = config.message;
    componentRef.instance.showAction = config.showAction;
    componentRef.changeDetectorRef.markForCheck();
    this._snackBarMap.set(config.id, componentRef.instance);
    componentRef.instance.onClose$.pipe(take(1)).subscribe(() => {
      this._snackBarMap.delete(config.id);
    });
    return componentRef.instance;
  }

  close(id: string, withObservable = false): void {
    this.get(id)?.[!withObservable ? 'close' : 'closeWithObservable']();
  }

  closeAll(withObservable = false): void {
    const method = !withObservable ? 'close' : 'closeWithObservable';
    for (const [, snackBar] of this._snackBarMap) {
      snackBar[method]();
    }
  }

  get(id: string): SnackBarComponent | undefined {
    return this._snackBarMap.get(id);
  }
}
