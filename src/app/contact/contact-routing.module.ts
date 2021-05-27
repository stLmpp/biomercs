import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { createMeta } from '@shared/meta/meta';

const routes: Routes = [
  {
    path: '',
    component: ContactComponent,
    data: {
      [RouteDataEnum.title]: 'Contact',
      [RouteDataEnum.meta]: createMeta({ title: 'Contact', description: 'Info about how to contact the admins' }),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactRoutingModule {}
