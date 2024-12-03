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
import {UserService} from "../../../core/services/user/user.service";
import {ConfirmActionDialogData} from "../../modals/models";
import {
    ConfirmActionDialogComponent
} from "../../../shared/dialog/confirm-action-dialog/confirm-action-dialog.component";
import {EditPermissionComponent} from "../../modals/edit-permission/edit-permission.component";
import {AddEditRoleComponent} from "../../modals/add-edit-role/add-edit-role.component";
import {MessageService} from "primeng/api";
import {RoleService} from "../../../core/services/role/role.service";

@Component({
  selector: 'app-global-role-table',
  templateUrl: './global-role-table.component.html',
  styleUrls: ['./global-role-table.component.scss']
})
export class GlobalRoleTableComponent implements OnChanges, OnInit, AfterViewInit{
    displayedColumns: string[] = ['NAME','NUMBER OF PERMISSIONS', 'ACTIONS'];
    dataSource: MatTableDataSource<Role>;
    permissions: Role[]= [];
    @Input() refresh : boolean;

    @Input() filterValue = '';
    @Input() filterPredicate: (data: Role, filter: string) => boolean;

    @ViewChild(MatPaginator) paginator: MatPaginator;


    constructor(private _cdRef: ChangeDetectorRef,
                private _matDialog: MatDialog,
                private userService:UserService,
                private messageService:MessageService,
                private roleService:RoleService
    ) {

        this.dataSource = new MatTableDataSource();

    }

    ngOnInit(): void {
        this.filterChange();
        this.listenForDataChnages();

        this.roleService.globalRoleRefresh$.subscribe(refresh=> {
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
        this.userService.getRoles().subscribe((r: any) =>{ this.dataSource.data = r.roles;  this.refresh = false;});
        this.userService.getAllPermissions().subscribe(r => this.permissions = r);
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
                this.userService.deleteRole(role.id).subscribe((e: any) => {
                    this.roleService.globalRoleTriggerRefresh(); e.error_security == null ?
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role deleted successfully' }) :
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: e?.error_security?.http_body })
                });
            }
        });
    }
    editRole(role: Role) {
        this._matDialog.open(AddEditRoleComponent, {
            data:role
        }).afterClosed().subscribe(e => {
            if (e){
                this.roleService.globalRoleTriggerRefresh();
            }
        });
    }
    editPermissions(role : Role) {
        this._matDialog.open(EditPermissionComponent, {
            data : {
                role:role,
                permissions : this.permissions
            }}).afterClosed().subscribe(res => {
            if (res){
                this.roleService.globalRoleTriggerRefresh();

            }
        });
    }
}

