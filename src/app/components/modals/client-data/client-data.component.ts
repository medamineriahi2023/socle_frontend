import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Method} from "../../../models/Method";
import {FieldMaxLength} from "../../../models/FieldMaxLength";

@Component({
  selector: 'app-client-data',
  templateUrl: './client-data.component.html',
  styleUrls: ['./client-data.component.scss']
})
export class ClientDataComponent {
    clientForm: FormGroup;
    title?: string;
    operation?:string;
     payed: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ClientDataComponent>) {
        this.title = "Client data";
        this.operation = "Generate";
        this.clientForm = new FormGroup({
                paymentMethod: new FormControl(""),
                fullName: new FormControl("", [Validators.required]),
                address: new FormControl("", [Validators.required]),
                phone: new FormControl("", [Validators.required]),
                method: new FormControl(null, [Validators.required]),
                clientAmount: new FormControl(0),
            },
        );

        this.clientForm.controls.clientAmount.valueChanges.subscribe(e => {
            this.returnCost = e - this.data.totalPrice;
        })    }


    onSubmit() {
        this.dialogRef.close(this.clientForm.value);
    }

    close() {
        this.dialogRef.close();
    }

    protected readonly Method = Method;
    returnCost: number = -1;

    userPayed() {
        this.payed = true;
        this.playAudio();
    }

    playAudio(){
        let audio = new Audio();
        audio.src = "../../../../assets/audio/cash.mp3";
        audio.load();
        audio.play();
    }

    protected readonly FieldMaxLength = FieldMaxLength;
}
