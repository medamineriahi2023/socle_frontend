import {Component, Input} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Product} from "../../models/Product";
import {AddEditInventoryComponent} from "../modals/add-edit-inventory/add-edit-inventory.component";
import {Inventory} from "../../models/Inventory";
import {InventoryService} from "../../core/services/inventory/inventory.service";

@Component({
  selector: 'app-inventory-container',
  templateUrl: './inventory-container.component.html',
  styleUrls: ['./inventory-container.component.scss']
})
export class InventoryContainerComponent {
    filterValue = '';
    public refresh: boolean = false;
    public checkProduct: boolean = false;
    public depot: Inventory;
    @Input() isUserAdmin: boolean =false;
    @Input() userId: string;
    selectedInventory: Inventory = null;
    selectedProductBarCode: string = null;

    constructor(private _matDialog: MatDialog,
                private inventoryService:InventoryService) {
    }
    addProduct() {
        this._matDialog.open(AddEditInventoryComponent, {}).afterClosed().subscribe(e => {
            if (e){
            this.inventoryService.refreshTrigger();
            }
        });
    }
    addProductforInventory($event: Inventory) {
        this.selectedInventory = $event;
    }

    activeIndexChange($event: any) {
        if ($event == null || $event == 0){
            this.selectedInventory = null;
            this.selectedProductBarCode = null;
            this.depot = null;
        }
    }

    productBarCode($event: string) {
        this.selectedProductBarCode = $event;
    }

    getCheckProduct($event: boolean) {
        this.checkProduct = $event;
    }

    getDepotProduct($event: Inventory) {
        this.depot = $event;
    }
}
