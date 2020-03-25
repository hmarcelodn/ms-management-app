// Framework
import { IsNotEmpty } from "class-validator";

export class SearchDevicesModel{
    @IsNotEmpty()
    public latitude: string;

    @IsNotEmpty()
    public longitude: string;

    @IsNotEmpty()
    public categoryGuid: string;

}