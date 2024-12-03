import {AfterViewInit, ChangeDetectorRef, Component, Inject, ViewChild} from '@angular/core';
import {MatSelect} from "@angular/material/select";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatOption} from "@angular/material/core";
import {UserService} from "../../../core/services/user/user.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-add-edit-users-group',
  templateUrl: './add-edit-users-group.component.html',
  styleUrls: ['./add-edit-users-group.component.scss']
})
export class AddEditUsersGroupComponent implements AfterViewInit{

    users: any[];
    usersIds : any[] = [];
    filter:string ="";


    @ViewChild('usersList', {static: false}) usersList: MatSelect;


    constructor(
        public dialogRef: MatDialogRef<AddEditUsersGroupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private userService : UserService,
        private messageService:MessageService,
    private cd: ChangeDetectorRef) {
        this.users = data.kcUsers;
        data.group.kcUsers.forEach(g => this.usersIds.push(g.id));

    }

    checkSelected(){
        this.usersList.options.forEach((option: MatOption) => {
            if (this.usersIds.indexOf(option.value) !== -1) {
                option.select();
            }
        });
        this.cd.detectChanges();
    }

    ngAfterViewInit(): void {
       this.checkSelected();
    }




    add(){
        this.usersList.value = this.usersList.value.filter(v => v != undefined);
        let groupId = this.data.group.id;
        let usersIds : any[];
        this.usersIds = this.usersList.value;
        usersIds = this.usersIds;
        this.userService.assignUsersToGroup(groupId, usersIds).subscribe(e => {
            this.dialogRef.close(true);
            this.messageService.add({severity: 'success', summary: 'Success', detail: 'saved successfully'})
        }, error => {this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error while saving Users Groups' });})

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

}
