import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {RoleContainerComponent} from "../../components/role-container/role-container.component";
import {GroupContainerComponent} from "../../components/group-container/group-container.component";
import {UserContainerComponent} from "../../components/user-container/user-container.component";
import {KeycloakService} from "keycloak-angular";
import {OrganizationContainerComponent} from "../../components/organization-container/organization-container.component";

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent  implements OnInit{
    panels: any[] = [];
    selectedPanel = '';
    comp: any;
    isUserAdmin: boolean = false;
    userId: string;


    constructor(
        // private securityUserSandbox: SecurityUserSandbox,
        //         private groupSandbox: GroupSandbox,
                private cdRef: ChangeDetectorRef,
                private keycloak: KeycloakService) {
       this.isUserAdmin =  keycloak.getUserRoles().includes("admin");
       keycloak.loadUserProfile().then(e =>  this.userId= e.id);
    }

    ngOnInit(): void {
        this.panels = [
            {
                id: 'Users',
                icon: 'heroicons_outline:user-group',
                title: $localize`Users`,
                description: $localize`Manage your users`
            },
            {
                id: 'Groups',
                icon: 'heroicons_outline:user-group',
                title: $localize`Groups`,
                description: $localize`Manage your Groups`
            },
            {
                id: 'Roles',
                icon: 'heroicons_outline:lock-closed',
                title: $localize`Roles`,
                description: $localize`Manage your roles`
            },
            {
                id: 'Organizations',
                icon: 'heroicons_outline:lock-closed',
                title: $localize`Organizations`,
                description: $localize`Manage your organizations`
            }
        ];
    }

    // show component
    detectComp(comp: any):void {
        if (comp === 'Users') {
            this.comp = UserContainerComponent;
        }
        if (comp === 'Groups') {
            this.comp = GroupContainerComponent;
        }
        if (comp === 'Roles') {
            this.comp = RoleContainerComponent;
        }
        if (comp === 'Organizations') {
            this.comp = OrganizationContainerComponent;
        }
        this.selectedPanel = comp;
    }

}
