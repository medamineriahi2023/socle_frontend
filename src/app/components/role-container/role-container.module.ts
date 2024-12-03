import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RoleContainerComponent} from "./role-container.component";
import { RoleTableComponent } from './role-table/role-table.component';
import {MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";
import {MatTableModule} from "@angular/material/table";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatButtonModule} from "@angular/material/button";
import {SharedModule} from "../../shared/shared.module";
import {ToastModule} from "primeng/toast";
import { GlobalRoleTableComponent } from './global-role-table/global-role-table.component';
import {TabViewModule} from "primeng/tabview";
import {AddEditRoleComponent} from "../modals/add-edit-role/add-edit-role.component";
import {EditPermissionComponent} from "../modals/edit-permission/edit-permission.component";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSelectModule} from "@angular/material/select";
import {MaxLengthDirective} from "../../core/directive/MaxLengthDirective";



@NgModule({
    declarations: [RoleContainerComponent, RoleTableComponent, GlobalRoleTableComponent,AddEditRoleComponent, EditPermissionComponent, ],
    exports: [
        RoleContainerComponent
    ],
    imports: [
        CommonModule,
        MatListModule,
        MatCardModule,
        MatTableModule,
        MatMenuModule,
        MatIconModule,
        MatPaginatorModule,
        MatButtonModule,
        SharedModule,
        ToastModule,
        TabViewModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        MatSelectModule,
        MaxLengthDirective

    ]
})
export class RoleContainerModule { }
