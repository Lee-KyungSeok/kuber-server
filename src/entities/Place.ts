import {
    BaseEntity, 
    Column, 
    CreateDateColumn,
    Entity, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn,
    ManyToOne
} from "typeorm"
import User from "./User";

@Entity()
class Place extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;

    @Column({type: "text"})
    name: string;

    @Column({type: "double precision", default: 0})
    lat: number;

    @Column({type: "double precision", default: 0})
    lng: number;

    @Column({type: "text"})
    address: string;

    @Column({type: "boolean", default: false})
    isFav: boolean;

    // user뒤에 Id 를 붙여주면 아무짓도 안해도 typeORM 이 알아서 userId 를 넣어준다.
    @Column({ nullable: true })
    userId:  number;

    // many place 는 one user 에 매핑
    @ManyToOne(type => User, user => user.places)
    user: User;


    @CreateDateColumn() createdAt: string;
    @UpdateDateColumn() updatedAt: string;
}

export default Place;