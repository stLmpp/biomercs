import { ComponentFactoryResolver, InjectionToken, ViewContainerRef } from '@angular/core';
import { v4 } from 'uuid';
import { ScrollStrategy } from '@angular/cdk/overlay';
import { LazyFn } from '../../../core/dynamic-loader.service';

export class ModalConfig<D = any> {
  constructor(partial?: Partial<ModalConfig>) {
    Object.assign(this, partial);
  }

  id = v4();
  panelClass?: string | string[];
  hasBackdrop = true;
  backdropClass?: string | string[] = 'cdk-overlay-dark-backdrop';
  disableClose = false;
  width?: string | number;
  height?: string | number;
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string = '80vw';
  maxHeight?: number | string = '100%';
  data?: D | null = null;
  autoFocus = true;
  restoreFocus = true;
  scrollStrategy?: ScrollStrategy;
  viewContainerRef?: ViewContainerRef;
  componentFactoryResolver?: ComponentFactoryResolver;
}

export type ModalConfigLazy<D = any> = Partial<ModalConfig<D> & { module: LazyFn }>;

export const MODAL_DEFAULT_CONFIG = new InjectionToken<ModalConfig>('MODAL_DEFAULT_CONFIG');
export const MODAL_DATA = new InjectionToken<any>('MODAL_DATA');
export const MODAL_LAST_FOCUSED_ELEMENT = new InjectionToken<Element | null>('MODAL_LAST_FOCUSED_ELEMENT');
