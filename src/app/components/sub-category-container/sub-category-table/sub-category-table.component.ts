import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Role} from "../../../models/Role";
import {MatPaginator} from "@angular/material/paginator";
import {Category} from "../../../models/Category";
import {MatDialog} from "@angular/material/dialog";
import {CategoriesService} from "../../../core/services/categories/categories.service";
import {MessageService} from "primeng/api";
import {ConfirmActionDialogData} from "../../modals/models";
import {
    ConfirmActionDialogComponent
} from "../../../shared/dialog/confirm-action-dialog/confirm-action-dialog.component";
import {AddUpdateCategoryComponent} from "../../modals/add-update-category/add-update-category.component";
import {SubCategory} from "../../../models/SubCategory";
import {SubCategoryService} from "../../../core/services/subCategory/subCategory.service";
import {AddEditSubcategoryComponent} from "../../modals/add-edit-subcategory/add-edit-subcategory.component";

@Component({
  selector: 'app-sub-category-table',
  templateUrl: './sub-category-table.component.html',
  styleUrls: ['./sub-category-table.component.scss']
})
export class SubCategoryTableComponent implements OnInit,OnChanges{
    displayedColumns: string[] = ['NAME', 'RANGE CODE', 'NUMBER OF PRODUCTS','FILTER VALUES' ,'ACTIONS'];
    dataSource: MatTableDataSource<SubCategory>;
    @Input() refresh : boolean = false;

    @Input() filterValue = '';
    @Input() filterPredicate: (data: SubCategory, filter: string) => boolean;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Input() isUserAdmin: boolean = false;
    @Output() openSubCategory = new EventEmitter<any>();
    @Input() selectedCategory!: Category;
    @Output() onSelectedCategory = new EventEmitter<Category>();
    @Input() subCategoryPage!: boolean;


    constructor(
        private _matDialog: MatDialog,
        private subCategoryService:SubCategoryService,
        private messageService:MessageService
    ) {

        this.dataSource = new MatTableDataSource();

    }

    ngOnInit(): void {
        this.filterChange();
        this.listenForDataChnages();
    }

    filterChange() {
        if (this.dataSource) {
            this.dataSource.filter = this.filterValue;
        }
    }

    listenForDataChnages() {
        this.dataSource.data = this.selectedCategory.subCategories;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.filterValue) {
            this.filterChange();
        }
        if (changes.refresh || changes.selectedCategory) {
            this.listenForDataChnages();
        }
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    openConfirmActionDialog(confirmActionDialogData: ConfirmActionDialogData) {
        return this._matDialog.open(ConfirmActionDialogComponent, {
            panelClass: 'confirm-action-dialog',
            data: confirmActionDialogData
        })
    }

    delete(subCategory: SubCategory) {
        const confirmActionDialogData: ConfirmActionDialogData = {
            message: "You really want to delete "+ subCategory.name +" ?",        };
        this.openConfirmActionDialog(confirmActionDialogData).afterClosed().subscribe(res => {
            if (res) {
                this.subCategoryService.delete(subCategory.id).subscribe(e => {
                    const index = this.selectedCategory.subCategories.findIndex(s => s.id === subCategory.id);
                    if (index !== -1) {
                        this.selectedCategory.subCategories.splice(index, 1);
                    }
                    this.listenForDataChnages(); this.messageService.add({ severity: 'success', summary: 'Success', detail: 'subCategory deleted successfully' });},error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
                });
            }
        });
    }
    editCategory(subCategory: SubCategory) {
        this._matDialog.open(AddEditSubcategoryComponent, {
            data: { subcategory :subCategory,
                    categoryId :this.selectedCategory.id}
        }).afterClosed().subscribe(e => {
            if (e){
            let index = this.selectedCategory.subCategories.findIndex(s => s.id === subCategory.id);
            if (index !== -1) {
                this.selectedCategory.subCategories[index] = e;
                this.listenForDataChnages();
            }
            }
        });
    }

}
