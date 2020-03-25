import { User } from "../../entity/User";

export interface IUserRepository{

    getByUserName(username: string):Promise<User>;

    getByEmailAddress(email: string): Promise<User>;

    getExistByEmailAddress(email: string): Promise<boolean>;

    getPasswordByUserName(username: string): Promise<string>;

    getByToken(token: string): Promise<User>;

    getByDeviceIds(deviceList: Array<string>, categoryGuid: string): Promise<Array<User>>;
}