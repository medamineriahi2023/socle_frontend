import {APP_INITIALIZER, NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {initializer} from "./kc-config/keycloak.config";

@NgModule({
    imports  : [
        HttpClientModule,
        KeycloakAngularModule
    ],
    providers: [{
        provide: APP_INITIALIZER,
        useFactory: initializer,
        multi: true,
        deps: [KeycloakService]
    }]
})
export class AuthModule
{
}
