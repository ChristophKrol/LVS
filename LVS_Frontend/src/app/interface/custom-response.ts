import { CatPriceSum } from './catpricesum';
import { Item } from "./item";
import { CatGrouped } from "./catgrouped";

export interface CustomResponse {
    timestamp: Date;
    statusCode: number;
    status: string;
    reason: string;
    message: string;
    developerMessage: string;
    data:{items?: Item[], item?: Item, catGroup?: CatGrouped[], catPriceSum?: CatPriceSum[]}; //Für später: storages: Storage[], storage: Storage

}