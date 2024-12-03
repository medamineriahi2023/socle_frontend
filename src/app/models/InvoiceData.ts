import {RequestedProductQuantity} from "./RequestedProductQuantity";
import {Method} from "./Method";
import {Inventory} from "./Inventory";

export class InvoiceData {

    id: string;
    invoiceDate: Date;
    billTo: string;
    address: string;
    phoneNumber: string;
    requestedProducts: RequestedProductQuantity[];
    discount: number;
    tax: number;
    currency: string;
    imageUrl: string;
    invoiceUrl?: string;
    method?: Method;
    inventory?: Inventory;
    inventoryRequester?: Inventory;
    inventoryProvider?: Inventory;
    responsibleName?: string;

    constructor(
        id: string,
        invoiceDate: Date,
        billTo: string,
        address: string,
        phoneNumber: string,
        requestedProducts: RequestedProductQuantity[],
        discount: number,
        tax: number,
        currency: string,
        imageUrl: string
    ) {
        this.id = id;
        this.invoiceDate = invoiceDate;
        this.billTo = billTo;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.requestedProducts = requestedProducts;
        this.discount = discount;
        this.tax = tax;
        this.currency = currency;
        this.imageUrl = imageUrl;
    }
}
