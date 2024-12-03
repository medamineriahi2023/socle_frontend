import {Component, Inject} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Category} from "../../../models/Category";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CategoriesService} from "../../../core/services/categories/categories.service";
import {MessageService} from "primeng/api";
import {SubCategory} from "../../../models/SubCategory";
import {SubCategoryService} from "../../../core/services/subCategory/subCategory.service";
import {FieldMaxLength} from "../../../models/FieldMaxLength";

@Component({
  selector: 'app-add-edit-subcategory',
  templateUrl: './add-edit-subcategory.component.html',
  styleUrls: ['./add-edit-subcategory.component.scss']
})
export class AddEditSubcategoryComponent {
    subCategoryForm: FormGroup;
    subCategory: SubCategory = {id: undefined, name: '', rankCode: '', characNames: [], color: ""};
    submitted = false;

    characteristicsNames: string[] = [];

    title?: string;
    operation?:string;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                public dialogRef: MatDialogRef<AddEditSubcategoryComponent>,
                private subCategoryService:SubCategoryService,
                private categoriesService:CategoriesService,
                private messageService:MessageService,
                private formBuilder: FormBuilder,) {
        if (this.data?.subcategory == null){
            this.title = "Add new Sub-Category";
            this.operation = "Save";
        }else {
            this.title = "Update Sub-Category";
            this.operation = "Update";
        }
        this.subCategoryForm = this.formBuilder.group({
                name: [this.data?.subcategory?.name, [Validators.required]],
            rankCode: [this.data?.subcategory?.rankCode, [Validators.required]],
            color: [this.data?.subcategory?.color, [Validators.required]],
            characNames: this.buildCharacteristics(),
            },
        );
        if (data?.subcategory){
            data.subcategory.characNames.forEach(e => this.addCharacteristicField(e));
        }else {
            this.addCharacteristicField()
        }
    }
    buildCharacteristics(characteristics: string[] = []): FormArray {
        return this.formBuilder.array(
            characteristics.map(e => this.formBuilder.control(e, Validators.required))
        );
    }

    addCharacteristicField(value?: string) {
        this.characNames.push(this.formBuilder.group({
            '0': new FormControl(value, Validators.required)
        }));
    }

    removeCharacteristicField(index: number): void {
        if (this.characNames.length > 1) {
            this.characNames.removeAt(index);
        } else {
            this.characNames.at(0).setValue(null);
        }
    }

    get characNames(): FormArray {
        return this.subCategoryForm.get('characNames') as FormArray;
    }


    close() {
        this.dialogRef.close();
    }
    onSubmit() {
        this.characNames.value.forEach((char) => {this.characteristicsNames.push(char[0])});
        this.subCategory.name = this.subCategoryForm.controls["name"].value;
        this.subCategory.rankCode = this.subCategoryForm.controls["rankCode"].value;
        this.subCategory.color = this.subCategoryForm.controls["color"].value;
        this.subCategory.characNames = this.characteristicsNames;

        if (this.operation === "Save") {
            this.categoriesService.saveSubCategoryToCategory(this.subCategory,this.data.categoryId).subscribe((e:Category) => {
                this.dialogRef.close(e);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'subCategory added successfully'
                });
            }, error => {
                this.messageService.add({severity: 'error', summary: 'Error', detail:  error.error.message});
            })
        } else {
            this.subCategory.id = this.data?.subcategory?.id;
            this.subCategoryService.update(this.subCategory).subscribe(e => {
                this.dialogRef.close(e);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'subCategory edited successfully'
                });
            }, error => {
                this.messageService.add({severity: 'error', summary: 'Error', detail:  error.error.message});
            })
            this.submitted = true;
        }
    }


    protected readonly FieldMaxLength = FieldMaxLength;
}
