import {Route} from '@angular/router';
import {LayoutComponent} from 'app/layout/layout.component';
import {InitialDataResolver} from 'app/app.resolvers';
import {AuthGuard} from "./core/auth/kc-config/authGuard";

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    {path: '', pathMatch : 'full', redirectTo: 'user-management'},

    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'zone'},

    // Auth routes for guests

    // Auth routes for authenticated users

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
        ]
    },

    // Admin routes
    {
        path: '',
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        data: {
            layout: 'modern'
        },
        children: [
            {path: 'choosingOrganisation', loadChildren: () => import('app/modules/choose-organization/choose-organization.module').then(m => m.ChooseOrganizationModule)},
            {path: 'stock-management', loadChildren: () => import('app/modules/stock/stock.module').then(m => m.StockModule)},
            {path: 'user-management', loadChildren: () => import('app/modules/security/security.module').then(m => m.SecurityModule)},
            {path: 'workflow', loadChildren: () => import('app/modules/workflow/workflow.module').then(m => m.WorkflowModule)},
            {path: 'unauthorized', loadChildren: () => import('app/modules/UnauthorizedPage/unauthorized.module').then(m => m.UnauthorizedModule)},
        ]
    }
];
