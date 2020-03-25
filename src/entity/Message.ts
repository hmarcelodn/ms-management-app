// Framework
import { Entity, PrimaryColumn, Column, BeforeInsert, OneToOne } from "typeorm";
import * as uuid from "uuid/v4";

// Local
import { IIdentificable } from "./interfaces/IIdentificable";
import { UserSnapshot } from "./UserSnapshot";

@Entity()
export class Message implements IIdentificable{

    @PrimaryColumn("uuid") id: string;

    @Column()
    message: string;

    @OneToOne(type => UserSnapshot, { cascade: true })
    userFrom: UserSnapshot;

    @OneToOne(type => UserSnapshot, { cascade: true })
    userTo: UserSnapshot;
    
    @BeforeInsert()
    addId(): void{
        this.id = uuid();
    }

    addMessage(message: string){
        this.message = message;
    }
}