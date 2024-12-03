import {Inventory} from "./Inventory";
import {RequestedProductQuantity} from "./RequestedProductQuantity";
import {Status} from "./Status";

export class Command {
    id: number;
    productsRequested: RequestedProductQuantity[];
    inventory: Inventory;
    theRequesterInventory: Inventory;
    status: Status;
    updateDate: Date;
    creationDate: Date;
    invoicePdfUrl?: string;
    tva?: number;
}
