import {Component, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy, OnChanges, SimpleChanges} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {CategoriesService} from "../../../core/services/categories/categories.service";
import {MessageService} from "primeng/api";
import {Category} from "../../../models/Category";
import {Subscription} from 'rxjs';
import {ConfirmActionDialogData} from "../../modals/models";
import {
    ConfirmActionDialogComponent
} from "../../../shared/dialog/confirm-action-dialog/confirm-action-dialog.component";
import {AddUpdateCategoryComponent} from "../../modals/add-update-category/add-update-category.component";

@Component({
    selector: 'app-categories-table',
    templateUrl: './categories-table.component.html',
    styleUrls: ['./categories-table.component.scss'],
})
export class CategoriesTableComponent implements OnChanges, OnInit, OnDestroy {
    displayedColumns: string[] = ['NAME', 'Number OF SUB-CATEGORIES', 'ACTIONS'];
    dataSource: MatTableDataSource<Category>;
    @Input() filterValue = '';
    @Input() isUserAdmin: boolean = false;
    @Output() openSubCategory = new EventEmitter<any>();
    @Input() selectedCategory!: Category;
    @Output() onSelectedCategory = new EventEmitter<Category>();
    @Input() subCategoryPage!: boolean;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    private refreshSubscription: Subscription;
    isLoading: boolean = false;

    constructor(
        private _matDialog: MatDialog,
        private categoryService: CategoriesService,
        private messageService: MessageService,
        private sharedCategoryService: CategoriesService
    ) {
        this.dataSource = new MatTableDataSource();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.filterValue) {
            this.filterChange();
        }
    }

    ngOnInit(): void {
        this.filterChange();
        this.listenForDataChanges();

        this.refreshSubscription = this.sharedCategoryService.refresh$.subscribe(refresh => {
            if (refresh) {
                this.listenForDataChanges();
            }
        });

        if (this.subCategoryPage) {
            this.displayedColumns = this.displayedColumns.filter(d => d !== 'ACTIONS');
        }
    }

    ngOnDestroy(): void {
        this.refreshSubscription.unsubscribe();
    }

    filterChange() {
        if (this.dataSource) {
            this.dataSource.filter = this.filterValue.trim().toLowerCase();
        }
    }

    listenForDataChanges() {
        this.isLoading = true;
        this.categoryService.getAll().subscribe((r: Category[]) => {
            this.dataSource.data = r;
            this.isLoading = false;
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    openConfirmActionDialog(confirmActionDialogData: ConfirmActionDialogData) {
        return this._matDialog.open(ConfirmActionDialogComponent, {
            panelClass: 'confirm-action-dialog',
            data: confirmActionDialogData
        });
    }

    delete(category: Category) {
        const confirmActionDialogData: ConfirmActionDialogData = {
            message: $localize`Do you really want to delete ${category.name}?`,
        };
        this.openConfirmActionDialog(confirmActionDialogData).afterClosed().subscribe(res => {
            if (res) {
                this.categoryService.delete(category.id).subscribe(() => {
                    this.categoryService.triggerRefresh();
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: $localize`Category deleted successfully` });
                }, error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
                });
            }
        });
    }

    editCategory(category: Category) {
        this._matDialog.open(AddUpdateCategoryComponent, { data: category }).afterClosed().subscribe(e => {
            if (e){
            this.categoryService.triggerRefresh();
            }
        });
    }

    editSubCategories(category: any) {
        this.openSubCategory.emit(category);
    }

    onRowClicked(row: Category) {
        if (this.subCategoryPage) {
            this.onSelectedCategory.emit(row);
        }
    }
}
