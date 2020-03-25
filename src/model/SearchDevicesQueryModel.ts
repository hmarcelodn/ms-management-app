// Framework
import { IsNotEmpty, IsNumber } from "class-validator";

export class SearchDevicesQueryModel{

    @IsNotEmpty()
    @IsNumber()
    public radius: number;

    @IsNotEmpty()
    public latitude: string;

    @IsNotEmpty()
    public longitude: string;

}