// Framework
import { IsNotEmpty } from "class-validator";

export class ServiceCategoryModel{
    @IsNotEmpty()
    public name: string;
}