import {Component, Input} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AddUserComponent} from "../modals/add-user/add-user.component";
import {OrganizationService} from "../../core/services/organization/organization.service";
import {UserService} from "../../core/services/user/user.service";

@Component({
  selector: 'app-user-container',
  templateUrl: './user-container.component.html',
  styleUrls: ['./user-container.component.scss']
})
export class UserContainerComponent {
    filterValue = '';
    public refresh: boolean;
    public selectedIndex= 0;
    @Input() isUserAdmin =false;
    @Input() userId: string;

    private organisations :any[];

    constructor(private _matDialog: MatDialog,
                private organisationService: OrganizationService,
                private userService:UserService
                ) {
        this.organisationService.getAllOrganisations().subscribe(o => this.organisations = o);
    }

    addUser() {
        let dialog = this._matDialog.open(AddUserComponent, {
            data: {
                user: null,
                selectedTab: this.selectedIndex,
                organisations: this.organisations
            }
        });
        dialog.afterClosed().subscribe(res => {
            if (res){
                this.userService.triggerRefresh();
            }
        })
    }


    filterPredicate: (user: any, filter: string) => boolean = (user: any, filter: string): boolean => {
        const keys = ['firstName','lastName','userName', 'email'];
        const dataStr = Object.keys(user.user as unknown as Record<string, any>).filter(key => keys.includes(key))
            .reduce((currentTerm: string, key: string) => {
                return currentTerm + (user.user as unknown as Record<string, any>)[key] + '◬';
            }, '')
            .toLowerCase();
        const transformedFilter = filter.trim().toLowerCase();

        return dataStr.indexOf(transformedFilter) !== -1;
    };

    getIndex($event: number) {
        this.selectedIndex = $event;
    }

    protected readonly localStorage = localStorage;
}

