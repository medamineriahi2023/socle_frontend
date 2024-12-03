import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrganisationlistComponent} from './organisationlist.component';
import {Route, RouterModule} from "@angular/router";
import {CardModule} from "primeng/card";
import {AvatarModule} from "primeng/avatar";
import { OrganizationCardComponent } from './organization-card/organization-card.component';


const chooseOrganizationRoutes: Route[] = [
    {path: '**', component: OrganisationlistComponent},

];
@NgModule({
  declarations: [
    OrganisationlistComponent,
    OrganizationCardComponent
  ],
    imports: [
        RouterModule.forChild(chooseOrganizationRoutes),
        CommonModule,
        CardModule,
        AvatarModule
    ]
})
export class ChooseOrganizationModule { }
