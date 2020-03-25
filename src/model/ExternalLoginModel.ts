// Framework
import { IsEmail, IsBoolean, IsNotEmpty, IsUrl } from "class-validator";

export class ExternalLoginModel{

    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @IsBoolean()
    @IsNotEmpty()
    public isVerified: boolean;

    @IsUrl()
    @IsNotEmpty()
    public picture: string;

    @IsNotEmpty()
    public accessToken: string;

    @IsNotEmpty()
    public firstName: string;

    @IsNotEmpty()
    public lastName: string;
}