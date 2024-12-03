import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Role} from 'app/models/Role';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../../core/services/user/user.service";
import {MessageService} from "primeng/api";
import {isBoolean} from "lodash";
import {OrganizationService} from "../../../core/services/organization/organization.service";
import {FieldMaxLength} from "../../../models/FieldMaxLength";

@Component({
    selector: 'app-add-edit-role',
    templateUrl: './add-edit-role.component.html',
    styleUrls: ['./add-edit-role.component.scss']
})
export class AddEditRoleComponent {
    roleForm: FormGroup;
    role: Role = {id: undefined, name: ''};
    submitted = false;

    title?: string;
    operation?:string;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                public dialogRef: MatDialogRef<AddEditRoleComponent>,
                private userService:UserService,
                private messageService:MessageService,
                private organisationService:OrganizationService) {
        if (this.data?.role == null){
            this.title = $localize`Add new role`;
            this.operation = "Save"
        }else {
            this.title = $localize`Update role`;
            this.operation = "Update";
        }
        this.roleForm = new FormGroup({
                name: new FormControl(this.data?.role?.name, [Validators.required]),
            },
        );
    }


    onSubmit() {
        this.role.name = this.roleForm.get('name').value;
        if (this.data?.selectedTab == 1) {
            if (this.operation === "Save") {
                this.userService.saveRole(this.role.name).subscribe(e => {
                    this.dialogRef.close(true);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: $localize`Role added successfully`
                    });
                }, error => {
                    this.messageService.add({severity: 'error', summary: 'Error', detail: "Error occurred"});
                })
            } else {
                this.role.id = this.data?.role?.id;
                this.userService.updateRole(this.role).subscribe(e => {
                    this.dialogRef.close(true);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: $localize`Role edited successfully`
                    });
                }, error => {
                    this.messageService.add({severity: 'error', summary: 'Error', detail: $localize`Error occurred`});
                })
            }
            this.submitted = true;

        }else {
            if (this.operation === "Save"){
                this.organisationService.saveRole(this.role.name).subscribe(e => {this.dialogRef.close(true);
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: $localize`Role added successfully` });
                }, error => {this.messageService.add({ severity: 'error', summary: 'Error', detail: $localize`Error occurred` });})
            }else {
                this.role.id = this.data?.role?.id;
                this.organisationService.updateRole(this.role).subscribe(e  => {this.dialogRef.close(true);
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: $localize`Role edited successfully` });
                }, error => {this.messageService.add({ severity: 'error', summary: 'Error', detail: $localize`Error occurred`});})
            }
            this.submitted = true;
        }

    }

    close() {
        this.dialogRef.close();
    }

    protected readonly FieldMaxLength = FieldMaxLength;
}
