import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Product} from "../../../models/Product";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {MessageService} from "primeng/api";
import {ConfirmActionDialogData} from "../../modals/models";
import {
    ConfirmActionDialogComponent
} from "../../../shared/dialog/confirm-action-dialog/confirm-action-dialog.component";
import {Inventory} from "../../../models/Inventory";
import {InventoryService} from "../../../core/services/inventory/inventory.service";
import {AddEditInventoryComponent} from "../../modals/add-edit-inventory/add-edit-inventory.component";
import {CodeBarScannerComponent} from "../../modals/code-bar-scanner/code-bar-scanner.component";
import {ChooseInventoryComponent} from "../../modals/choose-invenetory/choose-inventory.component";
import {TypeOfInventory} from "../../../models/TypeOfInventory";
import {KeycloakService} from "keycloak-angular";
import {UserService} from "../../../core/services/user/user.service";
import {catchError, map, Observable, of} from "rxjs";
import {ListOfRequestsComponent} from "../../modals/list-of-requests/list-of-requests.component";
import {Command} from "../../../models/Command";
import {SellModeComponent} from "../../modals/sell-mode/sell-mode.component";

@Component({
  selector: 'app-inventory-table',
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.scss']
})
export class InventoryTableComponent implements OnInit,OnChanges, OnDestroy{
    displayedColumns: string[] = ['NAME', 'TYPE', 'ADDRESS', 'RESPONSIBLE', 'CURRENCY', 'NUMBER OF PRODUCTS' ,'ACTIONS'];
    dataSource: MatTableDataSource<Inventory>;
    @Input() refresh : boolean = false;
    @Input() datasource!: any;
    @Input() selectedDepot!: any;
    @Input() filterValue = '';
    @Input() filterPredicate: (data: Product, filter: string) => boolean;
    checkedInventory : boolean = false;
    Inventories: Inventory[];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Input() isUserAdmin: boolean = false;
    @Output() addProductForInventory = new EventEmitter<Inventory>();
    @Output() depotProduct = new EventEmitter<Inventory>();
    @Output() productBarCode = new EventEmitter<string>();
    @Output() checkProducts = new EventEmitter<boolean>();
    @Output() getSelectedDepot = new EventEmitter<Inventory>();
    isLoading: boolean= false;
    public detectedBarCode: string;
    constructor(
        private _matDialog: MatDialog,
        private inventoryService:InventoryService,
        private userService:UserService,
        private messageService:MessageService
    ) {

        this.dataSource = new MatTableDataSource();

    }

    ngOnDestroy(): void {
        this.checkedInventory = false;
    }

    ngOnInit(): void {
        this.filterChange();
        this.listenForDataChnages();

        this.inventoryService.refresh$.subscribe(refresh=> {
            if(refresh){
                this.listenForDataChnages();
            }
        })
    }

    filterChange() {
        if (this.dataSource) {
            this.dataSource.filter = this.filterValue;
        }
    }

    listenForDataChnages() {
        this.isLoading = true;
        if (this.datasource){
            this.displayedColumns = this.displayedColumns.filter(column => column !== 'ACTIONS');
            this.dataSource.data = this.datasource;
            this.isLoading = false;
        }else {
        this.inventoryService.getAll().subscribe((r: any) =>{this.Inventories = r; this.refresh = false;
        this.dataSource.data = r;
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

    delete(inventory: Inventory) {
        const confirmActionDialogData: ConfirmActionDialogData = {
            message: "You really want to delete "+ inventory.name +" ?",        };
        this.openConfirmActionDialog(confirmActionDialogData).afterClosed().subscribe(res => {
            if (res) {
                this.inventoryService.delete(inventory.id).subscribe(e => {
                    this.listenForDataChnages(); this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Inventory deleted successfully' });},error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
                });
            }
        });
    }
    editInventory(inventory: Inventory) {
        this._matDialog.open(AddEditInventoryComponent, {
            data: inventory
        }).afterClosed().subscribe(e => {
            if (e){
            this.inventoryService.refreshTrigger();
            this.checkedInventory = false;
            this.dataSource.data= this.Inventories;
            }
        });
    }
    addProduct(inventory: Inventory){

        if (inventory.type === TypeOfInventory.POINT_OF_SALE){
            this._matDialog.open(ChooseInventoryComponent, {
                data: this.dataSource.data.filter(d => d.type ===  TypeOfInventory.DEPOT),
            }).afterClosed().subscribe(e => {
                if (e != null) {
                   this.depotProduct.emit(e);
                    this.addProductForInventory.emit(inventory);
                    this.checkProducts.emit(false);
                }
            });
        }else {
            this.addProductForInventory.emit(inventory);
            this.checkProducts.emit(false);
        }


    }
    addProductWithBarCode(inventory: Inventory){
        if (inventory.type === TypeOfInventory.POINT_OF_SALE){
            this._matDialog.open(ChooseInventoryComponent, {
                data: this.dataSource.data.filter(d => d.type ===  TypeOfInventory.DEPOT),
            }).afterClosed().subscribe(e => {
                if (e != null) {


                this._matDialog.open(CodeBarScannerComponent, {
                }).afterClosed().subscribe(u => {
                    if (u != null) {
                        this.productBarCode.emit(u);
                        this.depotProduct.emit(e);
                        this.addProductForInventory.emit(inventory);
                        this.checkProducts.emit(false);
                    }
                });
            }});
        }else{
            this._matDialog.open(CodeBarScannerComponent, {
            }).afterClosed().subscribe(u => {
                if (u != null) {
                    this.productBarCode.emit(u);
                    this.addProductForInventory.emit(inventory);
                    this.checkProducts.emit(false);
                }
            });
        }

    }

    search() {
        this._matDialog.open(CodeBarScannerComponent, {
        }).afterClosed().subscribe(e => {
            if(e){
                this.detectedBarCode = e;
                this.inventoryService.findProductExistenceInventories(e).subscribe(response => {this.dataSource.data = response;
                this.checkedInventory= true;
                });
            }
        });
    }

    checkExistingProducts(inventory: Inventory){
        this.addProductForInventory.emit(inventory);
        this.checkProducts.emit(true);
    }

    protected readonly Inventory = Inventory;

    onRowClicked(row:Inventory) {
        if (this.datasource){
            this.selectedDepot = row;
            this.getSelectedDepot.emit(row);
        }
    }

    cancelSearch() {
        this.checkedInventory= false;
        this.dataSource.data = this.Inventories;
    }

    openSellMode(row) {

        this._matDialog.open(SellModeComponent, {
            data: {
                inventory: row
            }
        }).afterClosed().subscribe(e => {
        });
    }


    openPaymentHistory(row) {

    }
}


