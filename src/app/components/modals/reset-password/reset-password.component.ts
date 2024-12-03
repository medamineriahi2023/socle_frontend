import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CustomValidators} from "../../../core/utils/CustomValidators";
import {UserService} from "../../../core/services/user/user.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
    passForm: FormGroup;
    submitted = false;
    StrongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                public dialogRef: MatDialogRef<ResetPasswordComponent>,
                public userService: UserService,
                private messageService:MessageService
    ) {
        this.passForm = new FormGroup({
                password: new FormControl(null, [Validators.required ,Validators.pattern(this.StrongPasswordRegx)]),
                repeatPassword: new FormControl(null, [Validators.required]),
            },
            CustomValidators.mustMatch('password', 'repeatPassword')
        );
    }

    get passwordFormField() {
        return this.passForm.get('password');
    }


    onSubmit() {

        let password = this.passForm.get('password').value;

        this.userService.resetPassword(this.data , password).subscribe(e => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User password has been changed!' });
        });
        this.submitted = true;
        this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }

}
