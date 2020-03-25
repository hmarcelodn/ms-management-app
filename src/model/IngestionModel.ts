// Framework
import { IsNotEmpty } from "class-validator";

export class IngestionModel{

    @IsNotEmpty()
    latitude: string;

    @IsNotEmpty()
    longitude: string;

    @IsNotEmpty()
    deviceId: string;
}