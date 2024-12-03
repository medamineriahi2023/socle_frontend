import {Component, Input, OnInit} from '@angular/core';
import {Role} from "../../models/Role";
import {MatDialog} from "@angular/material/dialog";
import {AddEditRoleComponent} from "../modals/add-edit-role/add-edit-role.component";
import {keys} from "lodash-es";
import {filter} from "rxjs";
import {RoleService} from "../../core/services/role/role.service";

@Component({
  selector: 'app-role-container',
  templateUrl: './role-container.component.html',
  styleUrls: ['./role-container.component.scss']
})
export class RoleContainerComponent implements OnInit{
    filterValue = '';
    public refresh: boolean = false;
    public selectedTab = 0;
    @Input() isUserAdmin: boolean = false;

    constructor(private _matDialog: MatDialog,
                private roleService:RoleService) {
    }


    addRole() {
        this._matDialog.open(AddEditRoleComponent, {
            data: {
                selectedTab: this.selectedTab,
                role: null
            }
        }).afterClosed().subscribe(e => {
            if (e && this.selectedTab == 0){
                this.roleService.roleTriggerRefresh();
            }else if (e && this.selectedTab == 1){
                this.roleService.globalRoleTriggerRefresh();
            }
        });
    }


    filterPredicate: (role: Role, filter: string) => boolean = (role: Role, filter: string): boolean => {

        const keys = ['name'];
        const dataStr = Object.keys(role as unknown as Record<string, any>).filter(key => keys.includes(key))
            .reduce((currentTerm: string, key: string) => {
                return currentTerm + (role as unknown as Record<string, any>)[key] + '◬';
            }, '')
            .toLowerCase();
        const transformedFilter = filter.trim().toLowerCase();
        return dataStr.indexOf(transformedFilter) !== -1;
    };


    ngOnInit(): void {
    }


    getSelected($event: number) {
        this.selectedTab = $event;
    }

    protected readonly localStorage = localStorage;
}
