import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SubCategoryContainerComponent} from "./sub-category-container.component";
import {CategoriesContainerModule} from "../categories-container/categories-container.module";
import { SubCategoryTableComponent } from './sub-category-table/sub-category-table.component';
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {ToastModule} from "primeng/toast";
import {SharedModule} from "../../shared/shared.module";
import {AccordionModule} from "primeng/accordion";
import {AddEditSubcategoryComponent} from "../modals/add-edit-subcategory/add-edit-subcategory.component";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MaxLengthDirective} from "../../core/directive/MaxLengthDirective";



@NgModule({
    declarations: [
        SubCategoryContainerComponent,
        SubCategoryTableComponent,
        AddEditSubcategoryComponent
    ],
    exports: [
        SubCategoryContainerComponent
    ],
    imports: [
        CommonModule,
        CategoriesContainerModule,
        MatButtonModule,
        MatCardModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatPaginatorModule,
        MatTableModule,
        ToastModule,
        SharedModule,
        AccordionModule,
        MatInputModule,
        MatTooltipModule,
        MatOptionModule,
        MatSelectModule,
        MaxLengthDirective
    ]
})
export class SubCategoryContainerModule { }
