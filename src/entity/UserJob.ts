// Framework
import {Entity, Column, BeforeInsert, PrimaryColumn, OneToMany, ManyToMany, OneToOne, JoinColumn, JoinTable} from "typeorm";
import * as uuid from "uuid/v4";
import moment = require("moment");

// Local
import { IIdentificable } from "./interfaces/IIdentificable";
import { User } from "./User";
import { ServiceCategory } from "./ServiceCategory";
import { USER_JOB_STATE } from "./UserJobState";
import { UserSnapshot } from "./UserSnapshot";

@Entity()
export class UserJob implements IIdentificable{

    @PrimaryColumn("uuid") id: string;

    @Column()
    status: number;

    @Column()
    statusReason: string;

    @OneToOne(type => UserSnapshot, { cascade: true })
    @JoinColumn()
    workerSnapshot: UserSnapshot;

    @OneToOne(type => UserSnapshot, { cascade: true })
    @JoinColumn()
    customerSnapshot: UserSnapshot;
    
    @ManyToMany(type => ServiceCategory, { cascade: true })
    @JoinTable()
    serviceCategory: ServiceCategory[];

    @Column({
        nullable: false
    })
    startDate: Date;

    @Column({
        nullable: true
    })
    endDate: Date;

    @BeforeInsert()
    addId(): void{
        this.id = uuid();
    }

    public static instance(){
        return new UserJob();
    }

    public create(worker: User, customer: User, category: ServiceCategory): void{
        this.workerSnapshot = worker.createSnapshot();
        this.customerSnapshot = customer.createSnapshot();
        this.serviceCategory = new Array<ServiceCategory>(category);
        this.status = USER_JOB_STATE.REQUESTED;
        this.statusReason = "Requested";
        this.startDate = moment().toDate();
    }

    public complete(): void{
        this.statusReason = "Completed";
        this.status = USER_JOB_STATE.COMPLETED;
        this.endDate = moment().toDate();
    }

    public reject(): void{
        this.statusReason = "Rejected";
        this.status = USER_JOB_STATE.REJECTED;
    }

}