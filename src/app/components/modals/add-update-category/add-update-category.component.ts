import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MessageService} from "primeng/api";
import {Category} from "../../../models/Category";
import {CategoriesService} from "../../../core/services/categories/categories.service";
import {FieldMaxLength} from "../../../models/FieldMaxLength";

@Component({
  selector: 'app-add-update-category',
  templateUrl: './add-update-category.component.html',
  styleUrls: ['./add-update-category.component.scss']
})
export class AddUpdateCategoryComponent {
    categoryform: FormGroup;
    category: Category = {id: undefined, name: '',color:'', subCategories: []};
    submitted = false;

    title?: string;
    operation?:string;
    color: any;
     height: string;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                public dialogRef: MatDialogRef<AddUpdateCategoryComponent>,
                private categoriesService:CategoriesService,
                private messageService:MessageService) {
        if (this.data == null){
            this.title = "Add new Category";
            this.operation = "Save";
        }else {
            this.title = "Update Category";
            this.operation = "Update";
        }
        this.categoryform = new FormGroup({
                name: new FormControl(this.data?.name, [Validators.required]),
                color: new FormControl(this.data?.color, [Validators.required]),
            },
        );
    }


    onSubmit() {
        this.category.name = this.categoryform.get('name').value;
        this.category.color = this.categoryform.get('color').value;
            if (this.operation === "Save") {
                this.categoriesService.save(this.category).subscribe(e => {
                    this.dialogRef.close(true);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Category added successfully'
                    });
                }, error => {
                    this.messageService.add({severity: 'error', summary: 'Error', detail:  error.error.message});
                })
            } else {
                this.category.id = this.data?.id;
                this.categoriesService.update(this.category).subscribe(e => {
                    this.dialogRef.close(true);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Category edited successfully'
                    });
                }, error => {
                    this.messageService.add({severity: 'error', summary: 'Error', detail:  error.error.message});
                })
            this.submitted = true;
        }
    }

    close() {
        this.dialogRef.close();
    }

    changeHeight() {
        this.height= "500px";
    }

    hide() {
        this.height= "auto";
    }

    protected readonly FieldMaxLength = FieldMaxLength;
}
