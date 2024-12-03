import {ChangeDetectorRef, Component, Inject, ViewChild} from '@angular/core';
import {MatSelect} from "@angular/material/select";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatOption} from "@angular/material/core";
import {TrackingService} from "../../../core/services/tracking/tracking.service";
import {TrackingUserList} from "../../../models/TrackingListData";

@Component({
  selector: 'app-select-dilevery',
  templateUrl: './select-dilevery.component.html',
  styleUrls: ['./select-dilevery.component.scss']
})
export class SelectDileveryComponent {
    @ViewChild('usersList', {static: false}) usersList: MatSelect;
    usersIds : any[] = [];
    users: any[];
    filter:string ="";

    constructor(
        public dialogRef: MatDialogRef<SelectDileveryComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private trackingService : TrackingService){
        this.users = data.kcUsers;

    }
    close() {
        this.dialogRef.close(false);
    }



    toggleAllSelection(event) {

        if (event.source.selected){
            this.usersList.options.forEach((option: MatOption) => {
                if (option._getHostElement().style.display !== "none" && option.value != undefined) {
                    option.select();
                }
            });
        }
        else
            this.usersList.value = [];

    }

    add(){
        let tracking = new TrackingUserList();
        tracking.userId = this.usersList.value;
        tracking.commandId = this.data.commandId;
        this.trackingService.saveUserData(tracking).subscribe(e => {
            this.dialogRef.close(true);
        }, error => {
            this.dialogRef.close(false);
        })

    }
}
