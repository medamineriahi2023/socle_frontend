import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InventoryContainerComponent} from "./inventory-container.component";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {SharedModule} from "../../shared/shared.module";
import {InventoryTableComponent} from './inventory-table/inventory-table.component';
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatMenuModule} from "@angular/material/menu";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {TagModule} from "primeng/tag";
import {ToastModule} from "primeng/toast";
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {RatingModule} from "primeng/rating";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {AddEditInventoryComponent} from "../modals/add-edit-inventory/add-edit-inventory.component";
import {ProductContainerModule} from "../product-container/product-container.module";
import {AccordionModule} from "primeng/accordion";
import {AddProductInventoryComponent} from "../modals/add-product-inventory/add-product-inventory.component";
import {AddQuantityComponent} from "../modals/add-quantity/add-quantity.component";
import {CodeBarScannerComponent} from "../modals/code-bar-scanner/code-bar-scanner.component";
import {NgxBarcodeScannerModule} from "@eisberg-labs/ngx-barcode-scanner";
import {ChooseInventoryComponent} from "../modals/choose-invenetory/choose-inventory.component";
import {ListOfRequestsComponent} from "../modals/list-of-requests/list-of-requests.component";
import {UsernamePipe} from "../../core/pipes/username.pipe";
import {NgxIntlTelephoneInputModule} from "ngx-intl-telephone-input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {SellModeComponent} from "../modals/sell-mode/sell-mode.component";
import {ClientDataComponent} from "../modals/client-data/client-data.component";
import {RadioButtonModule} from "primeng/radiobutton";
import {OrganizationContainerModule} from "../organization-container/organization-container.module";
import {MaxLengthDirective} from "../../core/directive/MaxLengthDirective";
import {SelectDileveryComponent} from "../modals/select-dilevery/select-dilevery.component";
import {CheckDeliveryExistencePipe} from "../../core/pipes/checkDeliveryExistence.pipe";


@NgModule({
    declarations: [
        InventoryContainerComponent,
        InventoryTableComponent,
        AddEditInventoryComponent,
        AddProductInventoryComponent,
        AddQuantityComponent,
        CodeBarScannerComponent,
        ChooseInventoryComponent,
        SelectDileveryComponent,
        ListOfRequestsComponent,
        SellModeComponent,
        ClientDataComponent,

    ],
    exports: [
        InventoryContainerComponent
    ],
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        RatingModule,
        TagModule,
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatPaginatorModule,
        MatTableModule,
        ToastModule,
        SharedModule,
        MatInputModule,
        MatTooltipModule,
        MatOptionModule,
        MatSelectModule,
        ProductContainerModule,
        AccordionModule,
        NgxBarcodeScannerModule,
        UsernamePipe,
        NgxIntlTelephoneInputModule,
        MatProgressSpinnerModule,
        RadioButtonModule,
        OrganizationContainerModule,
        MaxLengthDirective,
        CheckDeliveryExistencePipe
    ]
})
export class InventoryContainerModule { }
