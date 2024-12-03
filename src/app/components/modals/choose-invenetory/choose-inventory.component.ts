import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Inventory} from "../../../models/Inventory";

@Component({
  selector: 'app-choose-inventory',
  templateUrl: './choose-inventory.component.html',
  styleUrls: ['./choose-inventory.component.scss']
})
export class ChooseInventoryComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                public dialogRef: MatDialogRef<ChooseInventoryComponent>
    ){
    }

    getSelectedDepot($event: Inventory) {
        this.dialogRef.close($event);
    }
}
