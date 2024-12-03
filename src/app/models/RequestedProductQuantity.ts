import {Product} from "./Product";

export class RequestedProductQuantity {
    product: Product;
    quantity: number;
    verified: boolean = false;
    existQuantity?: number;
}
