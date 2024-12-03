import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrganizationContainerComponent} from "./organization-container.component";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {SharedModule} from "../../shared/shared.module";
import {OrganizationTableComponent} from './organization-table/organization-table.component';
import {MatCardModule} from "@angular/material/card";
import {MatMenuModule} from "@angular/material/menu";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {ToastModule} from "primeng/toast";
import {EditOrgUsersComponent} from "../modals/edit-org-users/edit-org-users.component";
import {AddEditOrganizationComponent} from "../modals/add-edit-organization/add-edit-organization.component";
import {MatOptionModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatListModule} from "@angular/material/list";
import {MapComponent} from "../map/map.component";
import {MaxLengthDirective} from "../../core/directive/MaxLengthDirective";



@NgModule({
    declarations: [
        OrganizationContainerComponent,
        OrganizationTableComponent,
        EditOrgUsersComponent,
        AddEditOrganizationComponent,
        MapComponent
    ],
    exports: [
        OrganizationContainerComponent,
        MapComponent
    ],
    imports: [
        CommonModule,
        MatIconModule,
        MatOptionModule,
        MatInputModule,
        MatSelectModule,
        FormsModule,
        MatTooltipModule,
        ReactiveFormsModule,
        MatPaginatorModule,
        MatMenuModule,
        MatTableModule,
        MatCardModule,
        MatListModule,
        MatButtonModule,
        SharedModule,
        ToastModule,
        MaxLengthDirective
    ]
})
export class OrganizationContainerModule { }
