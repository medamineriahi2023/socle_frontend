import {AfterViewInit, ChangeDetectorRef, Component, Inject, ViewChild} from '@angular/core';
import {Role} from "../../../models/Role";
import {MatSelect} from "@angular/material/select";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatOption} from "@angular/material/core";
import {UserService} from "../../../core/services/user/user.service";
import {MessageService} from "primeng/api";
import {OrganizationService} from "../../../core/services/organization/organization.service";

@Component({
  selector: 'app-add-edit-user-roles',
  templateUrl: './add-edit-user-roles.component.html',
  styleUrls: ['./add-edit-user-roles.component.scss']
})
export class AddEditUserRolesComponent implements AfterViewInit{

    roles: Role[];
    rolesId : any[] = [];
    filter:string ="";


    @ViewChild('rolesList', {static: false}) groupList: MatSelect;


    constructor(
        public dialogRef: MatDialogRef<AddEditUserRolesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private cd: ChangeDetectorRef,
        private userService:UserService,
        private organizationService:OrganizationService,
        private messageService: MessageService) {
        if (data.fix.organisationRoles != null)
        data.fix.organisationRoles.forEach(g => this.rolesId.push(g.name));
        if (data?.fix?.roles != null){
            data.fix.roles.forEach(g => this.rolesId.push(g.id));
        }
        this.roles = data.roles;

    }

    ngAfterViewInit(): void {
        this.groupList.options.forEach((option: MatOption) => {
            if (this.rolesId.indexOf(option.value) !== -1) {
                option.select();
            }
        });
        this.cd.detectChanges();
    }




    add(){
        let userId = this.data.fix.id;
        let rolesId : any[];
        this.rolesId = this.groupList.value;
        rolesId = this.rolesId.filter(r => r!== undefined);
        if (!this.data.isGlobal){
        this.organizationService.assignOrgRolesToUser(userId, rolesId).subscribe(r =>  {this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role(s) edited successfully' });this.dialogRef.close(true)}, error =>
        {this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Role(s) is not assigned' });});
        }else {
            this.userService.assignRolesToUser(userId, rolesId).subscribe(r =>  {this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role(s) edited successfully' });this.dialogRef.close(true)}, error =>
            {this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Role(s) is not assigned' });});
        }
    }

    addGlobal(){
        let userId = this.data.fix.user.id;
        let rolesId : any[];
        this.rolesId = this.groupList.value;
        rolesId = this.rolesId.filter(r => r!== undefined);
        if (!this.data.isGlobal){
            this.organizationService.assignOrgRolesToUser(userId, rolesId).subscribe(r =>  {this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role(s) edited successfully' });this.dialogRef.close(true)}, error =>
            {this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Role(s) is not assigned' });});
        }else {
            this.userService.assignRolesToUser(userId, rolesId).subscribe(r =>  {this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role(s) edited successfully' });this.dialogRef.close(true)}, error =>
            {this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Role(s) is not assigned' });});
        }
    }
    close() {
        this.dialogRef.close();
    }

    toggleAllSelection(event) {

        if (event.source.selected){
            this.groupList.options.forEach((option: MatOption) => {
                if (option._getHostElement().style.display !== "none" && option.value != undefined) {
                    option.select();
                }
            });
        }
        else
            this.groupList.value = [];

    }


}
