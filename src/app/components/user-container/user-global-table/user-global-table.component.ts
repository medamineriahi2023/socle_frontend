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
import {User} from "../../../models/User";
import {MatPaginator} from "@angular/material/paginator";
import {Role} from "../../../models/Role";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../../../core/services/user/user.service";
import {MessageService} from "primeng/api";
import {AddUserComponent} from "../../modals/add-user/add-user.component";
import {ResetPasswordComponent} from "../../modals/reset-password/reset-password.component";
import {AddEditUserRolesComponent} from "../../modals/add-edit-user-roles/add-edit-user-roles.component";
import {ConfirmActionDialogData} from "../../modals/models";
import {
    ConfirmActionDialogComponent
} from "../../../shared/dialog/confirm-action-dialog/confirm-action-dialog.component";

@Component({
  selector: 'app-user-global-table',
  templateUrl: './user-global-table.component.html',
  styleUrls: ['./user-global-table.component.scss']
})
export class UserGlobalTableComponent implements OnChanges,OnInit, AfterViewInit{
    displayedColumns: string[] = ['IMAGE','FIRST NAME','LAST NAME', 'USER NAME', 'EMAIL', "STATUS" ,'ROLES', 'ORGANIZATIONS', 'ACTIONS'];
    dataSource: MatTableDataSource<User>;
    @Input() refresh :boolean;
    @Input() filterValue = '';
    @Input() filterPredicate: (data: User, filter: string) => boolean;
    @Input() isUserAdmin: boolean = false;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    users: User[] = [];
    roles: Role[];
    private topic: string;

    constructor(private _cdRef: ChangeDetectorRef,
                private _matDialog: MatDialog,
                private userService:UserService,
                private messageService:MessageService
    ) {
        this.dataSource = new MatTableDataSource();

    }

    ngOnInit(): void {
        this.dataSource.filterPredicate = this.filterPredicate;
        this.filterChange();
        this.listenForDataChnages();
        this.userService.refresh$.subscribe(refresh=>{
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

        this.userService.getAll().subscribe(u => {this.dataSource.data = u["users"];this.refresh = false;});
        this.userService.getRoles().subscribe(u => {this.roles = u["roles"]}  )

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
        });
    }

    delete(user: any) {
        const confirmActionDialogData: ConfirmActionDialogData = {
            message: "You really want to delete "+ user.user.userName +" ?",
            errorMessage: "be carefull this user is active !"
        };
        this.openConfirmActionDialog(confirmActionDialogData).afterClosed().subscribe((res: any[]) => {
            if (res) {
                this.userService.delete(user.user.id).subscribe(s => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User is deleted successfully' });
                    this.userService.triggerRefresh();
                }, error => {this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User is not deleted' });
                });
            }
        });
    }
    //
    // edit_user(user: User) {
    //     this._matDialog.open(AddUserComponent, {
    //         data: {
    //             fix: user,
    //         }
    //     });
    // }
    //
    // edit_user_groups(user: User) {
    //     this._matDialog.open(EditUserGroupsComponent, {
    //             data: {
    //                 fix: user,
    //                 groups: this.groups,
    //                 groupList : this.groupList
    //             }
    //         }
    //     );
    // }
    //
    edit_user_roles(user: any) {
        const dialogRef = this._matDialog.open(AddEditUserRolesComponent, {
                data: {
                    fix: user,
                    roles: this.roles,
                    isGlobal: true
                }
            }
        );
        dialogRef.afterClosed().subscribe(res => {
            if (res){
                this.userService.triggerRefresh();
            }
        });
    }
    resetPassword(user: any){
        this._matDialog.open(ResetPasswordComponent, {
                data: user.user.id
            }
        );
    }
    edit_user(row) {

        this._matDialog.open(AddUserComponent, {
            data: {
                user: row.user,
                roles: row.roles,
                isGlobal : true
            }
        }).afterClosed().subscribe(res =>{
            if (res)
                this.userService.triggerRefresh();
        })

    }


}

