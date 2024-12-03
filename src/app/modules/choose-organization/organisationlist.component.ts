import {Component, OnInit} from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../core/services/user/user.service";
import {MatDialog} from "@angular/material/dialog";
import {OrganizationService} from "../../core/services/organization/organization.service";

@Component({
  selector: 'app-organisationlist',
  templateUrl: './organisationlist.component.html',
  styleUrls: ['./organisationlist.component.scss']
})
export class OrganisationlistComponent implements OnInit{
    parsedToken: any;
    organisations: any;
    organisationKeys: any;
     refresh: boolean;
     userId: string;

    constructor(private route: ActivatedRoute
                ,private userService:UserService,
                private organisationService:OrganizationService,
                private keycloakService:KeycloakService
    ,private _matDialog: MatDialog) {
        keycloakService.loadUserProfile().then(e => this.userId = e.id);
    }

    ngOnInit(): void {

        this.route.queryParams.subscribe(params => {
            const token = params['token'];

            if (token) {
                this.parsedToken = JSON.parse(window.atob(token.split('.')[1]));
                 this.organisationKeys = Object?.keys(this.parsedToken.organisation);
                this.organisations = this.organisationKeys.map(key => ({
                    id: key,
                    ...this.parsedToken.organisation[key]
                }));
            }
        });
        if (this.organisationKeys?.length == 0 ){
            this.organisationService.getAllOrganisations().subscribe(e => this.organisations = e.organizations);
        }
    }
}
