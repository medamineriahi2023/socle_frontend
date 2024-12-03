import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MessageService} from "primeng/api";
import {Product} from "../../../models/Product";
import {ProductService} from "../../../core/services/product/product.service";
import {SubCategoryService} from "../../../core/services/subCategory/subCategory.service";
import {SubCategory} from "../../../models/SubCategory";
import {BrandService} from "../../../core/services/brand/brand.service";
import {Brand} from "../../../models/Brand";
import {MatSelect} from "@angular/material/select";
import {Characteristic} from "../../../models/Characteristics";
import {UnitOfMeasure} from "../../../models/UnitOfMesure";
import {AddBrandComponent} from "../add-brand/add-brand.component";
import {CodeBarScannerComponent} from "../code-bar-scanner/code-bar-scanner.component";
import {Observable} from "rxjs";
import {FieldMaxLength} from "../../../models/FieldMaxLength";

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.scss']
})
export class AddEditProductComponent {

    selectedFiles?: FileList;
    selectedFileNames: string[] = [];

    progressInfos: any[] = [];
    message: string[] = [];

    previews: string[] = [];
    imageInfos?: Observable<any>;

    productForm: FormGroup;
    product: Product = {id: undefined, name: '', imageUrl: '', barCode:'', rating: 0, price:0, description: '', subCategory: null, characteristics: [], brand: null};
    submitted = false;
    subCategories: SubCategory[];
    brands: Brand[];
    characteristicControls: any[] = [];
    @ViewChild('subCategoriesList', {static: false}) subCategoriesList: MatSelect;
    title?: string;
    operation?:string;
    unitOfMeasures = Object.values(UnitOfMeasure);
    removedBg: string;
    isLoading: boolean;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                public dialogRef: MatDialogRef<AddEditProductComponent>,
                private productService:ProductService,
                private _matDialog: MatDialog,
                private subCategoryService:SubCategoryService,
                private brandService:BrandService,
                private formBuilder: FormBuilder,
                private messageService:MessageService) {
        if (this.data == null){
            this.title = $localize`Add new product`;
            this.operation = "Save"
        }else {
            this.title = $localize`Update product`;
            this.operation = "Update";
        }
        if (this.data?.imageUrl){
        this.previews.push(this.data?.imageUrl);
        }
        this.productForm = this.formBuilder.group({
                name: new FormControl(this.data?.name, [Validators.required]),
                description: new FormControl(this.data?.description, [Validators.required]),
                price: new FormControl(this.data?.price, [Validators.required, Validators.min(0)]),
                barcode: new FormControl(this.data?.barCode, [Validators.required]),
                subCategory: new FormControl({value: this.data?.subCategory, disabled: this.operation == "Update"}, [Validators.required]),
                brand: new FormControl(this.data?.brand?.id, [Validators.required]),
                unitOfMeasure: new FormControl(this.data?.unitOfMeasure, [Validators.required],),
                characteristics: new FormGroup({})
            },
        );
        if (this.data && this.data.characteristics) {
            const characteristicsGroup = this.productForm.get('characteristics') as FormGroup;
            this.data.characteristics.forEach(c => {
                characteristicsGroup.addControl(c.name, new FormControl(c.value, [Validators.required]));
                this.characteristicControls.push({ id: c.id, name: c.name, value: c.value });
            });
        }
        this.subCategoryService.getAllWithoutProducts().subscribe(s => {this.subCategories = s});
        this.brandService.getAll().subscribe(b => this.brands = b)
    }
    selectFiles(event: any): void {
        this.message = [];
        this.progressInfos = [];
        this.selectedFileNames = [];
        this.selectedFiles = event.target.files;
        this.previews = [];
        if (this.selectedFiles && this.selectedFiles[0]) {
            this.removedBg = null;
            const numberOfFiles = this.selectedFiles.length;
            for (let i = 0; i < numberOfFiles; i++) {
                const reader = new FileReader();

                reader.onload = (e: any) => {
                    console.log(e.target.result);
                    this.previews.push(e.target.result);
                };

                reader.readAsDataURL(this.selectedFiles[i]);

                this.selectedFileNames.push(this.selectedFiles[i].name);
            }
        }
    }


    onSubmit() {
        this.product.name = this.productForm.get('name').value;
        this.product.description = this.productForm.get('description').value;
        this.product.price = this.productForm.get('price').value;
        this.product.barCode = this.productForm.get('barcode').value;
        this.product.unitOfMeasure = this.productForm.get('unitOfMeasure').value;
        this.product.imageUrl = this.removedBg;
        let subCategory = new SubCategory();
        subCategory.id = this.productForm.get('subCategory').value?.id;
        this.product.subCategory = subCategory;
        let brand = new Brand();
        brand.id = this.productForm.get('brand').value;
        this.product.brand = brand;
        const characteristicsFormValue = this.productForm.get('characteristics').value;
        this.product.characteristics = this.characteristicControls.map(control => {
            return { id: control.id, name: control.name, value: characteristicsFormValue[control.name] } as Characteristic;
        });
            if (this.operation === "Save") {
                this.productService.save(this.product).subscribe(e => {
                    this.dialogRef.close(true);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: $localize`Product added successfully`
                    });
                }, error => {
                    this.messageService.add({severity: 'error', summary: 'Error', detail:  error.error.message});
                })
            } else {
                this.product.id = this.data?.id;
                this.productService.update(this.product).subscribe(e => {
                    this.dialogRef.close(true);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: $localize`Product edited successfully`
                    });
                }, error => {
                    this.messageService.add({severity: 'error', summary: 'Error', detail:  error.error.message});
                })
            }
            this.submitted = true;

    }

    close() {
        this.dialogRef.close();
    }

    onSubCategoryChange(event) {
        const selectedSubCategory = event.value as SubCategory;
        const characteristicsGroup = this.productForm.get('characteristics') as FormGroup;
        this.characteristicControls = [];
        selectedSubCategory.characNames.forEach(characName => {
            characteristicsGroup.addControl(characName, new FormControl('', [Validators.required]));
            this.characteristicControls.push({ name: characName });
        });
    }

    addBrand() {
        this._matDialog.open(AddBrandComponent, {}).afterClosed().subscribe(e => {
            this.brandService.getAll().subscribe(b => this.brands = b);
        });
    }

    openScanner() {
        this._matDialog.open(CodeBarScannerComponent, {}).afterClosed().subscribe(e => {
            if (e){
            this.productForm.get('barcode').setValue(e);
            }
        });
    }

    removeBg() {
        this.isLoading = true;
        this.productService.removeBg(this.selectedFiles[0]).subscribe(e => {this.removedBg = e.url;
        this.isLoading= false;
        });
    }

    protected readonly FieldMaxLength = FieldMaxLength;
}
