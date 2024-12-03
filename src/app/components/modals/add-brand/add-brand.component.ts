import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {MessageService} from "primeng/api";
import {Brand} from "../../../models/Brand";
import {BrandService} from "../../../core/services/brand/brand.service";
import {FieldMaxLength} from "../../../models/FieldMaxLength";

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.scss']
})
export class AddBrandComponent {
    brandForm: FormGroup;
    brand: Brand = {id: undefined, name: ''};
    title?: string;
    operation?:string;

    constructor(
                public dialogRef: MatDialogRef<AddBrandComponent>,
                private brandService:BrandService,
                private messageService:MessageService) {
            this.title = $localize`Add new role`;
            this.operation = "Save"
        this.brandForm = new FormGroup({
                name: new FormControl("", [Validators.required]),
            },
        );
    }


    onSubmit() {
        this.brand.name = this.brandForm.get('name').value;
                this.brandService.save(this.brand).subscribe(e => {
                    this.dialogRef.close();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: $localize`Brand added successfully`
                    });
                }, error => {
                    this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message});
                })

    }

    close() {
        this.dialogRef.close();
    }

    protected readonly FieldMaxLength = FieldMaxLength;
}

