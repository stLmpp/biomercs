import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParamsComponent } from './params.component';
import { StControlModule } from '@stlmpp/control';
import { SelectModule } from '../components/select/select.module';
import { FormModule } from '../components/form/form.module';
import { SpinnerModule } from '../components/spinner/spinner.module';
import { NgLetModule } from '../let/ng-let.module';
import { ObjectModule } from '../object/object.module';
import { StUtilsModule } from '@stlmpp/utils';

const DECLARATIONS = [ParamsComponent];
const MODULES = [
  CommonModule,
  StControlModule,
  SelectModule,
  FormModule,
  SpinnerModule,
  NgLetModule,
  ObjectModule,
  StUtilsModule,
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class ParamsModule {}
