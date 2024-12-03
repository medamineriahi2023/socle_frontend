import {RequestedProductQuantity} from "./RequestedProductQuantity";
import {Method} from "./Method";

export class PaymentHistory {

    id: string;
    billTo: string;
    address: string;
    phoneNumber: string;
    requestedProducts: RequestedProductQuantity[];
    discount: number;
    tax: number;
    currency: string;
    imageUrl: string;
    invoiceUrl?: string;
    paymentMethod?: Method;
    updateDate: Date;
    creationDate: Date;
    constructor(
        id: string,
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
