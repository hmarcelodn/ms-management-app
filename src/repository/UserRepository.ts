// Framework
import { EntityRepository, Repository } from "typeorm";

// Entity
import { User } from "../entity/User";
import { IUserRepository } from "../entity/repository/IUserRepository";

@EntityRepository(User)
export class UserRepository extends Repository<User> implements IUserRepository{

    async getByGuid(id: string): Promise<User> {
        return await this.createQueryBuilder("user")
            .leftJoinAndSelect("user.categories", "categories")
            .where("user.id = :id", { id: id })
            .getOne();        
    }

    async getByToken(token: string): Promise<User> {
        return await this.createQueryBuilder("user")
            .leftJoinAndSelect("user.categories", "categories")
            .where("user.currentToken = :token", { token: token })
            .getOne();
    }

    async getByUserName(username: string): Promise<User> {
        return await this.createQueryBuilder("user")
                         .where("user.username = :username", { username: username })
                         .getOne();
    }
    
    async getByEmailAddress(email: string): Promise<User> {
        return await this.createQueryBuilder("user")
                         .where("user.emailAddress = :email", { email: email })
                         .getOne();
    }

    async getExternalByEmailAddress(email: string, type: string): Promise<User> {
        return await this.createQueryBuilder("user")
                         .where("user.emailAddress = :email", { email: email })
                         .andWhere("user.type = :type", { type: type })
                         .getOne();
    }    

    async getExistByEmailAddress(email: string): Promise<boolean> {
        return (await this.createQueryBuilder("user")
                         .where("user.emailAddress = :email", { email: email })
                         .getCount() > 0);
    }
    
    async getPasswordByUserName(username: string): Promise<string> {
        return await this.createQueryBuilder("user")
                         .where("user.username = :username", { username: username })
                         .select("user.password", "password")
                         .getRawOne();
    }

    async getUserByGuid(guid: string): Promise<User>{
        return await this.createQueryBuilder("user")
                         .where("user.id = :guid", { guid: guid })
                        .getOne();
    }

    async getUsersByIdList(ids: Array<number>): Promise<Array<User>>{
        return await this.findByIds(ids);
    }   

    async getByDeviceIds(deviceList: Array<string>, categoryGuid: string): Promise<Array<User>>{
       return await this.createQueryBuilder("user")
            .leftJoinAndSelect("user.categories", "category")
            .where("category.id = :guid", { guid: categoryGuid })
            .andWhere("user.deviceId IN (:...devices)", { devices: deviceList })
            .getMany();
    }
    
}