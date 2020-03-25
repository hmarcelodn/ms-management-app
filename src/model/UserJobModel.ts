// Framework
import { IsNotEmpty } from "class-validator";

export class UserJobModel{
    @IsNotEmpty()
    public userGuid: string;

    @IsNotEmpty()
    public categoryGuid: string;
}