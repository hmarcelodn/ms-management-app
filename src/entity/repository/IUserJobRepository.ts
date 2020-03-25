// Local
import { UserJob } from "../UserJob";

export interface IUserJobRepository{
    getActive(customerId: string, workerId: string):Promise<UserJob>;
}