import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ExtraOptions, PreloadAllModules, RouterModule} from '@angular/router';
import {FuseModule} from '@fuse';
import {FuseConfigModule} from '@fuse/services/config';
import {FuseMockApiModule} from '@fuse/lib/mock-api';
import {CoreModule} from 'app/core/core.module';
import {appConfig} from 'app/core/config/app.config';
import {mockApiServices} from 'app/mock-api';
import {LayoutModule} from 'app/layout/layout.module';
import {AppComponent} from 'app/app.component';
import {appRoutes} from 'app/app.routing';
import {MatIconModule} from "@angular/material/icon";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MessageService} from "primeng/api";
import {NgxIntlTelephoneInputModule} from "ngx-intl-telephone-input";
import {MatLegacyButtonModule} from "@angular/material/legacy-button";
import {MatLegacyFormFieldModule} from "@angular/material/legacy-form-field";
import {MatLegacyInputModule} from "@angular/material/legacy-input";
import {MatLegacyOptionModule} from "@angular/material/legacy-core";
import {MatLegacySelectModule} from "@angular/material/legacy-select";
import {DragDropModule} from "primeng/dragdrop";
import {TagModule} from "primeng/tag";
import {TableModule} from "primeng/table";
import {ProductContainerModule} from "./components/product-container/product-container.module";
import { ListOfRequestsComponent } from './components/modals/list-of-requests/list-of-requests.component';
import { NotificationModalComponent } from './components/modals/notification-modal/notification-modal.component';
import {ToastModule} from "primeng/toast";
import {AvatarModule} from "primeng/avatar";
import {ButtonModule} from "primeng/button";
import { ViewProductComponent } from './components/modals/view-product/view-product.component';
import { SellModeComponent } from './components/modals/sell-mode/sell-mode.component';
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatMenuModule} from "@angular/material/menu";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import { ClientDataComponent } from './components/modals/client-data/client-data.component';
import { PaymentHistoryComponent } from './components/payment-history-container/payment-history.component';
import {SharedModule} from "./shared/shared.module";
import { TrackingMapComponent } from './components/tracking-map/tracking-map.component';
import { SelectDileveryComponent } from './components/modals/select-dilevery/select-dilevery.component';

const routerConfig: ExtraOptions = {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent,
        NotificationModalComponent,


    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),
        CoreModule,
        LayoutModule,

        MatIconModule,
        ReactiveFormsModule,
        MatInputModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatButtonModule,
        MatOptionModule,
        FormsModule,
        MatSelectModule,
        NgxIntlTelephoneInputModule,
        MatLegacyButtonModule,
        MatLegacyFormFieldModule,
        MatLegacyInputModule,
        MatLegacyOptionModule,
        MatLegacySelectModule,
        DragDropModule,
        TagModule,
        TableModule,
        ProductContainerModule,
        ToastModule,
        AvatarModule,
        ButtonModule,
        MatCardModule,
        MatDividerModule,
        MatMenuModule,
        MatPaginatorModule,
        MatTableModule,
        SharedModule,
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [MessageService]

})
export class AppModule {
}
