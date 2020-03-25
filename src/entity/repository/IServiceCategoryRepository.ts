// Local
import { ServiceCategory } from "../ServiceCategory";

export interface IServiceCategoryRepository{
    getByName(name: string): Promise<ServiceCategory>;
}