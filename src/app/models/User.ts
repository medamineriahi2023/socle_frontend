
export interface User {
     id : string;
    firstName : string;
    lastName : string;

    email: string;

    userName: string;

    password:string;

    phone : string;

    active? : boolean;
    isDeliveryMan? : boolean;
    imageUrl?: string;

}
