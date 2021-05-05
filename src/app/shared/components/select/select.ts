import { AbstractComponent } from '../core/abstract-component';
import { OptionComponent } from '@shared/components/select/option.component';

export abstract class Select extends AbstractComponent {
  abstract value: any;
  multiple = false;
  setControlValues?(values: any[]): void;
  abstract isSelected(options: OptionComponent): boolean;
  abstract setViewValue(value: any): void;
  abstract setControlValue(value: any): void;
}
