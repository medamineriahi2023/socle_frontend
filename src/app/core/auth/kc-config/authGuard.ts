import {Injectable, OnInit} from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot, UrlTree
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import {OrganizationService} from "../../services/organization/organization.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard implements OnInit{
    private organisationId: string;
    private isAMember: boolean = true;
    private connectedUserId: string;
    constructor(
        protected readonly router: Router,
        protected readonly keycloak: KeycloakService,
        private organisationService: OrganizationService,
    ) {
        super(router, keycloak);

    }

    public async isAccessAllowed(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean | UrlTree> {
        // Force the user to log in if currently unauthenticated.
        if (!this.authenticated) {
            await this.keycloak.login({
                redirectUri: window.location.origin + state.url
            });
            return false;
        }
        // Get the roles required from the route.
        const requiredRoles = route.data.roles;







        // Allow the user to proceed if all the required roles are present.
        // const hasRequiredRoles = requiredRoles.every(role => this.roles.includes(role));
        // if (!hasRequiredRoles) {
        //     return this.router.parseUrl('/unauthorized'); // Replace '/unauthorized' with the desired route for unauthorized access
        // }
        this.organisationId = localStorage.getItem('organisationId');
        await this.keycloak.loadUserProfile().then(e => this.connectedUserId = e.id);
        if (localStorage.getItem('organisationId')) {
            this.organisationService.checkIfUserMemberOfOrganisation(this.connectedUserId)
                .subscribe((r: any) => {
                    this.isAMember = r.content
                });
        }
        const token = await this.keycloak.getToken();

        if (this.organisationId== null ) {
            const url = '/choosingOrganisation?token=' + encodeURIComponent(token);
            return this.router.parseUrl(url);
        }
        return true;
    }

    ngOnInit(): void {

    }
}
