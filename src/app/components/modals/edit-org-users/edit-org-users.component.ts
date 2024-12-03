import {ChangeDetectorRef, Component, Inject, ViewChild} from '@angular/core';
import {MatSelect} from "@angular/material/select";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MessageService} from "primeng/api";
import {MatOption} from "@angular/material/core";
import {OrganizationService} from "../../../core/services/organization/organization.service";

@Component({
  selector: 'app-edit-org-users',
  templateUrl: './edit-org-users.component.html',
  styleUrls: ['./edit-org-users.component.scss']
})
export class EditOrgUsersComponent {
    @ViewChild('usersList', {static: false}) usersList: MatSelect;
    usersIds : any[] = [];
    users: any[];
    filter:string ="";

    constructor(
        public dialogRef: MatDialogRef<EditOrgUsersComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private organizationService : OrganizationService,
        private messageService:MessageService,
        private cd: ChangeDetectorRef) {
        this.users = data.kcUsers;
        data.org.kcUsers.forEach(g => this.usersIds.push(g.id));

    }
    close() {
        this.dialogRef.close();
    }

    toggleAllSelection(event) {

        if (event.source.selected){
            this.usersList.options.forEach((option: MatOption) => {
                if (option._getHostElement().style.display !== "none" && option.value != undefined) {
                    option.select();
                }
            });
        }
        else
            this.usersList.value = [];

    }
    checkSelected(){
        this.usersList.options.forEach((option: MatOption) => {
            if (this.usersIds.indexOf(option.value) !== -1) {
                option.select();
            }
            if (option.value === this.data.userId && this.data.org.name == localStorage.getItem("organizationName") )
                option.disabled = true;
        });
        this.cd.detectChanges();
    }
    ngAfterViewInit(): void {
        this.checkSelected();
    }

    add(){
        this.usersList.value = this.usersList.value.filter(v => v != undefined);
        let orgId = this.data.org.id;
        let usersIds : any[];
        this.usersIds = this.usersList.value;
        usersIds = this.usersIds;
        this.organizationService.addMembersToOrganization(orgId, usersIds).subscribe(e => {
            this.messageService.add({severity: 'success', summary: 'Success', detail: 'saved successfully'})
            this.dialogRef.close(true);
        }, error => {this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error while saving Users' });})

    }
}
