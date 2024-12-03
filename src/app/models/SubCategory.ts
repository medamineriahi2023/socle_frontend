import {Category} from "./Category";

export class SubCategory {
    id: number;
    name: string;
    rankCode:string;
    color:string;
    characNames: string[];
    category?:Category
}
