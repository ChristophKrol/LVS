import { Category } from "../enum/category.enum";

export interface Item {
    id: number;
    category: Category;
    name: string;
    price: number;
    space: number;
}