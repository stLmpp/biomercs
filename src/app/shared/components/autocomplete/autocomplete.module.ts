import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteDirective } from './autocomplete.directive';
import { AutocompleteComponent } from './autocomplete.component';
import { A11yModule } from '@angular/cdk/a11y';
import { AutocompleteOptionDirective } from './autocomplete-option.directive';

const DECLARATIONS = [AutocompleteDirective, AutocompleteComponent, AutocompleteOptionDirective];
const MODULES = [CommonModule, A11yModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class AutocompleteModule {}
