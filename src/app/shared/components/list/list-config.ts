import { ControlValue } from '@stlmpp/control';
import { v4 } from 'uuid';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { ListItemComponent } from './list-item.component';

export abstract class ListParentControl extends ControlValue {
  abstract focusManager?: FocusKeyManager<ListItemComponent>;
  id = v4();
  value: any;
  abstract onChange(value: any): void;
  abstract onTouched(): void;
}
