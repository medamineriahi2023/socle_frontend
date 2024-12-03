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
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../../../core/services/user/user.service";
import {ConfirmActionDialogData} from "../../modals/models";
import {
    ConfirmActionDialogComponent
} from "../../../shared/dialog/confirm-action-dialog/confirm-action-dialog.component";
import {User} from "../../../models/User";
import {Role} from "../../../models/Role";
import {AddUserComponent} from "../../modals/add-user/add-user.component";
import {ResetPasswordComponent} from "../../modals/reset-password/reset-password.component";
import {AddEditUserRolesComponent} from "../../modals/add-edit-user-roles/add-edit-user-roles.component";
import {MessageService} from "primeng/api";
import {OrganizationService} from "../../../core/services/organization/organization.service";
import {UserInfoComponent} from "../../modals/user-info/user-info.component";

@Component({
    selector: 'app-user-table',
    templateUrl: './user-table.component.html',
    styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent implements OnInit, AfterViewInit,OnChanges{
    displayedColumns: string[] = ['IMAGE','FIRST NAME','LAST NAME', 'USER NAME', 'EMAIL', 'PHONE' , "REGISTRATION NUMBER", 'STATUS' ,'ROLES', 'ACTIONS'];
    dataSource: MatTableDataSource<User>;
    @Input() refresh :boolean;
    @Input() global :boolean = false;
    @Input() filterValue = '';
    @Input() filterPredicate: (data: User, filter: string) => boolean;
    @Input() isUserAdmin: boolean = false;
    @Input() userId: string;
    public connectedUser: any;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    isLoading: boolean= false;
    users: User[] = [];
    roles: Role[];
    private topic: string;

    constructor(private _cdRef: ChangeDetectorRef,
                private _matDialog: MatDialog,
                private userService:UserService,
                private organizationService:OrganizationService,
                private messageService:MessageService
    ) {

        this.dataSource = new MatTableDataSource();

    }

    ngOnInit(): void {
        this.filterChange();
        this.listenForDataChnages();
        this.userService.refresh$.subscribe(refresh=> {
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
        if (!this.global){
            this.organizationService.getAll().subscribe(u => {
                // const connectedUser = u.filter(e => e.id == this.userId)[0];
                // const filteredUsers = u.filter(e => e.id !== this.userId);
                // filteredUsers.unshift(connectedUser);
                // this.dataSource.data = filteredUsers;
                this.dataSource.data = u;
                this.refresh = false;
                this.isLoading = false;
            });
        this.organizationService.getRoles().subscribe(u => {this.roles = u}  )
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
        });
    }

    delete(user: User) {
        const confirmActionDialogData: ConfirmActionDialogData = {
            message: "You really want to delete "+ user.userName +" ?",
            errorMessage: "be carefull this user is active !"
        };
        this.openConfirmActionDialog(confirmActionDialogData).afterClosed().subscribe((res: any[]) => {
            if (res) {
                this.userService.delete(user.id).subscribe(s => {
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
    edit_user_roles(user: User) {
        const dialogRef = this._matDialog.open(AddEditUserRolesComponent, {
                data: {
                    fix: user,
                    roles: this.roles,
                    isGlobal: false
                }
            }
        );
        dialogRef.afterClosed().subscribe(res => {
            if(res){
                this.userService.triggerRefresh();
            }
        });
    }
    //


    resetPassword(user: User){
        this._matDialog.open(ResetPasswordComponent, {
                data: user.id
            }
        );
    }
    edit_user(row) {
        this._matDialog.open(AddUserComponent, {
            data : {
                user : row,
                isGlobal: false
            }
        }).afterClosed().subscribe(res =>{
            if (res)
                this.userService.triggerRefresh();
        })

    }

    open_user_info(row) {
        this._matDialog.open(UserInfoComponent, {
            data : {
                user : row,
                isGlobal: false
            }
        });

    }


}
