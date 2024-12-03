import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MessageService} from "primeng/api";
import {InventoryService} from "../../../core/services/inventory/inventory.service";

@Component({
  selector: 'app-add-quantity',
  templateUrl: './add-quantity.component.html',
  styleUrls: ['./add-quantity.component.scss']
})
export class AddQuantityComponent {
    quantityForm: FormGroup;
    title?: string;
    operation?:string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<AddQuantityComponent>,
        private inventoryService: InventoryService,
        private messageService: MessageService) {
        this.title = "Add quantity for the product " + data.product.name + data?.inventory ? " to add to the inventory " + data?.inventory?.name : "";
        this.operation = "add";
        this.quantityForm = new FormGroup({
            quantity: new FormControl(
                this.data?.quantity,
                [Validators.required,
                    Validators.min(1), // Ensure the quantity is at least 1
                    this.data?.depot || this.data?.verifyRequests ? Validators.max(this.data.quantity) : null
                ].filter(validator => validator !== null)  // Remove null validators
            ),
        });
    }


    onSubmit() {
        let quantity = this.quantityForm.get("quantity").value;
        if (this.data.verifyRequests){
            this.dialogRef.close(quantity);
        }else if (this.data?.depot == null) {
            this.inventoryService.addProductToAnInventoryByAdmin(quantity, this.data?.product?.id, this.data?.inventory?.id).subscribe(e => {
                this.dialogRef.close(e);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'product added to inventory successfully'
                });
            }, error => {
                this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message});
            })
        }else {
            this.dialogRef.close(quantity);
        }

    }

    close() {
        this.dialogRef.close();
    }

}

