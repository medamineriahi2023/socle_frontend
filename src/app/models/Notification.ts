import {Command} from "./Command";
import {NotificationType} from "./NotificationType";

export class Notification {
    id: number;
    commandDto: Command;
    senderId: number;
    receiverId: number;
    notificationType: NotificationType;
}
