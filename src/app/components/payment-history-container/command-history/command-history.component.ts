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
import {PaymentHistoryService} from "../../../core/services/PaymentHistory/payment-history.service";
import {MessageService} from "primeng/api";
import {Command} from "../../../models/Command";
import {CommandService} from "../../../core/services/command/command.service";
import {Status} from "../../../models/Status";

@Component({
  selector: 'app-command-history',
  templateUrl: './command-history.component.html',
  styleUrls: ['./command-history.component.scss']
})
export class CommandHistoryComponent implements OnChanges, OnInit, AfterViewInit{
    displayedColumns: string[] = ['DATE OF PAYMENT', 'THE REQUESTER INVENTORY','THE PROVIDER INVENTORY', 'REQUESTED PRODUCTS', 'RESPONSIBLE FOR OPERATION', 'STATUS', 'ACTIONS'];
    dataSource: MatTableDataSource<Command>;
    @Input() refresh : boolean;
    isLoading: boolean= false;
    @Input() filterValue = '';
    @Input() filterPredicate: (data: Role, filter: string) => boolean;
    startDate: Date;
    endDate: Date;
    status: string = '';
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Input() isUserAdmin: boolean = false;
    isDateInvalid: boolean;


    constructor(private _cdRef: ChangeDetectorRef,
                private _matDialog: MatDialog,
                private roleService:RoleService,
                private commandService:CommandService,
                private messageService:MessageService
    ) {

        this.dataSource = new MatTableDataSource();

    }
    clearFilter(): void {
        this.startDate = null;
        this.endDate = null;
        this.status = '';
        this.isDateInvalid = false;
        this.dataSource.filter = "";
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

    validateDateRange(): void {
        this.isDateInvalid = this.startDate && this.endDate && this.startDate > this.endDate;
    }
    applyFilter(): void {
        const filterValues = {
            startDate: this.startDate,
            endDate: this.endDate,
            paymentMethod: this.status
        };

        this.dataSource.filterPredicate = (data: Command, filter: string) => {
            const filterObj = JSON.parse(filter);
            const dateWithinRange = (!filterObj.startDate || new Date(data.creationDate) >= new Date(filterObj.startDate)) &&
                (!filterObj.endDate || new Date(data.creationDate) <= new Date(filterObj.endDate));
            const paymentMethodMatch = !filterObj.paymentMethod || data.status === filterObj.paymentMethod;
            return dateWithinRange && paymentMethodMatch;
        };

        this.dataSource.filter = JSON.stringify(filterValues);
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
        this.commandService.getCommandHistory().subscribe((r: any) =>{ this.dataSource.data = r;  this.isLoading = false;});
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


    downloadInvoice(row) {
        this.downloadPDF(row.invoicePdfUrl)
    }

    protected readonly Status = Status;
}
