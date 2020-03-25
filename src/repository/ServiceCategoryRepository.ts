// Framework
import { Repository, EntityRepository } from "typeorm";

// Local
import { IServiceCategoryRepository } from "../entity/repository/IServiceCategoryRepository";
import { ServiceCategory } from "../entity/ServiceCategory";

@EntityRepository(ServiceCategory)
export class ServiceCategoryRepository extends Repository<ServiceCategory> implements IServiceCategoryRepository{
    async getByName(name: string): Promise<ServiceCategory> {
        return this.createQueryBuilder("category")
            .where("category.name = :name", { name: name })
            .getOne();
    }
}