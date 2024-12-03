import {Component, Input} from '@angular/core';
import {MessageService} from "primeng/api";
import {Notification} from "../../../models/Notification";

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss']
})
export class NotificationModalComponent {
    constructor(private messageService: MessageService) {}

    visible: boolean = false;
    @Input() notification!: Notification;
}
