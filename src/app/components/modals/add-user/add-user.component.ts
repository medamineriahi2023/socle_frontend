import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {User} from "../../../models/User";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CustomValidators} from "../../../core/utils/CustomValidators";
import {UserService} from "../../../core/services/user/user.service";
import {MessageService} from "primeng/api";
import {OrganizationService} from "../../../core/services/organization/organization.service";
import {MatSelect} from "@angular/material/select";
import {CountryISO, PhoneNumberFormat, SearchCountryField} from "ngx-intl-telephone-input";
import {InputValue} from "ngx-intl-telephone-input/models/country";
import {debounceTime, filter, finalize, switchMap, tap} from "rxjs";
import {DocumentService} from "../../../core/services/documents/Document.service";
import {FieldMaxLength} from "../../../models/FieldMaxLength";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, AfterViewInit{
    file: string = '';
    selectedImage: File;
    userForm: FormGroup;
    user: User = {id: undefined, firstName: '', lastName: '', userName: '', email: '', phone: '', password: '', active: true, isDeliveryMan: null};
    title?: string;
    operation?:string;
    organisations:any[];
    @ViewChild('organisationsList', {static: false}) organisationList: MatSelect;
    StrongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
    phoneNumber: InputValue;
    usernameSuggestions: string[] = [];
    loading: boolean= false;
    isUsernameTaken: boolean;
    usernameMessage: string;



    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<AddUserComponent>,
        private userService:UserService,
        private organisationService:OrganizationService,
        private messageService:MessageService,
        private documentService:DocumentService
    ) {
        this.organisations= this.data?.organisations?.organizations;
        if (this.data?.user == null){
            this.title = $localize`Add new user`;
            this.operation = "Save"
        }else {
            this.title = $localize`Update user`;
            this.operation = "Update";
        }
        if (this.data?.user?.imageUrl){
            this.file = this.data.user.imageUrl;
        }

        this.userForm = new FormGroup({
                userName: new FormControl({ value : this.data?.user?.userName , disabled: this.operation === "Update"}, [Validators.required]),
                firstName: new FormControl(this.data?.user?.firstName, [Validators.required]),
                lastName: new FormControl(this.data?.user?.lastName, [Validators.required]),
                email: new FormControl({value: this.data?.user?.email , disabled: this.operation === "Update"}, [Validators.required, Validators.email]),
                password: new FormControl(this.data?.user?.password, this.operation == 'Save' ? [Validators.required, Validators.pattern(this.StrongPasswordRegx)] : null),
                confirmPassword: new FormControl(this.data?.user?.password, this.operation == 'Save' ? [Validators.required, Validators.pattern(this.StrongPasswordRegx)] : null),
                 active: new FormControl(this.data?.user?.active),
                 isDeliveryMan: new FormControl(this.data?.user?.isDeliveryMan)
            },
            CustomValidators.mustMatch('password', 'confirmPassword')
        );
    }

    fetchUsernameSuggestions() {
        this.loading= true;
        const firstName = this.userForm.get('firstName').value;
        const lastName = this.userForm.get('lastName').value;
        this.userService.getUserNameSuggestions(firstName, lastName)
            .subscribe(suggestions => {
                this.usernameSuggestions = suggestions;
                setTimeout(()=> {
                    this.loading= false;
                }, 1000)
            });
    }
    onFileChange(event: any) {
        const files = event.target.files as FileList;

        if (files.length > 0) {
            this.selectedImage = files[0];
            const _file = URL.createObjectURL(files[0]);
            this.file = _file;
            this.resetInput();
        }

    }



    resetInput(){
        const input = document.getElementById('avatar-input-file') as HTMLInputElement;
        if(input){
            input.value = "";
        }
    }


    selectSuggestion(suggestion: string) {
        this.userForm.get('userName').setValue(suggestion);
        this.usernameSuggestions = [];
    }

    ngAfterViewInit(): void {

    }

    ngOnInit(): void {
        this.userForm.controls.userName.valueChanges
            .pipe(
                debounceTime(100),
                filter(username => username.length > 2),
                tap(() => this.loading = true),
                switchMap(username =>
                    this.userService.checkUsernameExistence(username).pipe(
                        finalize(() => setTimeout(()=> {this.loading = false}, 500) )
                    )
                )
            )
            .subscribe((response: boolean) => {
                if (response) {
                    this.isUsernameTaken = true;
                    this.userForm.controls.userName.setErrors({ usernameTaken: true });

                } else {
                    this.isUsernameTaken = false;
                    this.userForm.controls.userName.setErrors(null);

                }
            });
        }
    get passwordFormField() {
        return this.userForm.get('password');
    }

     async onSubmit() {
        this.user.userName = this.userForm.get('userName').value;
        this.user.firstName = this.userForm.get('firstName').value;
        this.user.lastName = this.userForm.get('lastName').value;
        this.user.email = this.userForm.get('email').value;
        this.user.password = this.userForm.get('password').value;
        this.user.active = this.userForm.get('active').value;
        this.user.isDeliveryMan = this.userForm.get('isDeliveryMan').value;
            if (this.selectedImage != null) {
                await this.documentService.saveFile(this.selectedImage).toPromise().then(e => {this.user.imageUrl = e.url ; console.log(e)});
            }else {
                this.user.imageUrl =this.file;
            }

        if (this.data.selectedTab == 1){
        if (this.operation === "Save"){
            this.user.phone = this.phoneNumber.phoneNumber;
            this.organisationService.createAndAssignUser(this.user, this.organisationList.value.join(",")).subscribe(u  => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User added successfully' });this.dialogRef.close(true)},
                error => {this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });});
        }else {
            this.user.id = this.data?.user?.id;
            this.user.password = "21282925Aa*"
            this.userService.updateUser(this.user).subscribe(u  => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User edited successfully' });this.dialogRef.close(true)},
                error => {this.messageService.add({ severity: 'error', summary: 'Error', detail: "User not edited" });});
        }
        }else {
            if (this.operation === "Save"){
                this.user.phone = this.phoneNumber.phoneNumber;
                this.organisationService.createAndAssignUser(this.user).subscribe(u  => {u.error_security == null? this.messageService.add({ severity: 'success', summary: 'Success', detail:  u?.message }) : this.messageService.add({ severity: 'error', summary: 'Error', detail: u.error_security?.http_body }) ;this.dialogRef.close(true);});
            }else {
                this.user.id = this.data?.user?.id;
                this.user.password = "21282925Aa*";
                this.userService.updateUser(this.user).subscribe(u  => { this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User edited successfully' });this.dialogRef.close(true)},
                    error => {this.messageService.add({ severity: 'error', summary: 'Error', detail: "User not edited" });});
            }
        }


    }

    checkUsername(): void {
        const username = this.userForm.controls.userName.value;
        if (username) {
            this.userService.checkUsernameExistence(username).subscribe((response: any) => {
                if (response.exists) {
                    this.isUsernameTaken = true;
                    this.usernameMessage = 'Username is already taken.';
                } else {
                    this.isUsernameTaken = false;
                    this.usernameMessage = 'Username is available.';
                }
            });
        }
    }

    close() {
        this.dialogRef.close();
    }

    protected readonly CountryISO = CountryISO;
    protected readonly SearchCountryField = SearchCountryField;
    protected readonly PhoneNumberFormat = PhoneNumberFormat;

    onInputChange($event: InputValue) {
        this.phoneNumber = $event;
    }

    protected readonly FieldMaxLength = FieldMaxLength;
}
