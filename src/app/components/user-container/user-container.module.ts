import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserContainerComponent} from "./user-container.component";
import {UserTableComponent} from "./user-table/user-table.component";
import {MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatMenuModule} from "@angular/material/menu";
import {SharedModule} from "../../shared/shared.module";
import {MatButtonModule} from "@angular/material/button";
import {AddUserComponent} from "../modals/add-user/add-user.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {ToastModule} from "primeng/toast";
import {TabViewModule} from "primeng/tabview";
import { UserGlobalTableComponent } from './user-global-table/user-global-table.component';
import {NgxIntlTelephoneInputModule} from "ngx-intl-telephone-input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AddEditUserRolesComponent} from "../modals/add-edit-user-roles/add-edit-user-roles.component";
import {UserInfoComponent} from "../modals/user-info/user-info.component";
import {ResetPasswordComponent} from "../modals/reset-password/reset-password.component";
import {QRCodeModule} from "angularx-qrcode";
import {AvatarModule} from "primeng/avatar";
import {BadgeModule} from "primeng/badge";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MaxLengthDirective} from "../../core/directive/MaxLengthDirective";



@NgModule({
    declarations: [UserContainerComponent, UserTableComponent,AddUserComponent, UserGlobalTableComponent,AddEditUserRolesComponent,   UserInfoComponent,
        ResetPasswordComponent,],
    exports: [
        UserContainerComponent
    ],
    imports: [
        CommonModule,
        MatListModule,
        MatCardModule,
        MatPaginatorModule,
        MatIconModule,
        MatTableModule,
        MatMenuModule,
        SharedModule,
        MatButtonModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatInputModule,
        MatOptionModule,
        TabViewModule,
        NgxIntlTelephoneInputModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        ToastModule,
        QRCodeModule,
        AvatarModule,
        BadgeModule,
        MatProgressSpinnerModule,
        MaxLengthDirective
    ]
})
export class UserContainerModule { }
