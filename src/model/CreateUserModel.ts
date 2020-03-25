// Framework
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserModel {

    @IsNotEmpty()
    public userName: string;

    @IsNotEmpty()
    public firstName: string;

    @IsNotEmpty()
    public lastName: string;

    @IsEmail()
    @IsNotEmpty()
    public emailAddress: string;

    @IsNotEmpty()
    public password: string;

}