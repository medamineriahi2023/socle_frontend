import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../../core/services/user/user.service";
import {OrganizationService} from "../../../core/services/organization/organization.service";

@Component({
    selector: 'app-organization-card',
    templateUrl: './organization-card.component.html',
    styleUrls: ['./organization-card.component.scss']
})
export class OrganizationCardComponent {
    @Input() organisation: any;
    @Input() newOrg: boolean = false;
    @Input() userId: string;
    constructor(
        private router: Router,
        private userService:UserService,
        private organisationService:OrganizationService
    ) {
    }


    chooseOrganisation(organisation: any) {
        const organisationId = organisation.id;
        const organizationName = organisation.name;

        localStorage.setItem('organisationId', organisationId);
        localStorage.setItem('organizationName', organizationName);



        if (this.newOrg){
            this.organisationService.addMember(organisation.id,this.userId).subscribe(e => {

            })

        }
        this.router.navigate(['/user-management'], organisationId);
    }
}
