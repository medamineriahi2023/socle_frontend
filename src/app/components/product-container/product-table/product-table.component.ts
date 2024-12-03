import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {MessageService} from "primeng/api";
import {ConfirmActionDialogData} from "../../modals/models";
import {
    ConfirmActionDialogComponent
} from "../../../shared/dialog/confirm-action-dialog/confirm-action-dialog.component";
import {Product} from "../../../models/Product";
import {ProductService} from "../../../core/services/product/product.service";
import {AddEditProductComponent} from "../../modals/add-edit-product/add-edit-product.component";
import {Inventory} from 'app/models/Inventory';
import {AddQuantityComponent} from "../../modals/add-quantity/add-quantity.component";
import {add} from "lodash-es";
import {RequestedProductQuantity} from "../../../models/RequestedProductQuantity";
import {ListOfRequestsComponent} from "../../modals/list-of-requests/list-of-requests.component";
import {CodeBarScannerComponent} from "../../modals/code-bar-scanner/code-bar-scanner.component";
import Swal from 'sweetalert2'
import {FormControl} from "@angular/forms";
import {SubCategory} from "../../../models/SubCategory";
import {CategoriesService} from "../../../core/services/categories/categories.service";
import {Category} from "../../../models/Category";
import {BrandService} from "../../../core/services/brand/brand.service";
import {Brand} from "../../../models/Brand";
import {ViewProductComponent} from "../../modals/view-product/view-product.component";

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss']
})
export class ProductTableComponent implements OnInit,OnChanges{

    displayedColumns: string[] = null;
    dataSource: MatTableDataSource<Product>;
    products: Product[];
    requestedProducts: RequestedProductQuantity[] = [];
    @Input() refresh : boolean = false;
    isLoading: boolean= false;
    categories: Category[];
    brands: Brand[];
    subCategories: SubCategory[] = [];
    sortOrder: boolean = true; // true for ascending, false for descending

    @Input() filterValue = '';
    @Input() filterPredicate: (data: Product, filter: string) => boolean;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Input() isUserAdmin: boolean = false;
    @Input() selectedInventory!: Inventory;
    @Input() selectedProductBarCode!: string;
    @Input() checkProduct!: boolean;
    @Input() depot!: Inventory;
    public filtredData: Product[];
    constructor(
        private _matDialog: MatDialog,
        private productService:ProductService,
        private categoriesService:CategoriesService,
        private brandService:BrandService,
        private messageService:MessageService
    ) {
        this.displayedColumns = ['IMAGE', 'NAME', 'DESCRIPTION', 'BRAND', 'PRICE', 'CATEGORY', 'SUB-CATEGORY' ,'ACTIONS'];
        this.dataSource = new MatTableDataSource();
    }
    categoryForm: FormControl<Category[]> = new FormControl();
    subCategoryForm: FormControl<SubCategory[]> = new FormControl({value: [] , disabled: this.subCategories.length <= 0}, []);
    brandForm: FormControl<number[]> = new FormControl([]);
    sortForm: FormControl<any> = new FormControl("-1");
    ngOnInit(): void {
        this.productService.refresh$.subscribe(refresh=> {
            if (refresh){
                this.listenForDataChnages();
            }
        });
        this.categoriesService.getCategoryWithoutProducts().subscribe(s => { this.categories = s });
        this.brandService.getAll().subscribe(s => { this.brands = s });
        this.filterChange();
        this.listenForDataChnages();

        this.categoryForm.valueChanges.subscribe(() => {
            this.subCategories = this.categoryForm.value.flatMap(s => s.subCategories);
            this.filterProducts();
            this.onSubCategoriesChange();
        });

        this.subCategoryForm.valueChanges.subscribe(() => {
            this.filterProducts();

        });

        this.brandForm.valueChanges.subscribe(() => {
            this.filterProducts();
        });
    }
    sortProducts() {
        const sortOption = this.sortForm.value;
        const data = this.dataSource.data;
        switch (sortOption) {
            case "0": // Name
                data.sort((a, b) => this.sortOrder ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
                break;
            case "1": // Price
                data.sort((a, b) => this.sortOrder ? a.price - b.price : b.price - a.price);
                break;
            case "2": // Date
                data.sort((a, b) => this.sortOrder ? new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime() : new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
                break;
            case "3": // Pertinence
                    // Implement pertinence sorting logic if you have one, otherwise, leave it as is
                break;
            case "-1": // Pertinence
                data.sort((a, b) => this.sortOrder ? new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime() : new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
                break;
            default:
                break;
        }
        this.dataSource.data = data;
    }
    updateFormControlState() {
        if (this.subCategories.length > 0) {
            this.subCategoryForm.enable();
        } else {
            this.subCategoryForm.disable();
        }
    }
    toggleSortOrder() {
        if (this.sortForm.value !== '-1') {
            this.sortOrder = !this.sortOrder;
            this.sortProducts();
        }
    }
    // Method to handle changes in subCategories
    onSubCategoriesChange() {
        this.updateFormControlState();
    }


    filterProducts() {
        let filteredProducts = this.products;

        // Filter by categories
        const selectedCategories = this.categoryForm.value;
        if (selectedCategories && selectedCategories.length > 0) {
            const selectedCategoryIds = selectedCategories.map(category => category.id);
            filteredProducts = filteredProducts.filter(product =>
                selectedCategoryIds.includes(product.subCategory.category.id)
            );
        }

        // Filter by subcategories
        const selectedSubCategories = this.subCategoryForm.value;
        if (selectedSubCategories && selectedSubCategories.length > 0) {
            const selectedSubCategoryIds = selectedSubCategories.map(subCategory => subCategory.id);
            filteredProducts = filteredProducts.filter(product =>
                selectedSubCategoryIds.includes(product.subCategory.id)
            );
        }

        // Filter by brands
        const selectedBrandIds = this.brandForm.value;
        if (selectedBrandIds && selectedBrandIds.length > 0) {
            filteredProducts = filteredProducts.filter(product =>
                selectedBrandIds.includes(product.brand.id)
            );
        }

        this.dataSource.data = filteredProducts;
    }

    filterChange() {
        if (this.dataSource) {
            this.dataSource.filter = this.filterValue;
        }
    }

    listenForDataChnages(inventory?: any) {
        this.isLoading = true;
        if(inventory) {
            this.selectedInventory = inventory;
        }
        if (this.depot){
            this.depot.products.map((p:any) => p.product);
        }else {
        this.productService.getAll().subscribe((r: any) =>{ this.dataSource.data = r;  this.products =r; this.refresh = false;
            this.isLoading = false;
        });
        }
        }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.filterValue) {
            this.filterChange();
        }
        if (changes.refresh) {
            this.listenForDataChnages();
        }
        if (changes.selectedInventory || changes.checkProduct || changes.selectedProductBarCode || changes.depot) {
            if (this.selectedInventory) {
                if (this.checkProduct && !this.selectedProductBarCode){
                    this.requestedProducts = [];
                    this.dataSource.data = this.selectedInventory.products.map((p:any) => p.product);
                }else if (this.selectedProductBarCode) {
                    this.requestedProducts = [];
                    this.dataSource.data = this.products.filter(p => p.barCode == this.selectedProductBarCode);
                }else if (!this.checkProduct && this.depot){
                    this.requestedProducts = [];
                    this.dataSource.data = this.depot.products.map((p:any) => p.product);
                }else if (!this.checkProduct) {
                    this.requestedProducts = [];
                    this.listenForDataChnages();
                }
                if (!this.displayedColumns.includes('QUANTITY')) {
                    this.displayedColumns.splice(this.displayedColumns.length - 1, 0, 'QUANTITY');
                    this.displayedColumns.splice(this.displayedColumns.length - 2, 0, 'AVAILIBILITY');

                }
            } else {
                this.displayedColumns = this.displayedColumns.filter(column => column !== 'QUANTITY' && column !== 'AVAILIBILITY');
            }
            this.products = this.dataSource.data;
        }

    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    openConfirmActionDialog(confirmActionDialogData: ConfirmActionDialogData) {
        return this._matDialog.open(ConfirmActionDialogComponent, {
            panelClass: 'confirm-action-dialog',
            data: confirmActionDialogData
        })
    }

    delete(product: Product) {
        const confirmActionDialogData: ConfirmActionDialogData = {
            message: `You really want to delete ${product.name}?`,
        };
        this.openConfirmActionDialog(confirmActionDialogData).afterClosed().subscribe(res => {
            if (res) {
                this.productService.delete(product.id).subscribe(() => {
                    // Remove the deleted product from the dataSource
                    const index = this.dataSource.data.findIndex(p => p.id === product.id);
                    if (index !== -1) {
                        this.dataSource.data.splice(index, 1);
                        // Trigger the data source update
                        this.dataSource.data = [...this.dataSource.data];
                    }
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product deleted successfully' });
                }, error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
                });
            }
        });
    }





    editProduct(product: Product) {
        this._matDialog.open(AddEditProductComponent, { data: product }).afterClosed().subscribe(updatedProduct => {
            if (updatedProduct) {
              this.productService.triggerRefresh();
            }
        });
    }

    scanCode(product: Product){
            this._matDialog.open(CodeBarScannerComponent, {}).afterClosed().subscribe(e => {
                if (e){
                    if(e === product.barCode){
                        Swal.fire({
                            toast: true,
                            title: "Product verified",
                            position: 'center',
                            customClass: {
                                popup: 'colored-toast',
                            },
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500,
                            timerProgressBar: true,
                        });
                        setTimeout(()=>{this.addQuantity(product);}, 1500)
                    }else {
                        Swal.fire({
                            toast: true,
                            title: "Product not verified",
                            position: 'center',
                            customClass: {
                                popup: 'colored-toast',
                            },
                            icon: "error",
                            showConfirmButton: false,
                            timer: 1500,
                            timerProgressBar: true,
                        });
                    }
                }
            });

    }

    addQuantity(product: Product) {
        this._matDialog.open(AddQuantityComponent, {
            data: {
                inventory: this.selectedInventory,
                product: product,
                depot: this.depot ?this.depot: null,
                quantity: this.depot ? this.checkHowMuchQuantityForProduct(product, this.depot): "",
                existQuantity: this.checkHowMuchQuantityForProduct(product, this.selectedInventory)
            }
        }).afterClosed().subscribe(e => {
            if (e && this.depot ){
                if (!this.isProductRequested(product)){
                let requestedProduct = new RequestedProductQuantity();
                requestedProduct.quantity= e;
                requestedProduct.product= product;
                this.requestedProducts.push(requestedProduct);
                }else {
                    this.updateQuantityById(product.id, e);
                }
            } else if(e){
            this.listenForDataChnages(e);
            }
        });
    }


    updateQuantityById(productId: number, newQuantity: number): void {
        const requestedProduct = this.requestedProducts.find(req => req.product.id === productId);
        if (requestedProduct) {
            requestedProduct.quantity = newQuantity;
        } else {
            console.error('Product not found in the requested products list.');
        }
    }

    removeRequestedProduct(product: Product): void {
        this.requestedProducts = this.requestedProducts.filter(req => req.product.id !== product.id);
    }
    isProductRequested(product: Product): boolean {
        return this.requestedProducts.some(req => req.product.id === product.id);
    }

    checkHowMuchQuantityForProduct(row :Product, inventory:Inventory): string {
        let prod: any = inventory.products.find((p: any) => p.product.id === row.id);
        return prod?.quantity != null ? prod.quantity : 0;
    }

    checkHowAvailibility(row :Product): string {
        let prod: any = this.selectedInventory.products.find((p: any) => p.product.id === row.id);
        return prod?.availability ?? "OUT_OF_STOCK";
    }

    protected readonly add = add;

    openRequestList() {
        this._matDialog.open(ListOfRequestsComponent, {
            data: {
                requests: this.requestedProducts,
                inventory: this.depot,
                theRequesterInventory: this.selectedInventory
            }
        }).afterClosed().subscribe(e => {
            this.requestedProducts = [];
            });
    }

    previewProduct(row) {
        this._matDialog.open(ViewProductComponent, {
            data: {
                product: row,
            }
        }).afterClosed().subscribe(e => {

        });
    }
}

