import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesContainerComponent } from './categories-container.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {SharedModule} from "../../shared/shared.module";
import { CategoriesTableComponent } from './categories-table/categories-table.component';
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {ToolbarModule} from "primeng/toolbar";
import {ToastModule} from "primeng/toast";
import {FileUploadModule} from "primeng/fileupload";
import {RatingModule} from "primeng/rating";
import {TagModule} from "primeng/tag";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {RadioButtonModule} from "primeng/radiobutton";
import {PaginatorModule} from "primeng/paginator";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DragDropModule} from "primeng/dragdrop";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatMenuModule} from "@angular/material/menu";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {TreeTableModule} from "primeng/treetable";
import {AddUpdateCategoryComponent} from "../modals/add-update-category/add-update-category.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ColorPickerModule} from "primeng/colorpicker";
import {MaxLengthDirective} from "../../core/directive/MaxLengthDirective";



@NgModule({
    declarations: [
        CategoriesContainerComponent,
        CategoriesTableComponent,
        AddUpdateCategoryComponent,
    ],
    exports: [
        CategoriesContainerComponent
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        SharedModule,
        TableModule,
        ButtonModule,
        ToolbarModule,
        ToastModule,
        FileUploadModule,
        RatingModule,
        TagModule,
        DialogModule,
        DropdownModule,
        RadioButtonModule,
        PaginatorModule,
        ConfirmDialogModule,
        DragDropModule,
        MatCardModule,
        MatDividerModule,
        MatMenuModule,
        MatPaginatorModule,
        MatTableModule,
        TreeTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        ColorPickerModule,
        MaxLengthDirective
    ]
})
export class CategoriesContainerModule { }
