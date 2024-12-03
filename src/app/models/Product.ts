import {SubCategory} from "./SubCategory";
import {Characteristic} from "./Characteristics";
import {UnitOfMeasure} from "./UnitOfMesure";
import {Brand} from "./Brand";

export class Product {
    id?: number;
    barCode?: string;
    name?: string;
    description?: string;
    price?: number;
    subCategory?: SubCategory;
    imageUrl?: string;
    rating?: number;
    characteristics?: Characteristic[];
    unitOfMeasure?: UnitOfMeasure;
    brand: Brand;
    creationDate?: Date;
    updateDate?: Date;
}
