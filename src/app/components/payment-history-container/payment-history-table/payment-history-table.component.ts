import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Role} from "../../../models/Role";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {RoleService} from "../../../core/services/role/role.service";
import {OrganizationService} from "../../../core/services/organization/organization.service";
import {MessageService} from "primeng/api";
import {ConfirmActionDialogData} from "../../modals/models";
import {
    ConfirmActionDialogComponent
} from "../../../shared/dialog/confirm-action-dialog/confirm-action-dialog.component";
import {PaymentHistory} from "../../../models/PaymentHistory";
import {PaymentHistoryService} from "../../../core/services/PaymentHistory/payment-history.service";

@Component({
  selector: 'app-payment-history-table',
  templateUrl: './payment-history-table.component.html',
  styleUrls: ['./payment-history-table.component.scss']
})
export class PaymentHistoryTableComponent implements OnChanges, OnInit, AfterViewInit{
    displayedColumns: string[] = ['DATE OF PAYMENT', 'INVENTORY NAME','NAME OF CLIENT', 'ADDRESS','PHONE NUMBER', 'REQUESTED PRODUCTS','PAYMENT METHOD', 'ACTIONS'];
    dataSource: MatTableDataSource<PaymentHistory>;
    @Input() refresh : boolean;
    isLoading: boolean= false;
    @Input() filterValue = '';
    @Input() filterPredicate: (data: Role, filter: string) => boolean;
    isDateInvalid: boolean = false;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Input() isUserAdmin: boolean = false;
    startDate: Date;
    endDate: Date;
    selectedPaymentMethod: string = '';

    constructor(private _cdRef: ChangeDetectorRef,
                private _matDialog: MatDialog,
                private roleService:RoleService,
                private paymentHistoryService:PaymentHistoryService,
                private messageService:MessageService
    ) {

        this.dataSource = new MatTableDataSource();

    }

    validateDateRange(): void {
        this.isDateInvalid = this.startDate && this.endDate && this.startDate > this.endDate;
    }
    applyFilter(): void {
        const filterValues = {
            startDate: this.startDate,
            endDate: this.endDate,
            paymentMethod: this.selectedPaymentMethod
        };

        this.dataSource.filterPredicate = (data: PaymentHistory, filter: string) => {
            const filterObj = JSON.parse(filter);
            const dateWithinRange = (!filterObj.startDate || new Date(data.creationDate) >= new Date(filterObj.startDate)) &&
                (!filterObj.endDate || new Date(data.creationDate) <= new Date(filterObj.endDate));
            const paymentMethodMatch = !filterObj.paymentMethod || data.paymentMethod === filterObj.paymentMethod;
            return dateWithinRange && paymentMethodMatch;
        };

        this.dataSource.filter = JSON.stringify(filterValues);
    }

    ngOnInit(): void {
        this.filterChange();
        this.listenForDataChnages();

        this.roleService.roleRefresh$.subscribe(refresh=> {
            if (refresh){
                this.listenForDataChnages();
            }
        })
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
    filterChange() {
        if (this.dataSource) {
            this.dataSource.filter = this.filterValue;
        }
    }

    listenForDataChnages() {
        this.isLoading = true;
        this.paymentHistoryService.getAll().subscribe((r: any) =>{ this.dataSource.data = r;  this.isLoading = false;});
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

    protected readonly PaymentHistory = PaymentHistory;

    downloadInvoice(row) {
        this.downloadPDF(row.invoiceUrl)
    }

    clearFilter(): void {
        this.startDate = null;
        this.endDate = null;
        this.selectedPaymentMethod = '';
        this.isDateInvalid = false;
        this.dataSource.filter = "";
    }

}
