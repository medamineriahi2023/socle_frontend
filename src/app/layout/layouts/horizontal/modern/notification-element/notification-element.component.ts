import {AfterViewInit, ChangeDetectorRef, Component, Input} from '@angular/core';
import {Command} from "../../../../../models/Command";
import {ListOfRequestsComponent} from "../../../../../components/modals/list-of-requests/list-of-requests.component";
import {MatDialog} from "@angular/material/dialog";
import {Status} from "../../../../../models/Status";

@Component({
    selector: 'app-notification-element',
    templateUrl: './notification-element.component.html',
    styleUrls: ['./notification-element.component.scss']
})
export class NotificationElementComponent implements AfterViewInit{
    @Input() command!: Command;
    @Input() isResponse!: boolean;
    requestAccepted: boolean = false;
    icon: string;
    severity: string;
    constructor(
        private _matDialog: MatDialog,
        private changeDetectorRef: ChangeDetectorRef
    ) {

    }

    ngAfterViewInit(): void {
        if (this.command != null){
        switch (this.command?.status){
            case Status.IN_DELIVERY:
                this.icon = "pi pi-truck";
                this.severity = "warning";
                break;
            case Status.REJECTED:
                this.icon = "pi pi-times";
                this.severity = "danger";
                break;
            case Status.IN_PROCESSING:
                this.icon = "pi pi-hourglass"
                this.severity = "warning";
                break;
            case Status.APPROVED:
                this.icon = "pi pi-receipt"
                this.severity = "success";
                break;
        }
        }
        this.changeDetectorRef.detectChanges();
    }

    openRequests() {
            this._matDialog.open(ListOfRequestsComponent, {
                data: {
                    command: this.command,
                    requests: this.command.productsRequested,
                    commandId: this.command.id,
                    readOnly: true
                }
            }).afterClosed().subscribe(e => {
                if (e){
                    this.requestAccepted = true;
                    this.command = e as Command;
                    this.ngAfterViewInit();
                    setTimeout(()=> {
                        this.requestAccepted = false;
                    }, 6000)

                }
            });
        }

    seeOnly() {
        this._matDialog.open(ListOfRequestsComponent, {
            data: {
                requests: this.command.productsRequested,
                commandId: this.command.id,
                readOnly: true,
                disabled: true,
                command: this.command
            }
        }).afterClosed().subscribe(e => {
            if (e){
                this.command = e as Command;
                this.ngAfterViewInit();
            }
        });
    }


    confirm() {
        this._matDialog.open(ListOfRequestsComponent, {
            data: {
                requests: this.command.productsRequested,
                commandId: this.command.id,
                readOnly: true,
                confirm: true
            }
        }).afterClosed().subscribe(e => {
            if (e){
                console.log(e);
                this.command = e as Command;
                this.ngAfterViewInit();
            }
        });
    }

    protected readonly Status = Status;
}
