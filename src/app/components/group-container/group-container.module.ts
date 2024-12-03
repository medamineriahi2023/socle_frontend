import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddEditGroupComponent} from "../modals/add-edit-group/add-edit-group.component";
import {AddEditRolesGroupComponent} from "../modals/add-edit-roles-group/add-edit-roles-group.component";
import {AddEditUsersGroupComponent} from "../modals/add-edit-users-group/add-edit-users-group.component";
import {GroupTableComponent} from "./group-table/group-table.component";
import {GroupContainerComponent} from "./group-container.component";
import {MatIconModule} from "@angular/material/icon";
import {MatOptionModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatMenuModule} from "@angular/material/menu";
import {MatTableModule} from "@angular/material/table";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {SharedModule} from "../../shared/shared.module";
import {ToastModule} from "primeng/toast";
import {MaxLengthDirective} from "../../core/directive/MaxLengthDirective";


@NgModule({
    declarations: [
        AddEditGroupComponent,
        AddEditRolesGroupComponent,
        AddEditUsersGroupComponent,
        GroupTableComponent,
        GroupContainerComponent
    ],
    exports: [
        GroupContainerComponent
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
        MaxLengthDirective,
    ]
})
export class GroupContainerModule { }
