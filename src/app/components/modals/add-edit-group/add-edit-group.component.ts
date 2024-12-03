import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Group} from "../../../models/Group";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../../core/services/user/user.service";
import {MessageService} from "primeng/api";
import {FieldMaxLength} from "../../../models/FieldMaxLength";

@Component({
    selector: 'add-edit-group',
    templateUrl: './add-edit-group.component.html',
    styleUrls: ['./add-edit-group.component.scss']
})
export class AddEditGroupComponent{
    groupForm: FormGroup;
    group: Group = {id: undefined, name: '', groupName: '', description: undefined};
    submitted = false;

    title?: string;
    operation?: string;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                public dialogRef: MatDialogRef<AddEditGroupComponent>,
                public userService: UserService,
                private messageService: MessageService) {
        if (this.data == null){
            this.title = $localize`:@@addGroupTitle:Add new group`;
            this.operation = $localize`:@@saveOperation:Save`;
        } else {
            this.title = $localize`:@@updateGroupTitle:Update group`;
            this.operation = $localize`:@@updateOperation:Update`;
        }
        this.groupForm = new FormGroup({
                name: new FormControl(this.data?.name, [Validators.required]),
            },
        );
    }

    onSubmit() {
        this.group.name = this.groupForm.get('name').value;
        if (this.operation === $localize`:@@saveOperation:Save`){
            this.userService.saveGroup(this.group).subscribe(e => {
                this.dialogRef.close(true);
                this.messageService.add({ severity: 'success', summary: $localize`:@@successSummary:Success`, detail: $localize`:@@groupSavedSuccessfully:Group saved successfully`})
            }, error => {this.messageService.add({ severity: 'error', summary: $localize`:@@errorSummary:Error`, detail: error.error.message });})
        } else {
            this.group.id = this.data.id;
            this.userService.updateGroup(this.group).subscribe(e => {
                this.dialogRef.close(true);
                this.messageService.add({ severity: 'success', summary: $localize`:@@successSummary:Success`, detail: $localize`:@@groupEditedSuccessfully:Group edited successfully` })
            }, error => {this.messageService.add({ severity: 'error', summary: $localize`:@@errorSummary:Error`, detail: error.error.message });})
        }

        this.submitted = true;
    }

    close() {
        this.dialogRef.close();
    }

    protected readonly FieldMaxLength = FieldMaxLength;
}
