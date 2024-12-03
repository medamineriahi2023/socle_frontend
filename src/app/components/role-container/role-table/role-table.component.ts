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
import {MatTableDataSource} from '@angular/material/table';
import {Role} from 'app/models/Role';
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmActionDialogData} from "../../modals/models";
import {
    ConfirmActionDialogComponent
} from "../../../shared/dialog/confirm-action-dialog/confirm-action-dialog.component";
import {MessageService} from "primeng/api";
import {OrganizationService} from "../../../core/services/organization/organization.service";
import {RoleService} from "../../../core/services/role/role.service";

@Component({
  selector: 'app-role-table',
  templateUrl: './role-table.component.html',
  styleUrls: ['./role-table.component.scss']
})
export class RoleTableComponent implements OnChanges, OnInit, AfterViewInit{
    displayedColumns: string[] = ['NAME', 'ACTIONS'];
    dataSource: MatTableDataSource<Role>;
    permissions: Role[]= [];
    @Input() refresh : boolean;
    isLoading: boolean= false;
    @Input() filterValue = '';
    @Input() filterPredicate: (data: Role, filter: string) => boolean;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Input() isUserAdmin: boolean = false;


    constructor(private _cdRef: ChangeDetectorRef,
                private _matDialog: MatDialog,
                    private roleService:RoleService,
                    private organizationService:OrganizationService,
                private messageService:MessageService
    ) {

        this.dataSource = new MatTableDataSource();

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

    filterChange() {
        if (this.dataSource) {
            this.dataSource.filter = this.filterValue;
        }
    }

    listenForDataChnages() {
        this.isLoading = true;
       this.organizationService.getRoles().subscribe((r: any) =>{ this.dataSource.data = r;  this.isLoading = false;});
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

    delete(role: Role) {
        const confirmActionDialogData: ConfirmActionDialogData = {
            message: "You really want to delete "+ role.name +" ?",        };
        this.openConfirmActionDialog(confirmActionDialogData).afterClosed().subscribe(res => {
            if (res) {
                this.organizationService.deleteRole(role.name).subscribe(e => {
                    if (e){
                    this.roleService.roleTriggerRefresh();
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role deleted successfully' });}},error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
                });
            }
        });
    }
}

