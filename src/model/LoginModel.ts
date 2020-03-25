// Framework
import { IsEmail } from "class-validator";

export class LoginModel{
    @IsEmail()
    public email: string;

    
    public password: string;
}