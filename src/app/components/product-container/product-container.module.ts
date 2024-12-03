import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductContainerComponent } from './product-container.component';
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {RatingModule} from "primeng/rating";
import {TagModule} from "primeng/tag";
import {FormsModule} from "@angular/forms";
import { ProductTableComponent } from './product-table/product-table.component';
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {ToastModule} from "primeng/toast";
import {SharedModule} from "../../shared/shared.module";
import {AddEditProductComponent} from "../modals/add-edit-product/add-edit-product.component";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {AddBrandComponent} from "../modals/add-brand/add-brand.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ViewProductComponent} from "../modals/view-product/view-product.component";
import {NgxBarcodeModule} from "ngx-barcode";
import {MaxLengthDirective} from "../../core/directive/MaxLengthDirective";



@NgModule({
    declarations: [
        ProductContainerComponent,
        ProductTableComponent,
        AddEditProductComponent,
        AddBrandComponent,
        ViewProductComponent,

    ],
    exports: [
        ProductContainerComponent,
        ProductTableComponent
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
        MatToolbarModule,
        MatProgressSpinnerModule,
        NgxBarcodeModule,
        MaxLengthDirective
    ]
})
export class ProductContainerModule { }
