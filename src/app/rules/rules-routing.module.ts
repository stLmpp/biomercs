import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RulesComponent } from './rules.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { createMeta } from '@shared/meta/meta';
import { ruleResolver } from './rule.resolver';

const routes: Routes = [
  {
    path: '',
    component: RulesComponent,
    data: {
      [RouteDataEnum.title]: 'Rules',
      [RouteDataEnum.meta]: createMeta({ title: 'Rules', description: 'Rules' }),
    },
    resolve: {
      [RouteDataEnum.rules]: ruleResolver(),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RulesRoutingModule {}
