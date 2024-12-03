import {Component, Input} from '@angular/core';
import {Category} from "../../models/Category";
import {MatDialog} from "@angular/material/dialog";
import {SubCategory} from "../../models/SubCategory";
import {AddEditSubcategoryComponent} from "../modals/add-edit-subcategory/add-edit-subcategory.component";

@Component({
  selector: 'app-sub-category-container',
  templateUrl: './sub-category-container.component.html',
  styleUrls: ['./sub-category-container.component.scss']
})
export class SubCategoryContainerComponent {
    @Input() isUserAdmin!: boolean;
    @Input() selectedCategory: Category = null;
    filterValue = '';
    public refresh: boolean = false;
    @Input() userId: string;
    @Input() subCategoryPage!: boolean;
    activeIndex: number;
    onSelectedCategory($event: Category) {
        this.selectedCategory= $event;
        this.activeIndex= 0;
    }

    constructor(private _matDialog: MatDialog) {
    }


    addSubCategory() {
        this._matDialog.open(AddEditSubcategoryComponent, {
            data: { subcategory :null,
                categoryId :this.selectedCategory.id}
        }).afterClosed().subscribe(e => {
            if (e){
                this.selectedCategory = e;
            }
            this.refresh = true;
        });
    }


    filterPredicate: (subCategory: SubCategory, filter: string) => boolean = (subCategory: SubCategory, filter: string): boolean => {
        const keys = ['name'];
        let dataStr = Object.keys(subCategory as unknown as Record<string, any>).filter(key => keys.includes(key))
            .reduce((currentTerm: string, key: string) => {
                return currentTerm + (subCategory as unknown as Record<string, any>)[key] + '◬';
            }, '')
            .toLowerCase();
        const transformedFilter = filter.trim().toLowerCase();
        return dataStr.indexOf(transformedFilter) !== -1;
    };




    activeIndexChange($event: any) {
        if ($event == null || $event == 0){
            this.selectedCategory = null;
        }
    }
}
