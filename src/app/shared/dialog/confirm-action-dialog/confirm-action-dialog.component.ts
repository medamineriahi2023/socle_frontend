import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ConfirmActionDialogData} from "../../../components/modals/models";

@Component({
  selector: 'app-confirm-action-dialog',
  templateUrl: './confirm-action-dialog.component.html',
  styleUrls: ['./confirm-action-dialog.component.scss']
})
export class ConfirmActionDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<ConfirmActionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmActionDialogData) {
    }

    onConfirm() {
        if (!!this.data.onConfirm) {
            this.data.onConfirm();
        }
    }
}
