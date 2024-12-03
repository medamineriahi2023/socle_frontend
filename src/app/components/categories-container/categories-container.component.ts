import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Group} from "../../models/Group";
import {AddUpdateCategoryComponent} from "../modals/add-update-category/add-update-category.component";
import {Category} from "../../models/Category";
import {CategoriesService} from "../../core/services/categories/categories.service";

@Component({
  selector: 'app-categories-container',
  templateUrl: './categories-container.component.html',
  styleUrls: ['./categories-container.component.scss']
})
export class CategoriesContainerComponent {
    filterValue = '';
    public refresh: boolean = false;
    @Input() isUserAdmin: boolean =false;
    @Input() userId: string;
    @Output() changeSelectedPanel = new EventEmitter<any>();
    @Input() selectedCategory!: Category;
    @Input() subCategoryPage!: boolean;
    @Output() getCategory = new EventEmitter<Category>();

    constructor(private _matDialog: MatDialog,
                private categoryService:CategoriesService) {
    }

    addGroup() {
        this._matDialog.open(AddUpdateCategoryComponent, {}).afterClosed().subscribe(e => {
            if (e) {
                this.categoryService.triggerRefresh();
            }
        });
    }


    openSubCategory(category: any) {
        this.changeSelectedPanel.emit(category);
        this.selectedCategory = category;
    }

    onSelectedCategory($event: Category) {
        this.getCategory.emit($event);
    }
}
