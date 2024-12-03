import {Component, Input} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Group} from "../../models/Group";
import {AddEditGroupComponent} from "../modals/add-edit-group/add-edit-group.component";
import {UserService} from "../../core/services/user/user.service";

@Component({
  selector: 'group-container',
  templateUrl: './group-container.component.html',
  styleUrls: ['./group-container.component.scss']
})
export class GroupContainerComponent {
    filterValue = '';
    public refresh: boolean = false;
    @Input() isUserAdmin: boolean =false;
    constructor(private _matDialog: MatDialog,
                private userService: UserService) {
    }


    addGroup() {
        this._matDialog.open(AddEditGroupComponent, {}).afterClosed().subscribe(e => {
            if (e){
            this.userService.groupTriggerRefresh();
            }
        });
    }
}
