import {
    BaseEntity, 
    Column, 
    CreateDateColumn,
    Entity, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn,
    ManyToOne,
    OneToOne,
    JoinColumn
} from "typeorm"
import { rideStatus } from "../types/types";
import User from "./User";
import Chat from "./Chat";

@Entity()
class Ride extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;

    @Column({
        type: "text", 
        enum: ["ACCEPTED" , "FINISHED" , "CANCELED" , "REQUESTING", "ONROUTE"],
        default: "REQUESTING"
    })
    status: rideStatus;

    @Column({type: "text"})
    pickUpAddress: string;

    @Column({type: "double precision", default: 0})
    pickUpLat: number;

    @Column({type: "double precision", default: 0}) 
    pickUpLng: number;
    
    @Column({type: "text"})
    dropOffAddress: string;

    @Column({type: "double precision", default: 0}) 
    dropOffLat: number;

    @Column({type: "double precision", default: 0}) 
    dropOffLng: number;

    @Column({type: "double precision", default: 0}) 
    price: number;

    @Column({type: "text"})  
    distance: string;

    @Column({type: "text"})  
    duration: string;

    @Column({nullable: true})
    passengerId: number;

    @ManyToOne(type => User, user => user.rideAsPassenger)
    passenger: User;

    @Column({nullable: true})
    driverId: number;

    @ManyToOne(type => User, user => user.rideAsDriver, { nullable: true})
    driver: User;

    @Column({nullable: true})
    chatId: number;

    @OneToOne(type => Chat, chat => chat.ride, {nullable: true}) // 처음에는 chat 이 없으니 nullable 하다.
    @JoinColumn() // 1:1 관계의 주인을 설정한다.
    chat: Chat;

    @CreateDateColumn() createdAt: string;
    @UpdateDateColumn() updatedAt: string;
}

export default Ride;