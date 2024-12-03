import {AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Role} from "../../../models/Role";
import {MatSelect} from "@angular/material/select";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatOption} from "@angular/material/core";
import {UserService} from "../../../core/services/user/user.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-add-edit-roles-group',
  templateUrl: './add-edit-roles-group.component.html',
  styleUrls: ['./add-edit-roles-group.component.scss']
})
export class AddEditRolesGroupComponent implements AfterViewInit{
    roles: Role[];
    rolesId : any[] = [];

    @ViewChild('rolesList', {static: false}) rolesList: MatSelect;
    filter: string ="";


    constructor(
        public dialogRef: MatDialogRef<AddEditRolesGroupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private userService:UserService,
        private messageService: MessageService,
        private cd: ChangeDetectorRef) {
        data.group.roles.forEach(g => this.rolesId.push(g.id));
        this.roles = data.roles;


    }

    ngAfterViewInit(): void {
        this.rolesList.options.forEach((option: MatOption) => {
            if (this.rolesId.indexOf(option.value) !== -1) {
                option.select();
            }
        });
        this.cd.detectChanges();
    }




    add(){
        let groupId = this.data.group.id;
        let rolesIds : any[];
        this.rolesId = this.rolesList.value;
        rolesIds = this.rolesId.filter(r => r!= undefined);
        this.userService.assignRolesToGroup(groupId, rolesIds).subscribe(e => {
            this.messageService.add({severity: 'success', summary: 'Success', detail: 'Group saved successfully'});
            this.dialogRef.close(true);
        }, error => {
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error while saving Group'});
            this.dialogRef.close(true);
        });
    }
    close() {
        this.dialogRef.close();
    }

    toggleAllSelection(event) {

        if (event.source.selected){
            this.rolesList.options.forEach((option: MatOption) => {
                if (option._getHostElement().style.display !== "none" && option.value != undefined) {
                    option.select();
                }
            });
        }
        else
            this.rolesList.value = [];

    }


}
