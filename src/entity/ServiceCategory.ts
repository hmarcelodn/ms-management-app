// Framework
import {Entity, Column, BeforeInsert, PrimaryColumn} from "typeorm";
import * as uuid from "uuid/v4";

// Local-Deps
import { IIdentificable } from "./interfaces/IIdentificable";
import { User } from "./User";

@Entity()
export class ServiceCategory implements IIdentificable {

    @PrimaryColumn("uuid") id: string;

    @Column()  
    name: string;

    @Column({
        nullable: true
    })   
    parent_id: string;

    @BeforeInsert()
    addId(){
        this.id = uuid();
    }

    public static instance(name: string, parentId?:string): ServiceCategory{
        let instance = new ServiceCategory();
        instance.setName(name);

        if(parentId){
            instance.setParentId(parentId);
        }

        return instance;
    }
    
    public setName(name: string): void{
        this.name = name;
    }

    public setParentId(id: string): void{
        this.parent_id = id;
    }
    
}