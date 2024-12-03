import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MessageService} from "primeng/api";
import {ConfirmActionDialogData} from "../models";
import {
    ConfirmActionDialogComponent
} from "../../../shared/dialog/confirm-action-dialog/confirm-action-dialog.component";
import {RequestedProductQuantity} from "../../../models/RequestedProductQuantity";
import {Product} from "../../../models/Product";
import {Inventory} from "../../../models/Inventory";
import {Command} from "../../../models/Command";
import {Status} from "../../../models/Status";
import {CommandService} from "../../../core/services/command/command.service";
import {CodeBarScannerComponent} from "../code-bar-scanner/code-bar-scanner.component";
import Swal from "sweetalert2";
import {AddQuantityComponent} from "../add-quantity/add-quantity.component";
import {InvoiceData} from "../../../models/InvoiceData";
import {InvoiceService} from "../../../core/services/Invoice/Invoice.service";
import {FormControl, Validators} from "@angular/forms";
import {SelectDileveryComponent} from "../select-dilevery/select-dilevery.component";
import {UserService} from "../../../core/services/user/user.service";
import {TrackingService} from "../../../core/services/tracking/tracking.service";

@Component({
  selector: 'app-list-of-requests',
  templateUrl: './list-of-requests.component.html',
  styleUrls: ['./list-of-requests.component.scss']
})
export class ListOfRequestsComponent implements OnInit,OnChanges, AfterViewInit{
    displayedColumns: string[] = ['VERIFIED','IMAGE','REQUESTED PRODUCT', 'QUANTITY', 'ACTIONS'];
    dataSource: MatTableDataSource<RequestedProductQuantity>;
    isAllVerified: boolean = false;
    requestAccepted: boolean = false;
    @Input() filterValue = '';
    @Input() filterPredicate: (data: RequestedProductQuantity, filter: string) => boolean;
    @Input() refresh : boolean;
    tva: FormControl<any> = new FormControl(-1, [Validators.required, Validators.min(0)]);

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Input() isUserAdmin: boolean =false;
    users: any[];
    constructor(
                @Inject(MAT_DIALOG_DATA) public data: any,
                private _cdRef: ChangeDetectorRef,
                private _matDialog: MatDialog,
                public dialogRef: MatDialogRef<ListOfRequestsComponent>,
                private commandService:CommandService,
                private invoiceService:InvoiceService,
                private messageService: MessageService,
                private userService: UserService,
                private trackingService: TrackingService,
    ) {
        if(!data.readOnly){
            this.displayedColumns = this.displayedColumns.filter(column => column !== 'VERIFIED');
        }
        if(data.disabled){
            this.displayedColumns = this.displayedColumns.filter(column => column !== 'VERIFIED' && column !== 'ACTIONS');
        }

        this.dataSource = new MatTableDataSource();




    }

    ngOnInit(): void {
        this.dataSource.filterPredicate = this.filterPredicate;
        this.filterChange();
        this.loadDataChanges();
        this.userService.getDeliveryMens().subscribe((u : any) => this.users = u.users)
    }

    filterChange() {
        if (this.dataSource) {
            this.dataSource.filter = this.filterValue;
        }
    }

    loadDataChanges(){
        this.dataSource.data = this?.data?.requests as RequestedProductQuantity[];
    }

    updateQuantity(requestedProductQuantity: RequestedProductQuantity, quantity: any){
        this.dataSource.data.find(r => r == requestedProductQuantity).quantity = quantity.target.value;
        this._cdRef.detectChanges();
    }



    ngOnChanges(changes: SimpleChanges): void {
        if (changes.filterValue) {
            this.filterChange();
        }
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this._cdRef.detectChanges();
    }

    openConfirmActionDialog(confirmActionDialogData: ConfirmActionDialogData) {
        return this._matDialog.open(ConfirmActionDialogComponent, {
            panelClass: 'confirm-action-dialog',
            data: confirmActionDialogData
        });
    }

    delete(requestedProductQuantity: RequestedProductQuantity) {
        const confirmActionDialogData: ConfirmActionDialogData = {
            message: "You really want to delete "+ requestedProductQuantity.product.name +" ?",        };
        this.openConfirmActionDialog(confirmActionDialogData).afterClosed().subscribe((res: any[]) => {
            if (res){
                this.dataSource.data = this.dataSource.data.filter(r => r !== requestedProductQuantity)
            }
        });
    }

    checkHowMuchQuantityForProduct(row :Product, inventory:Inventory): string {
        let prod: any = inventory.products.find((p: any) => p.product.id === row.id);
        return prod?.quantity != null ? prod.quantity : 0;
    }


    sendRequest() {
        let command = new Command();
        command.productsRequested = this.dataSource.data;
        command.inventory = this.data.inventory;
        command.theRequesterInventory = this.data.theRequesterInventory
        command.status = Status.IN_PROCESSING;

        this.commandService.save(command).subscribe(res => {
            this.messageService.add({severity: 'success', summary: 'Success', detail: 'request sent successfully'});
            this._matDialog.closeAll();
        }, error => {
            this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message});
        });
    }
    close() {
        this.dialogRef.close();
    }

    acceptRequest() {
        this.requestAccepted = false;

        this._matDialog.open(SelectDileveryComponent, {
            data : {
                commandId : this.data.commandId,
                kcUsers: this.users,
            }
        }).afterClosed().subscribe(e => {
                if (e === true){
                    this.commandService.acceptCommand(this.data.commandId, this.tva.value).subscribe(response => {
                        if (response){
                            this.requestAccepted= true;
                            this.messageService.add({severity: 'success', summary: 'Success', detail: 'request accepted successfully'});
                            setTimeout(() => this.dialogRef.close(response), 6000)
                            this._cdRef.detectChanges();
                        }
                    }, error => {
                        this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message});
                    });
                }
        });





    }


    refuseRequest() {
        this.commandService.refuseCommand(this.data.commandId).subscribe(response => {
            if (response){
               this.dialogRef.close(response)
            }
        }, error => {
            this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message});
        });
    }

     scanProduct(row: RequestedProductQuantity, once?: boolean) {
            this._matDialog.open(CodeBarScannerComponent, {}).afterClosed().subscribe(e => {
                if (e){
                    if(e === row.product.barCode){
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
                        if (!once ){
                            if (row.quantity > 0){
                        row.quantity-=1;
                            }
                        }else {
                            setTimeout(()=>{this.addQuantity(row);}, 1500);
                        }
                        if (row.quantity === 0 ){
                            row.verified = true;
                        }
                        this.isAllVerified = this.dataSource.data.every(e => e.verified === true);
                        this._cdRef.detectChanges();
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

    private addQuantity(row: any) {
        this._matDialog.open(AddQuantityComponent, {
            data: {
                product: row.product,
                quantity: row.quantity,
                verifyRequests: true
            }
        }).afterClosed().subscribe(e => {
            if(e){
                row.quantity-= e;
                if (row.quantity ===0 ){
                    row.verified = true;
                }
                this.isAllVerified = this.dataSource.data.every(e => e.verified === true);
                this._cdRef.detectChanges();
            }
        })
    }

    receiveTheCommand() {
        this.commandService.confirmCommand(this.data.commandId).subscribe(e => {
            if (e){
                this.trackingService.deleteByCommandId(this.data.commandId).subscribe(response => {
                    console.log("the delivery guy has deleted");
                })
                this.dialogRef.close(e)
            }
        }, error => {
            this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.message});
        });
    }

    generateInvoice() {
        let tva = this.data?.command?.tva ? this.data.command.tva : 0;
        if (!this.data?.command?.invoicePdfUrl){
        let invoiceData = new InvoiceData(
            this.makeid(5),
            this.data.command.updateDate,
            this.data.command.theRequesterInventory.name,
            this.data.command.theRequesterInventory.address,
            this.data.command.theRequesterInventory.phone,
            this.data.requests,
            0,
            tva,
            this.data?.command?.inventory.currency,
            this.data?.command?.inventory.imageUrl,

        );

        invoiceData.inventoryRequester =  this.data.command.theRequesterInventory;
        invoiceData.inventoryProvider = this.data.command.inventory;
        this.invoiceService.generateInvoice(invoiceData).subscribe(e => {
            this.downloadPDF(e.url);
            if (e){
            this.commandService.addInvoicePdfToCommand(this.data.commandId, e.url).subscribe(r => this.data.command = r);
            }
        });
        }else  {
            this.downloadPDF(this.data.command.invoicePdfUrl);
        }

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
    protected readonly Status = Status;
    selectedTva: any = "0";
}
