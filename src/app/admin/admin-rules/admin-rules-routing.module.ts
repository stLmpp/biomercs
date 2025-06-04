import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminRulesComponent } from './admin-rules.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { ruleResolver } from '../../rules/rule.resolver';
import { unsavedDataGuard } from '@shared/guards/unsaved-data.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminRulesComponent,
    data: {
      [RouteDataEnum.title]: 'Edit rules',
    },
    resolve: {
      [RouteDataEnum.rules]: ruleResolver(),
    },
    canDeactivate: [unsavedDataGuard()],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRulesRoutingModule {}
