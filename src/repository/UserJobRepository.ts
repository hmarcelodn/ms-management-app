// Framework
import { Repository, EntityRepository } from "typeorm";

// Local
import { UserJob } from "../entity/UserJob";
import { IUserJobRepository } from "../entity/repository/IUserJobRepository";
import { USER_JOB_STATE } from "../entity/UserJobState";

@EntityRepository(UserJob)
export class UserJobRepository extends Repository<UserJob> implements IUserJobRepository {
    async getActive(customerId: string, workerId: string): Promise<UserJob> {
        return await this.createQueryBuilder("userJob")
            .innerJoinAndSelect("userJob.customerSnapshot", "customerSnapshot")
            .innerJoinAndSelect("userJob.workerSnapshot", "workerSnapshot")
            .where("customerSnapshot.userUuid = :customerId", { customerId: customerId })
            .andWhere("workerSnapshot.userUuid = :workerId", { workerId: workerId })
            .andWhere("userJob.status = :status", { status: USER_JOB_STATE.REQUESTED })
            .getOne();
    }
}