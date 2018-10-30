import {
    BaseEntity, 
    Column, 
    CreateDateColumn,
    Entity, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn,
    BeforeInsert
} from "typeorm"
import { verificationTarget } from "../types/types";

const PHONE = "PHONE";
const EMAIL = "EMAIL";

@Entity()
class Verification extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;

    @Column({type: "text", enum: [PHONE, EMAIL]})
    target: verificationTarget;

    @Column({type: "text"})
    payload: string;

    // 인증번호
    @Column({type: "text"})
    key: string;

    // 폰번호가 verified 되었는지 확인
    @Column({type: "boolean", default: false})
    verified: boolean;

    @CreateDateColumn() createdAt: string;
    
    @UpdateDateColumn() updatedAt: string;

    @BeforeInsert()
    createKey(): void {
        // 키를 target 에 따라 다르게, random 함수를 이용해서 만든다. (phone 은 숫자 네자리, email 은 36진수)
        if(this.target === PHONE) {
            this.key = Math.floor(Math.random() * 100000).toString();
        } else if(this.target == EMAIL) {
            this.key = Math.random().toString(36).substr(2);
        }
    }
}

export default Verification;