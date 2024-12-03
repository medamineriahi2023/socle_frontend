import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import * as htmlToImage from 'html-to-image';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<UserInfoComponent>
    ){

        console.log(this.data.user);
    }
    close() {
        this.dialogRef.close();
    }

    clickToCapture() {
        var node = document.getElementById('content');
        htmlToImage
            .toJpeg(node)
            .then(function (dataUrl) {
                var link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'badge.png';
                link.click();
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
            });
    }

    dataToString(user: any){
        return "{ firstName : "+ user.firstName + " lastName : "+ user.lastName + " matricule : "+ user.immaculate + " }";
    }
}
