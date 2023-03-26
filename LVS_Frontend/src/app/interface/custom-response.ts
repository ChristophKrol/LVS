import { Item } from "./item";

export interface CustomResponse {
    timestamp: Date;
    statusCode: number;
    status: string;
    reason: string;
    message: string;
    developerMessage: string;
    data:{items?: Item[], item?: Item}; //Für später: storages: Storage[], storage: Storage

}