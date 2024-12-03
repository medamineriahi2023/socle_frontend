import { KeycloakService } from 'keycloak-angular';
import {KeycloakConfig} from "keycloak-js";

const keycloakConfig: KeycloakConfig = {
    url: 'http://localhost:8180/auth/',
    realm: 'oga',
    clientId: 'socle'
};

export const initializer = (keycloak: KeycloakService) => () =>
    keycloak.init({
        config: keycloakConfig,
        initOptions: {
            onLoad: 'login-required',
            checkLoginIframe: false,
        },});
