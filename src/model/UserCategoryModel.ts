// Framework
import { IsNotEmpty } from "class-validator";

export class UserCategoryModel{
    @IsNotEmpty()
    public categoryGuid: string;
}