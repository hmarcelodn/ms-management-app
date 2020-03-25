// Framework
import { Service } from "typedi";
import { getCustomRepository } from "typeorm";

// Local
import { ServiceCategory } from "../entity/ServiceCategory";
import { ServiceCategoryRepository } from "../repository/ServiceCategoryRepository";
import { ServiceCategoryModel } from "../model/ServiceCategoryModel";

@Service()
export class ServiceCategoryService{
    async create(model: ServiceCategoryModel): Promise<ServiceCategory>{
        const repoServiceCategory = getCustomRepository(ServiceCategoryRepository);
        const instance = ServiceCategory.instance(model.name, null);

        return await repoServiceCategory.save(instance);
    }

    async get(uuid: string): Promise<ServiceCategory>{
        const repoServiceCategory = getCustomRepository(ServiceCategoryRepository);

        return await repoServiceCategory.findOne(uuid);
    }

    async getAll(): Promise<Array<ServiceCategory>>{
        const repoServiceCategory = getCustomRepository(ServiceCategoryRepository);

        return await repoServiceCategory.find();        
    }
}