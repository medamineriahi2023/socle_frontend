import {TypeOfInventory} from "./TypeOfInventory";
import {Product} from "./Product";

export class Inventory {
    id: number;
    name: string;
    type: TypeOfInventory;
    address: string;
    responsableUserId: string;
    products: Product[];
    taxes?: Number[];
    imageUrl?: string;
    phone?: string;
    currency?: string;
    lat?: string;
    radius?: number;
    layerType?: string;
    lan?: string;
    commercialEmailAddress?: string;
    registrationNumber?: string;
}
