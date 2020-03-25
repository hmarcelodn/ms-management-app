// Framework
import {Entity, Column, BeforeInsert, PrimaryColumn, ManyToMany, JoinTable} from "typeorm";
import * as uuid from "uuid/v4";

// Local
import { IIdentificable } from "./interfaces/IIdentificable";
import { ServiceCategory } from "./ServiceCategory";
import { UserSnapshot } from "./UserSnapshot";

@Entity()
export class User implements IIdentificable {

    @PrimaryColumn("uuid") id: string;

    @Column()    
    password: string;

    @Column({
        nullable: true
    })    
    firstName: string;

    @Column({
        nullable: true
    })   
    lastName: string;

    @Column()    
    emailAddress: string;

    @Column()    
    enabled: boolean;

    @Column({
        nullable: true
    })    
    currentToken: string; 

    @Column({
        nullable: true
    })    
    attemps: number

    @Column()       
    type: string;

    @Column({
        nullable: true
    })  
    picture: string;

    @Column({
        nullable: true
    })    
    deviceId: string;

    @ManyToMany(type => ServiceCategory, { cascade: true })
    @JoinTable()
    categories: ServiceCategory[];

    @BeforeInsert()
    addId(){
        this.id = uuid();
    }

    public static create(): User{
        return new User();
    }

    public sumAttemps(): void{
        this.attemps++;
    }

    public cleanAttemps(): void{
        this.attemps = 0;
    }

    public setFirstName(firstName: string): void {
        this.firstName = firstName;
    }

    public setLastName(lastName: string): void {
        this.lastName = lastName;
    }

    public setEmailAddress(emailAddress: string): void {
        this.emailAddress = emailAddress;
    }

    public enable(): void {
        this.enabled = true;
    }

    public disable(): void{
        this.enabled = false;
    }

    public setPassword(passcode: string): void{
        this.password = passcode;
    }

    public isEnabled(): boolean{
        return this.enabled == true;
    }

    public setCurrentToken(token:string): void{
        this.currentToken = token;
    } 

    public setProvider(type: string){
        this.type = type;
    }

    public setInternal(){
        this.type = "Internal";
    }

    public getFullName(){
        return this.lastName + ", " + this.firstName;
    }

    public assingCategory(category: ServiceCategory){
        this.categories.push(category);
    }

    public createSnapshot(): UserSnapshot{
        return new UserSnapshot(this.id);
    }
    
}