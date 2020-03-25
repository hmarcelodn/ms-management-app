// Framework
import { Service } from "typedi";
import { getCustomRepository } from "typeorm";

// Local
import { UserJobModel } from "../model/UserJobModel";
import { UserJob } from "../entity/UserJob";
import { UserJobRepository } from "../repository/UserJobRepository";
import { UserRepository } from "../repository/UserRepository";
import { ServiceCategoryRepository } from "../repository/ServiceCategoryRepository";
import { User } from "../entity/User";
import { UserNotFoundError } from "../entity/exception/UserNotFoundError";
import { CategoryNotFoundError } from "../entity/exception/CategoryNotFoundError";
import { UserJobAlreadyRequestedError } from "../entity/exception/UserJobAlreadyRequestedError";

@Service()
export class UserJobService{
    async request(user: User, model: UserJobModel): Promise<UserJob>{
        const repoServiceCategory = getCustomRepository(ServiceCategoryRepository);
        const repoUserJob = getCustomRepository(UserJobRepository);
        const repoUser = getCustomRepository(UserRepository);

        const instanceWorker = await repoUser.findOne(model.userGuid);
        const instanceCategory = await repoServiceCategory.findOne(model.categoryGuid);

        if(!instanceWorker){
            throw new UserNotFoundError("The customer was not found.");
        }

        if(!instanceCategory){
            throw new CategoryNotFoundError("The requested category was not found.");
        }
        
        const instance = UserJob.instance();        
        instance.create(instanceWorker, user, instanceCategory);

        if(!await repoUserJob.getActive(user.id, instanceWorker.id)){
            return await repoUserJob.save(instance);
        }      
        
        throw new UserJobAlreadyRequestedError("The customer already requested this job.");
    }

    async complete(model: any): Promise<void>{
        const repoUserJob = getCustomRepository(UserJobRepository);

        let instance = await repoUserJob.findOne(model.id);
        instance.complete();

        repoUserJob.save(instance);
    }

    async reject(model: any): Promise<void>{
        const repoUserJob = getCustomRepository(UserJobRepository);

        let instance = await repoUserJob.findOne(model.id);
        instance.reject();

        repoUserJob.save(instance);
    }


    async get(id: string): Promise<UserJob>{
        const repoUserJob = getCustomRepository(UserJobRepository);

        return repoUserJob.findOne(id);
    }

}