// enum 같이 지정함.
export type verificationTarget = "PHONE" | "EMAIL";

export type rideStatus = 
    | "ACCEPTED" 
    | "FINISHED" 
    | "CANCELED" 
    | "REQUESTING"
    | "ONROUTE"