import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Group} from "../../../models/Group";
import {OrganizationService} from "../../../core/services/organization/organization.service";
import {MessageService} from "primeng/api";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {AddEditOrganizationComponent} from "../../modals/add-edit-organization/add-edit-organization.component";
import {ConfirmActionDialogData} from "../../modals/models";
import {
    ConfirmActionDialogComponent
} from "../../../shared/dialog/confirm-action-dialog/confirm-action-dialog.component";
import {EditOrgUsersComponent} from "../../modals/edit-org-users/edit-org-users.component";
import {UserService} from "../../../core/services/user/user.service";

@Component({
  selector: 'organization-table',
  templateUrl: './organization-table.component.html',
  styleUrls: ['./organization-table.component.scss']
})
export class OrganizationTableComponent implements OnInit, AfterViewInit,OnChanges {
    @Input() isUserAdmin: boolean= false;
    dataSource: MatTableDataSource<any>;
    @Input() refresh: boolean;
    @Input() filterValue = '';
    @Input() filterPredicate: (data: Group, filter: string) => boolean;
    displayedColumns: string[] = ['NAME','DISPLAY NAME', 'ROLES' , 'NUMBER OF USERS', 'ACTIONS'];
    public roles: any;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public users: any[];
    @Input() userId!: string;
    isLoading: boolean= false;


    constructor(private organizationService:OrganizationService,
                private messageService:MessageService, private _matDialog: MatDialog,
                private userService:UserService

    ) {

        this.dataSource = new MatTableDataSource();

    }

    ngOnInit(): void {
        this.filterChange();
        this.listenForDataChnages();
        this.userService.getAll().subscribe((u : any) => this.users = u.users)

        this.organizationService.refresh$.subscribe(refresh=> {
            if(refresh){
                this.listenForDataChnages();
            }
        })
    }
    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    filterChange() {
        if (this.dataSource) {
            this.dataSource.filter = this.filterValue;
        }
    }

    listenForDataChnages() {
        this.isLoading = true;
            this.organizationService.getAllOrganisations().subscribe(u =>
            {
                this.dataSource.data = u.organizations
                this.isLoading= false;
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.filterValue) {
            this.filterChange();
        }
    }


    editOrg(row) {
        this._matDialog.open(AddEditOrganizationComponent, {
            data : {
                org : row
            }
        }).afterClosed().subscribe(res =>{
            if (res)
                this.organizationService.triggerRefresh();
        })
    }
    openConfirmActionDialog(confirmActionDialogData: ConfirmActionDialogData) {
        return this._matDialog.open(ConfirmActionDialogComponent, {
            panelClass: 'confirm-action-dialog',
            data: confirmActionDialogData
        });
    }

    delete(row) {
        const confirmActionDialogData: ConfirmActionDialogData = {
            message: "You really want to delete "+ row?.name +" ?"
        };
        this.openConfirmActionDialog(confirmActionDialogData).afterClosed().subscribe((res: any[]) => {
            if (res) {
                this.organizationService.deleteOrg(row.id).subscribe(s => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'org is deleted successfully' });
                    this.organizationService.triggerRefresh();
                }, error => {this.messageService.add({ severity: 'error', summary: 'Error', detail: 'org is not deleted' });
                });
            }
        });
    }

    edit_org_members(row) {
        this._matDialog.open(EditOrgUsersComponent, {
            data : {
                org : row,
                kcUsers: this.users,
                userId: this.userId
            }
        }).afterClosed().subscribe(res =>{
                if(res){
                    this.organizationService.triggerRefresh();
                }
        })
    }
}
