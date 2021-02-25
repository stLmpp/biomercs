import { AbstractComponent } from '../core/abstract-component';

export abstract class Select extends AbstractComponent {
  abstract value: any;
  abstract isSelected(value: any): boolean;
  abstract setViewValue(value: any): void;
  abstract setControlValue(value: any): void;
}
