import {AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Group} from "../../../models/Group";
import {MatSelect} from "@angular/material/select";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatOption} from "@angular/material/core";


@Component({
  selector: 'app-edit-user-groups',
  templateUrl: './edit-user-groups.component.html',
  styleUrls: ['./edit-user-groups.component.scss']
})
export class EditUserGroupsComponent implements AfterViewInit{

    groups: Group[];
    groupIds : any[] = [];
    filter:string ="";


    @ViewChild('groupsList', {static: false}) groupList: MatSelect;


    constructor(
                public dialogRef: MatDialogRef<EditUserGroupsComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private cd: ChangeDetectorRef) {

        data.fix.groups.forEach(g => this.groupIds.push(g.id));
        this.groups = data.groupList;
    }

    ngAfterViewInit(): void {
        this.groupList.options.forEach((option: MatOption) => {
            if (this.groupIds.indexOf(option.value) !== -1) {
                option.select();
            }
        });
        this.cd.detectChanges();
    }




    add(){
        let userId = this.data.fix.id;
        let groupIds : any[];
        this.groupIds = this.groupList.value;
        groupIds = this.groupIds.filter(g => g !== null && g !== undefined);
        // this.store.dispatch(UserActions.assignUserToGroups({userId, groupIds}))
        this.dialogRef.close();
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


        } else {
            this.groupList.value = [];
        }


    }


}
