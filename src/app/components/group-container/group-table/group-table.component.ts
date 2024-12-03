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
import {Group} from "../../../models/Group";
import {MatPaginator} from "@angular/material/paginator";
import {User} from "../../../models/User";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmActionDialogData} from "../../modals/models";
import {
    ConfirmActionDialogComponent
} from "../../../shared/dialog/confirm-action-dialog/confirm-action-dialog.component";
import {AddEditGroupComponent} from "../../modals/add-edit-group/add-edit-group.component";
import {AddEditRolesGroupComponent} from "../../modals/add-edit-roles-group/add-edit-roles-group.component";
import {AddEditUsersGroupComponent} from "../../modals/add-edit-users-group/add-edit-users-group.component";
import {Role} from "../../../models/Role";
import {UserService} from "../../../core/services/user/user.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.scss']
})
export class GroupTableComponent implements OnInit,OnChanges,AfterViewInit{
    displayedColumns: string[] = ['NAME', 'NUMBER OF USERS','GRANTED ROLES', 'ACTIONS'];
    dataSource: MatTableDataSource<Group>;
    isLoading: boolean= false;

    @Input() filterValue = '';
    @Input() filterPredicate: (data: Group, filter: string) => boolean;
    @Input() refresh : boolean;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    users: User[];
    groups: Group[];
    roles: Role[];
    @Input() isUserAdmin: boolean =false;

    constructor(private _cdRef: ChangeDetectorRef,
                private _matDialog: MatDialog,
                private userService: UserService,
                private messageService: MessageService
    ) {
        this.dataSource = new MatTableDataSource();
    }

    ngOnInit(): void {
        this.dataSource.filterPredicate = this.filterPredicate;
        this.filterChange();
        this.listenForDataChnages();

        this.userService.groupRefresh$.subscribe(refresh=> {
            if (refresh) {
                this.listenForGroups();
            }
        })
    }

    filterChange() {
        if (this.dataSource) {
            this.dataSource.filter = this.filterValue;
        }
    }


    listenForGroups():void {
        this.isLoading = true;
        this.userService.getAllGroups().subscribe(u=> {this.dataSource.data = u["groups"] ; this.isLoading= false;})
    }
    listenForDataChnages() {
        this.userService.getAll().subscribe(e => this.users = e["users"])
        this.userService.getRoles().subscribe(u=> this.roles = u["roles"])
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.filterValue) {
            this.filterChange();
        }
        if (changes.refresh) {
            this.listenForGroups();
            this.listenForDataChnages()
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

    delete(group: Group) {
        const confirmActionDialogData: ConfirmActionDialogData = {
            message: "You really want to delete "+ group.name +" ?",        };
        this.openConfirmActionDialog(confirmActionDialogData).afterClosed().subscribe((res: any[]) => {
            if (res)
            this.userService.deleteGroup(group.id).subscribe(e => {this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Group is saved successfully' }); this.userService.groupTriggerRefresh();
                }, error => {this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error while saving Group' });});
        });
    }

    openEditGroupDialog(group: Group) {
        this._matDialog.open(AddEditGroupComponent, {
            data: group
        }).afterClosed().subscribe(e => {
            if(e){
                this.userService.groupTriggerRefresh();
            }
        });
    }

    openGroupUserAssignmentDialogBox(group: Group) {
        this._matDialog.open(AddEditRolesGroupComponent, {
                data: {
                    group : group,
                    roles: this.roles
                }
            }
        ).afterClosed().subscribe(e => {
            if(e){
                this.userService.groupTriggerRefresh();
            }
        });
    }

    editUserGroups(group: Group) {
        this._matDialog.open(AddEditUsersGroupComponent, {
                data: {group : group,
                    kcUsers: this.users
                }
            }
        ).afterClosed().subscribe(e => {
            if(e){
                this.userService.groupTriggerRefresh();
            }
        });
    }
}
