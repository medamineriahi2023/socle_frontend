import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges, ViewChild
} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {RequestedProductQuantity} from "../../../models/RequestedProductQuantity";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CommandService} from "../../../core/services/command/command.service";
import {InvoiceService} from "../../../core/services/Invoice/Invoice.service";
import {MessageService} from "primeng/api";
import Swal from "sweetalert2";
import {ConfirmActionDialogData} from "../models";
import {
    ConfirmActionDialogComponent
} from "../../../shared/dialog/confirm-action-dialog/confirm-action-dialog.component";
import {FormControl, Validators} from "@angular/forms";
import {InvoiceData} from "../../../models/InvoiceData";
import {ClientDataComponent} from "../client-data/client-data.component";
import {InventoryService} from "../../../core/services/inventory/inventory.service";
import {KeycloakService} from "keycloak-angular";
import {data} from "autoprefixer";
import {MatPaginator} from "@angular/material/paginator";

@Component({
    selector: 'app-sell-mode',
    templateUrl: './sell-mode.component.html',
    styleUrls: ['./sell-mode.component.scss']
})
export class SellModeComponent implements OnInit, OnChanges, AfterViewInit {
    dataSource: MatTableDataSource<RequestedProductQuantity>;
    detectedBarCodeValue: string;
    displayedColumns: string[] = ['IMAGE', 'REQUESTED PRODUCT', 'QUANTITY','QUANTITY EXIST', 'UNIT PRICE', 'TOTAL PRICE', 'ACTIONS'];
    selectedProducts: RequestedProductQuantity[] = [];
    totalPrice: number = 0;
    @Input() filterValue = '';
    @Input() filterPredicate: (data: RequestedProductQuantity, filter: string) => boolean;
    tva: FormControl<any> = new FormControl(-1, [Validators.required, Validators.min(0)]);
    connectedUser: string;
    @ViewChild(MatPaginator) paginator: MatPaginator;


    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _cdRef: ChangeDetectorRef,
        private _matDialog: MatDialog,
        public dialogRef: MatDialogRef<SellModeComponent>,
        private commandService: CommandService,
        private invoiceService: InvoiceService,
        private inventoryService:InventoryService,
        private keycloak: KeycloakService
    ) {
        this.connectedUser= keycloak.getUsername();
        this.dataSource = new MatTableDataSource();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }
    isQuantityInvalid = false;

    updateQuantity(requestedProductQuantity: RequestedProductQuantity, quantity: any) {
        if(requestedProductQuantity.existQuantity > requestedProductQuantity.quantity){
        this.selectedProducts.find(r => r == requestedProductQuantity).quantity = quantity.target.value;
        this.totalPrice = this.selectedProducts
            .map(e => e.product.price * quantity.target.value)
            .reduce((a, b) => a + b, 0);
        // let tva = this.totalPrice * (this.tva.value / 100);
        // this.totalPrice += tva;
        this.loadDataChanges();
            this.checkValidity();
            this._cdRef.detectChanges();
        }
    }

    loadDataChanges(): void {
        this.dataSource.data = this.selectedProducts;
    }


    ngOnChanges(changes: SimpleChanges): void {
        if (changes.filterValue) {
            this.filterChange();
        }
    }

    checkValidity(){
        this.isQuantityInvalid = this.selectedProducts.some(e=> e.existQuantity < e.quantity || e.existQuantity === 0);

    }


    ngOnInit(): void {
        this.dataSource.filterPredicate = this.filterPredicate;
        this.filterChange();
    }

    filterChange() {
        if (this.dataSource) {
            this.dataSource.filter = this.filterValue;
        }
    }

    getDetectedValue($event: any) {
        this.detectedBarCodeValue = $event;
        let product = this.data.inventory.products.find(e => e.product.barCode === $event);
        if (product != null) {
            Swal.fire({
                toast: true,
                title: "Product verified",
                position: 'center',
                customClass: {
                    popup: 'colored-toast',
                },
                icon: "success",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
            });
            let d = this.selectedProducts.findIndex(e => e.product.id == product.product.id);
            if (d == -1) {
                let selectedProduct = new RequestedProductQuantity();
                if (product.quantity > 0){
                selectedProduct.quantity = 1;
                    this.totalPrice += product.product.price;
                }else {
                    selectedProduct.quantity = 0;
                }
                selectedProduct.existQuantity = product.quantity;
                selectedProduct.product = product.product;
                this.selectedProducts.push(selectedProduct);

                // let tva = this.totalPrice * (this.tva.value / 100);
                // this.totalPrice += tva;
            } else {
                if (product.quantity > 0) {
                    this.selectedProducts[d].quantity++;
                    this.totalPrice += this.selectedProducts[d].product.price;
                }
                // let tva = this.totalPrice * (this.tva.value / 100);
                // this.totalPrice += tva;
            }
            this.dataSource.data = this.selectedProducts;
            this.checkValidity();
        } else {
            Swal.fire({
                toast: true,
                title: "Product not available in stock",
                position: 'center',
                customClass: {
                    popup: 'colored-toast',
                },
                icon: "error",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
            });
        }
    }

    openConfirmActionDialog(confirmActionDialogData: ConfirmActionDialogData) {
        return this._matDialog.open(ConfirmActionDialogComponent, {
            panelClass: 'confirm-action-dialog',
            data: confirmActionDialogData
        });
    }

    delete(requestedProductQuantity: RequestedProductQuantity) {
        const confirmActionDialogData: ConfirmActionDialogData = {
            message: "You really want to delete " + requestedProductQuantity.product.name + " ?",
        };
        this.openConfirmActionDialog(confirmActionDialogData).afterClosed().subscribe((res: any[]) => {
            if (res) {
                this.selectedProducts = this.selectedProducts.filter(r => r !== requestedProductQuantity)
                this.totalPrice = this.selectedProducts.map(e => e.product.price * e.quantity).reduce((a, b) => a + b, 0);
                this.loadDataChanges();
                this.checkValidity();
            }
        });

    }

    payment() {

        this._matDialog.open(ClientDataComponent, {
            data : {
                totalPrice : (this.totalPrice * (this.tva.value / 100)) + this.totalPrice,
                priceHTT : this.totalPrice,
                inventory : this.data.inventory
            }
        }).afterClosed().subscribe(c => {
            if (c){
        let tva = this.tva.value ? this.tva.value : 0;
            let invoiceData = new InvoiceData(
                this.makeid(5),
                new Date(),
                c.fullName,
                c.address,
                c.phone,
                this.selectedProducts,
                0,
                tva,
                this.data.inventory.currency,
                this.data.inventory.imageUrl
            );
                invoiceData.inventory = this.data.inventory;
                invoiceData.method = c.method;
                this.invoiceService.generateInvoice(invoiceData).subscribe(e => {
                    invoiceData.invoiceUrl= e.url;
                    this.inventoryService.sellProductsToClients(invoiceData, this.data.inventory.id).subscribe(z => {
                        this.downloadPDF(e.url);
                });
            });
            }
        });


    }
    downloadPDF(url: string) {
        const link = document.createElement('a');
        link.href = url;
        link.download = 'invoice.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }
}
