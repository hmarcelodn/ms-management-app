// Framework
import { Entity, PrimaryColumn, Column, BeforeInsert } from "typeorm";
import * as uuid from "uuid/v4";

@Entity()
export class UserSnapshot{

    constructor(uuid: string){
        this.userUuid = uuid;
    }

    @PrimaryColumn("uuid") id: string;

    @Column()  
    userUuid: string;

    @BeforeInsert()
    addId(): void{
        this.id = uuid();
    }
}