import {Component, Input} from '@angular/core';
import {Product} from "../../models/Product";
import {AddUpdateCategoryComponent} from "../modals/add-update-category/add-update-category.component";
import {MatDialog} from "@angular/material/dialog";
import {AddEditProductComponent} from "../modals/add-edit-product/add-edit-product.component";
import {ProductService} from "../../core/services/product/product.service";

@Component({
  selector: 'app-product-container',
  templateUrl: './product-container.component.html',
  styleUrls: ['./product-container.component.scss']

})
export class ProductContainerComponent {
    filterValue = '';
    public refresh: boolean = false;
    @Input() isUserAdmin: boolean =false;
    @Input() userId: string;

    constructor(private _matDialog: MatDialog,
                private productService: ProductService) {
    }
    addProduct() {
        this._matDialog.open(AddEditProductComponent, {}).afterClosed().subscribe(e => {
            if(e){
                this.productService.triggerRefresh();
            }
            });
    }
}
