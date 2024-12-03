import {Component, Input} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AddEditOrganizationComponent} from "../modals/add-edit-organization/add-edit-organization.component";
import {Role} from "../../models/Role";
import {OrganizationService} from "../../core/services/organization/organization.service";

@Component({
  selector: 'organization-container',
  templateUrl: './organization-container.component.html',
  styleUrls: ['./organization-container.component.scss']
})
export class OrganizationContainerComponent {
    filterValue = '';
    public refresh: boolean = false;
    @Input() isUserAdmin: boolean =false;
    @Input() userId!: string;
    constructor(private _matDialog: MatDialog,
                private organizationService:OrganizationService) {
    }


    addOrganization() {
        this._matDialog.open(AddEditOrganizationComponent, {}).afterClosed().subscribe(e => {
            if (e){
                this.organizationService.triggerRefresh();
            }
        });
    }

    filterPredicate: (organization: any, filter: string) => boolean = (organization: any, filter: string): boolean => {
        const keys = ['name'];
        const dataStr = Object.keys(organization as unknown as Record<string, any>).filter(key => keys.includes(key))
            .reduce((currentTerm: string, key: string) => {
                return currentTerm + (organization as unknown as Record<string, any>)[key] + '◬';
            }, '')
            .toLowerCase();
        const transformedFilter = filter.trim().toLowerCase();

        return dataStr.indexOf(transformedFilter) !== -1;
    };

}
