import {AfterViewInit, ChangeDetectorRef, Component, Inject, ViewChild} from '@angular/core';
import {Role} from "../../../models/Role";
import {MatSelect} from "@angular/material/select";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatOption} from "@angular/material/core";
import {UserService} from "../../../core/services/user/user.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-edit-permission',
  templateUrl: './edit-permission.component.html',
  styleUrls: ['./edit-permission.component.scss']
})
export class EditPermissionComponent implements AfterViewInit{
    roles: Role[];
    permissions: Role[];
    rolesId: any[] = [];
    filter: string = "";

    @ViewChild('rolesList', {static: false}) rolesList: MatSelect;


    constructor(
        public dialogRef: MatDialogRef<EditPermissionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private cd: ChangeDetectorRef,
        private userService:UserService,
        private messageService:MessageService) {
        data.role.permissions.forEach(g => this.rolesId.push(g.id));
        this.permissions = data.permissions;


    }

    ngAfterViewInit(): void {
        this.rolesList.options.forEach((option: MatOption) => {
            if (this.rolesId.indexOf(option.value) !== -1) {

                option.select();
            }
        });
        this.cd.detectChanges();
    }


    add() {
        let roleId = this.data.role.id;
        let rolesIds: any[];
        this.rolesId = this.rolesList.value;
        rolesIds = this.rolesId.filter(r => r !== undefined);
        this.userService.assignCompositeRolesForRole(roleId, rolesIds).subscribe(u => { this.dialogRef.close(true);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Permission(s) added successfully' });
        }, error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
        });

    }

    close() {
        this.dialogRef.close();
    }

    toggleAllSelection(event) {

        if (event.source.selected) {
            this.rolesList.options.forEach((option: MatOption) => {
                if (option._getHostElement().style.display !== "none" && option.value != undefined) {
                    option.select();
                }
            });
        } else
            this.rolesList.value = [];

    }
}
